FROM node:20-alpine AS build
WORKDIR /app
RUN corepack enable
COPY package.json pnpm-workspace.yaml ./
COPY apps/catalog/package.json apps/catalog/
COPY packages/types/package.json packages/types/
COPY packages/ui/package.json packages/ui/
COPY packages/config/package.json packages/config/
RUN pnpm install --frozen-lockfile || pnpm install
COPY apps/catalog apps/catalog
COPY packages packages
COPY tsconfig.base.json ./
# In prod, catalog's assets are served from its own CloudFront domain, so
# publicPath must be absolute — otherwise remoteEntry.js will request chunks
# relative to the host's domain and 404.
ARG PUBLIC_PATH
ENV PUBLIC_PATH=$PUBLIC_PATH
RUN pnpm --filter catalog build

FROM nginx:1.27-alpine
COPY apps/catalog/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/apps/catalog/dist /usr/share/nginx/html
EXPOSE 80
