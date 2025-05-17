FROM node:14
WORKDIR /usr/src/app/backend
COPY package*.json ./
RUN npm install
COPY . .

# Switch to non-root user
RUN useradd --uid 12345 --create-home --shell /bin/bash user12345
RUN chown -R user12345:user12345 /usr/src/app
USER user12345

EXPOSE 5000
CMD ["node", "server.js"]
