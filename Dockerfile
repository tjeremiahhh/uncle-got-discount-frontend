# # base image
# FROM node:18-alpine as build

# # set working directory
# WORKDIR /usr/src/app
# COPY package*.json ./

# RUN npm ci
# RUN npm install

# COPY . .

# FROM node:18-alpine as main
# COPY --from=build ./ /

# WORKDIR /usr/src/app
# # RUN npm install
# # RUN npm run build --prod

# EXPOSE 4200

# CMD ["npm", "start"]

FROM 291367648766.dkr.ecr.ap-southeast-1.amazonaws.com/frontend:Latest AS builder

WORKDIR /app
COPY . /app
RUN npm install
RUN npm run build

FROM nginx:latest

COPY --from=builder /app/dist/ /usr/share/nginx/html

CMD ["/bin/sh",  "-c",  "envsubst < /usr/share/nginx/html/assets/env.template.js > /usr/share/nginx/html/assets/env.js && exec nginx -g 'daemon off;'"]