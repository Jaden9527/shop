# STEP 1: Build
FROM node:8-alpine as builder

LABEL authors="anglny <64912766@qq.com>"

COPY package.json package-lock.json ./

RUN npm set progress=false && npm config set depth 0 && npm cache clean --force
RUN npm i && mkdir /cc && cp -R ./node_modules ./cc


WORKDIR /cc
COPY . .

RUN npm run build


EXPOSE 4200
CMD [ "node", "apps.js" ]