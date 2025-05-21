FROM node:14
WORKDIR /usr/src/app/frontend
COPY package*.json ./
RUN npm ci
COPY . .

# https://create-react-app.dev/docs/adding-custom-environment-variables/
ARG FRONTEND_ENV_FILE_B64
RUN if [ ! -f .env ]; then \
        echo "$FRONTEND_ENV_FILE_B64" | base64 -d > .env; \
    else \
        echo ".env already exists, skipping write."; \
    fi
RUN npm run build

# Switch to non-root user
RUN useradd --uid 12345 --create-home --shell /bin/bash user12345
RUN chown -R user12345:user12345 /usr/src/app
USER user12345

EXPOSE 3000
CMD ["npm", "run", "production"]
