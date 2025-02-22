FROM oven/bun:1 AS base

WORKDIR /app

COPY ./package.json ./
COPY ./bun.lock ./

RUN bun install

COPY ./svelte.config.js ./
COPY ./tsconfig.json ./
COPY ./vite.config.ts ./
COPY static/ ./static
COPY src/ ./src

RUN bun run build

FROM nginx
COPY --from=base /app/build /usr/share/nginx/html