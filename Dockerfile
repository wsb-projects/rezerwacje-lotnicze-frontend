FROM node AS builder
WORKDIR /app

COPY package.json .
COPY package-lock.yaml .

RUN npm install

COPY tsconfig.json .
COPY env.d.ts .
COPY tsconfig.app.json .
COPY tsconfig.node.json .

COPY vite.config.ts .
COPY eslint.config.js .

COPY public ./public
COPY src ./src
COPY index.html .

RUN npm build

FROM nginx
COPY --from=builder /app/dist /usr/share/nginx/html