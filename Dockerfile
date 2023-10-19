# base image
FROM node:18-alpine as node

# set working directory
WORKDIR /src/app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build --prod

EXPOSE 4200

CMD ["npm", "run", "ng serve"]