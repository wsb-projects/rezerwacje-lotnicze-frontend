FROM node AS builder
WORKDIR /app
RUN npm install -g pnpm

COPY package.json .
COPY pnpm-lock.yaml .

RUN pnpm install

COPY tsconfig.json .
COPY env.d.ts .
COPY tsconfig.app.json .
COPY tsconfig.node.json .

COPY vite.config.ts .
COPY eslint.config.js .

COPY public ./public
COPY src ./src
COPY index.html .

RUN pnpm build

FROM nginx
COPY --from=builder /app/dist /usr/share/nginx/html