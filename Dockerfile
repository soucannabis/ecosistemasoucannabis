FROM node:18-alpine

RUN apk add --no-cache nano

WORKDIR /app

COPY public/ /app/public
COPY src/ /app/src
COPY package.json /app/
COPY config-overrides.js /app/
COPY .env.example /app/

RUN mv .env.example .env
RUN npm install

RUN npm run build

EXPOSE 3000

CMD ["npx", "serve", "-s", "dist"]

