FROM node:22.14-alpine

WORKDIR /app

COPY package*.json .

RUN npm install

COPY . .

RUN npm run build

CMD ["node", "dist/main.js"]