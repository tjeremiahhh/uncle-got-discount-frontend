# base image
FROM node:18-alpine as build

# set working directory
WORKDIR /usr/src/app
COPY package*.json ./
# RUN npm install

# RUN npm ci
# RUN npm install
# RUN npm run build --prod

EXPOSE 4200

CMD ["npm", "start"]