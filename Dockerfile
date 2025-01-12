FROM nginx:alpine

WORKDIR /usr/share/nginx/html

COPY login ./login
COPY main ./main
COPY register ./register

COPY default.conf /etc/nginx/conf.d/default.conf
