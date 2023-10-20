# base image
FROM node:18 as build

# set working directory
WORKDIR /app
COPY package*.json ./
RUN npm install

FROM node:18-alpine as main

COPY --from=build /app /

# RUN npm ci
# RUN npm install
# RUN npm run build --prod

EXPOSE 4200

CMD ["npm", "start"]