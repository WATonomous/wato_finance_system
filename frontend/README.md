# Setup Guide

After you clone the repository

To setup frontend in one terminal:

```
npm install
npm start
```

To setup backend,

create a `.env` file in the "backend" folder

**Create an account here to use mongo: https://cloud.mongodb.com/**

**Create an account here to use the email api: https://www.mailjet.com/**

```
ATLAS_URI=<YOUR_MONGO_ATLAS_URI_HERE>
MAILJET_API_KEY=<YOUR_MAILJET_API_KEY>
MAILJET_SECRET_KEY=<YOUR_MAILJET_SECRET_KEY>
FINANCE_EMAIL=<EMAIL_WHERE_YOU_WANT_TO_SEND_FROM>
```

Please contact Victor or Anson if you do not know how to set it up

In another terminal:

```
npm install -g nodemon
cd backend
npm install
nodemon start
```
