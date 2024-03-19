FROM node:20.11-bookworm

WORKDIR /app

COPY ./package.json .
COPY ./package-lock.json .

RUN npm install

COPY . .

# CMD npm start