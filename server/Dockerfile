FROM node:14

WORKDIR /app

COPY package.json package-lock.json /app/

RUN npm install

COPY . /app

EXPOSE 3001

ENV NODE_ENV=production

CMD ["node", "index.js"]
