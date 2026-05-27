FROM node:20-alpine

WORKDIR /app

# RUN npm install -g nodemon

COPY package.json .

RUN npm install

COPY . .

EXPOSE 8080

CMD ["node", "app.js"]