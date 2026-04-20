# Build stage
FROM node:20-alpine AS build
WORKDIR /app
RUN corepack enable
COPY package.json pnpm-workspace.yaml ./
COPY apps/host/package.json apps/host/
COPY packages/types/package.json packages/types/
COPY packages/ui/package.json packages/ui/
COPY packages/config/package.json packages/config/
RUN pnpm install --frozen-lockfile || pnpm install
COPY apps/host apps/host
COPY packages packages
COPY tsconfig.base.json ./
# Remote URLs get baked in at build time via env vars. To rotate without a
# rebuild, flip to dynamic remotes and have the host fetch a manifest at
# runtime (see MENTOR_NOTES.md).
ARG CATALOG_URL
ARG ACCOUNT_URL
ENV CATALOG_URL=$CATALOG_URL ACCOUNT_URL=$ACCOUNT_URL
RUN pnpm --filter host build

# Runtime stage
FROM nginx:1.27-alpine
COPY apps/host/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/apps/host/dist /usr/share/nginx/html
EXPOSE 80
