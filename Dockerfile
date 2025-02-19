FROM oven/bun:1 AS base

WORKDIR /app

COPY ./package.json ./
COPY ./bun.lock ./

RUN bun install

COPY src/ ./
COPY static/ ./
COPY ./svelte.config.js ./
COPY ./tsconfig.json ./
COPY ./vite.config.ts ./

FROM nginx
COPY --from=base /app/build /usr/share/nginx/html