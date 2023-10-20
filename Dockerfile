# base image
FROM node:18 as build

# set working directory
WORKDIR /usr/dist/uncle-got-discount-frontend

COPY package*.json ./

FROM node:18-alpine as main

COPY --from=build /usr/dist/uncle-got-discount-frontend /

RUN npm ci
RUN npm install
RUN npm run build --prod

EXPOSE 4200

CMD ["npm", "start"]