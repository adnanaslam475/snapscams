#Docker Container to run this api. 
FROM node:lts-buster

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3050

CMD [ "npm", "start" ]