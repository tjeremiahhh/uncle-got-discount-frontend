# base image
FROM node:18-alpine as node

# set working directory
RUN mkdir /usr/src/app
WORKDIR /usr/src/app

#add `/usr/src/app/node_modules/.bin` to $PATH
ENV PATH /usr/src/app/node_modules/.bin:$PATH

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build --prod

EXPOSE 4200

CMD ["npm", "start", "ng serve"]