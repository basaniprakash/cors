FROM nginx:latest

RUN mkdir -p /etc/nginx/ssl/

COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 4443

CMD ["nginx", "-g", "daemon off"]
