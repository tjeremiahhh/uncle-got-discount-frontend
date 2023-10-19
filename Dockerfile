# base image
FROM node:18 as build

# set working directory
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

FROM node:alpine as main

COPY --from=build . .

# RUN npm run build --prod

EXPOSE 4200

CMD ["npm", "start"]