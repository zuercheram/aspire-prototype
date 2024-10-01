FROM node:18 AS build

WORKDIR /app

COPY . .

RUN yarn set version 3.6.3
RUN yarn install
RUN yarn build

FROM nginx:alpine

COPY --from=build /app/default.conf.template /etc/nginx/templates/default.conf.template
COPY --from=build /app/dist /usr/share/nginx/html

# Expose the default nginx port
EXPOSE 80
EXPOSE 443

CMD ["nginx", "-g", "daemon off;"]
