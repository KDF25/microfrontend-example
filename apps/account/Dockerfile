FROM node:20-alpine AS build
WORKDIR /app
RUN corepack enable
COPY package.json pnpm-workspace.yaml ./
COPY apps/account/package.json apps/account/
COPY packages/types/package.json packages/types/
COPY packages/ui/package.json packages/ui/
COPY packages/config/package.json packages/config/
RUN pnpm install --frozen-lockfile || pnpm install
COPY apps/account apps/account
COPY packages packages
COPY tsconfig.base.json ./
ARG PUBLIC_PATH
ENV PUBLIC_PATH=$PUBLIC_PATH
RUN pnpm --filter account build

FROM nginx:1.27-alpine
COPY apps/account/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/apps/account/dist /usr/share/nginx/html
EXPOSE 80
