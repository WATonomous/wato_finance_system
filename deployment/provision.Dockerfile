FROM python:3.12-alpine

RUN apk add --no-cache py3-pip curl unzip && \
    pip install --no-cache-dir typer

# Install Terraform 1.11.0
RUN curl -LO https://releases.hashicorp.com/terraform/1.11.0/terraform_1.11.0_linux_amd64.zip && \
    unzip terraform_1.11.0_linux_amd64.zip && \
    mv terraform /usr/local/bin/ && \
    chmod +x /usr/local/bin/terraform && \
    rm terraform_1.11.0_linux_amd64.zip

WORKDIR /app
COPY ./deployment /app
