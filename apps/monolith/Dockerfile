# Build stage
FROM node:20-alpine AS build
WORKDIR /app
RUN corepack enable
COPY package.json pnpm-workspace.yaml ./
COPY apps/monolith/package.json apps/monolith/
COPY packages/types/package.json packages/types/
COPY packages/ui/package.json packages/ui/
COPY packages/config/package.json packages/config/
RUN pnpm install --frozen-lockfile || pnpm install
COPY apps/monolith apps/monolith
COPY packages packages
COPY tsconfig.base.json ./
RUN pnpm --filter monolith build

# Runtime stage
FROM nginx:1.27-alpine
COPY apps/monolith/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/apps/monolith/dist /usr/share/nginx/html
EXPOSE 80
