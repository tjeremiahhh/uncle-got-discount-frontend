# base image
FROM node:18-alpine as build

# set working directory
RUN npm install -g @angular/cli
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build 

FROM node:18-alpine
WORKDIR /app
COPY --from=build /package*.json /
COPY --from=build /dist /dist
ENV NODE_ENV=production
EXPOSE 4200

CMD ["npm", "start"]