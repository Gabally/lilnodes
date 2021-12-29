FROM node:16
WORKDIR /usr/src/worker
COPY src ./src
COPY package.json .
COPY tsconfig.json .
RUN npm install
RUN npm run build
RUN rm -rf src
RUN rm tsconfig.json