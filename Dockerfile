FROM node:18
WORKDIR /harhar-app
COPY . /harhar-app
RUN npm install
EXPOSE 3000
CMD [ "npm","run","dev" ]

