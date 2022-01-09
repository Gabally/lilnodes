FROM docker:dind
COPY install-gVisor.sh .
RUN chmod +x install-gVisor.sh
RUN ./install-gVisor.sh
RUN /usr/local/bin/runsc install
RUN apk add --update npm
WORKDIR /usr/src/app
COPY src ./src
COPY package.json .
COPY tsconfig.json .
RUN npm install
RUN npm run build
RUN rm -rf src
RUN rm tsconfig.json
COPY startup.sh .
RUN chmod +x startup.sh
ENTRYPOINT ["/usr/src/app/startup.sh"]