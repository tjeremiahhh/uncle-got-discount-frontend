# base image
FROM node:18-alpine as build

# set working directory
RUN npm install -g @angular/cli
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build --prod 

# FROM node:18-alpine
# WORKDIR /app
# COPY --from=build /app /app
# ENV NODE_ENV=production
# EXPOSE 4200

FROM nginx:1.19-alpine
RUN rm -rf /usr/share/nginx/html/*
COPY --from=build /usr/src/app/dist/uncle-got-discount-frontend /usr/share/nginx/html
COPY /nginx/nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
EXPOSE 443

# CMD ["npm", "start"]
CMD ["nginx", "-g", "daemon off;"]