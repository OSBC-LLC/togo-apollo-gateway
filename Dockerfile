FROM node:18-alpine3.15 AS build
WORKDIR /app

COPY ["package.json", "package-lock.json", "./"]

RUN npm install

COPY . .

CMD ["node", "index.js"]
