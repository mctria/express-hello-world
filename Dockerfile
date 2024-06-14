FROM ghcr.io/puppeteer/puppeteer:21.1.0

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

WORKDIR /usr/src/app

COPY package*.json ./

# Change permissions of the package-lock.json file
RUN chmod 777 package-lock.json

# RUN npm install
RUN npm ci

COPY . .

CMD [ "node", "index.js" ]