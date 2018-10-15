FROM node:6
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 9090
CMD [ "npm", "run", "start:dev" ]