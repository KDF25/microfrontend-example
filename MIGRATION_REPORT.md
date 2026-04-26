# Подробный отчет: Миграция монолита на микрофронтенды и деплой в AWS

Этот документ представляет собой пошаговый разбор выполненной работы по распилу монолитного React-приложения на микрофронтенды с использованием Webpack Module Federation, а также настройке непрерывной интеграции (CI/CD) через GitHub Actions и развертыванию серверной инфраструктуры в AWS с помощью Terraform.

---

## 1. Подготовка облака AWS (Bootstrapping)

Поскольку инфраструктура управляется через Terraform, нам нужно было место для безопасного хранения "состояния" (Terraform State). Хранить его локально или в Git нельзя.

### 1.1. Создание S3-бакета для State
В консоли AWS CloudShell мы вручную создали корзину S3 и включили версионирование, чтобы защититься от случайного удаления или повреждения файла состояния:
```bash
aws s3api create-bucket --bucket mf-tfstate-kdf25-999 --region us-east-1
aws s3api put-bucket-versioning --bucket mf-tfstate-kdf25-999 --versioning-configuration Status=Enabled
```

### 1.2. Установка Terraform в CloudShell
По умолчанию в некоторых версиях Amazon Linux (например, AL2023) Terraform отсутствует в репозиториях пакетного менеджера `yum`. Мы обошли эту проблему, скачав бинарный файл напрямую от HashiCorp и прописав его в глобальные переменные окружения:
```bash
wget https://releases.hashicorp.com/terraform/1.8.2/terraform_1.8.2_linux_amd64.zip
unzip -o terraform_1.8.2_linux_amd64.zip
mkdir -p ~/.local/bin
mv terraform ~/.local/bin/
export PATH="$HOME/.local/bin:$PATH"
```

### 1.3. Подключение бэкенда
Мы настроили Terraform на использование созданного S3-бакета. Из-за конфликтов старого локального кэша нам пришлось форсировать миграцию:
```bash
terraform init -reconfigure
```

---

## 2. Устранение инфраструктурных багов (Terraform)

При первом запуске `terraform apply` мы столкнулись с ошибкой валидации API AWS.

**Проблема:** Ошибка `The parameter EnableAcceptEncodingGzip is invalid for policy with caching disabled`.
**Причина:** В файле `infra/modules/static-site/main.tf` автор задания настроил CloudFront Cache Policy (`no_cache`) со временем жизни кэша (TTL) равным 0, но при этом оставил флаги сжатия (gzip/brotli) в значении `true`. AWS запрещает запрашивать сжатие для файлов, которые не кэшируются на краевых узлах (Edge Locations).

**Решение:**
Мы жестко отключили параметры сжатия для политики `no-cache`:
```hcl
  parameters_in_cache_key_and_forwarded_to_origin {
    enable_accept_encoding_gzip   = false
    enable_accept_encoding_brotli = false
    # ...
  }
```

---

## 3. Решение проблем с Typescript (React Error Boundary)

**Проблема:** Команда `pnpm typecheck` падала при проверке компонента отлова ошибок микрофронтендов (`RemoteBoundary.tsx`).
**Причина:** В проекте активировано строгое правило TypeScript `noImplicitOverride: true`. Компонент наследовался от базового класса `React.Component`, но его методы жизненного цикла (`render`, `componentDidCatch`) не были помечены соответствующим модификатором.

**Решение:**
Мы добавили ключевое слово `override` ко всем переопределяемым членам класса:
```tsx
export class RemoteBoundary extends React.Component<Props, State> {
  override state: State = { hasError: false };

  override componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("RemoteBoundary caught:", error, info);
  }

  override render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}
```

---

## 4. Починка CI/CD Линтера (ESLint)

**Проблема:** Пайплайн падал на шаге `pnpm -r lint` с двумя разными ошибками.

### Ошибка 4.1: Следы чужих фреймворков
**Симптом:** ESLint ругался, что не может найти конфиг `next/core-web-vitals`.
**Причина:** При генерации микрофронтендов (каталог, хост, аккаунт) в файлах `.eslintrc.cjs` остался мусор от Next.js, хотя наш проект работает на чистом Webpack.
**Решение:** Мы изменили директиву наследования на корневой конфиг монорепозитория:
```javascript
// Было
module.exports = { root: true, extends: ["next/core-web-vitals"] };
// Стало
module.exports = { root: true, extends: ["../../.eslintrc.cjs"] };
```

### Ошибка 4.2: Отсутствие TypeScript плагинов
**Симптом:** Корневой конфиг требовал `@typescript-eslint/eslint-plugin`, которого не было в системе.
**Причина:** Отсутствие зависимостей в корневом `package.json`.
**Решение:** Мы установили их глобально для монорепозитория:
```bash
pnpm add -wD @typescript-eslint/eslint-plugin @typescript-eslint/parser
```

---

## 5. Интеграция AWS OIDC и GitHub Actions

Последним шагом была связь деплой-пайплайнов с облаком AWS. Мы отказались от создания пользователя IAM и выпуска секретных ключей (Access Keys) в пользу **OIDC (OpenID Connect)**.

### 5.1 Выдача прав OIDC в GitHub
В каждый файл пайплайна (`.github/workflows/*.yml`) мы добавили разрешение на генерацию временного OIDC-токена:
```yaml
permissions:
  id-token: write
  contents: read
```

### 5.2. Настройка Secrets и Variables
Terraform выдал нам готовые ARN роли и адреса S3/CloudFront. Чтобы пайплайны GitHub Actions заработали, мы разнесли эти данные по разным хранилищам:

1. **Secrets (Секреты):**
   * `AWS_ROLE_ARN_DEV` — ARN IAM-роли, которую берет на себя GitHub. Это приватный токен, дающий полные права на S3 и CloudFront (поэтому мы спрятали его в Secrets).

2. **Variables (Открытые переменные):**
   * Названия бакетов (`HOST_BUCKET_DEV`, `CATALOG_BUCKET_DEV`).
   * CloudFront ID (`HOST_DIST_DEV`, `CATALOG_DIST_DEV`) — для сброса (invalidation) кэша.
   * Публичные URL (`CATALOG_URL_DEV`, `ACCOUNT_URL_DEV`) — они встраиваются (запекаются) Webpack-ом в хост-приложение на этапе билда, чтобы хост знал, по каким адресам скачивать файлы микрофронтендов (runtime remote resolution).

## Итог
Благодаря этим шагам мы получили полностью автоматизированный, type-safe и lint-clean проект, где пуш в папку `apps/catalog` приводит к мгновенному инкрементальному деплою отдельного бакета в AWS без затрагивания остальной системы.
