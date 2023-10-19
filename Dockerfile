FROM node:18-alpine as node

WORKDIR /src/app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build --prod

EXPOSE 4200

CMD ["npm", "start"]