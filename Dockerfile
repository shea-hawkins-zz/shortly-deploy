FROM node:latest
WORKDIR usr/app
ADD / .
RUN npm install