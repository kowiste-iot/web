FROM node:18-alpine3.17 as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
#env variable
ENV VITE_STAGING_URL_BASE=/
ENV VITE_STAGING_AUTH_ENABLE=true

ENV VITE_DEV_URL_BASE=/
ENV VITE_DEV_AUTH_ENABLE=true


RUN npm run build

FROM nginx:1.24-alpine3.17

COPY --from=build /app/dist /usr/share/nginx/html
COPY --from=build /app/build/nginx/nginx.conf /etc/nginx/nginx.conf


EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
# ENTRYPOINT ["tail", "-f", "/dev/null"]



