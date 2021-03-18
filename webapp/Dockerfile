FROM node:12-alpine

ARG FONTAWESOME_NPM_AUTH_TOKEN

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
WORKDIR /home/node/app

COPY package*.json ./
COPY docker-npmrc.txt .npmrc
USER node
RUN npm ci

COPY --chown=node:node . .
RUN npx prisma generate

EXPOSE 8080
CMD [ "npm", "start" ]
