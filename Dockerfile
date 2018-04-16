FROM node:latest
WORKDIR /image
COPY package.json /image
RUN npm install
COPY . /image
CMD npm start
EXPOSE 3000