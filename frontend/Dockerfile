FROM node:14
WORKDIR /usr/src/app/frontend
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "production"]
