# Setup Guide

After you clone the repository, run 

```
npm install
```
to install all packages
---
## Backend Configuration

create a `.env` file in the "backend" folder

**Create an account here to use mongo: https://cloud.mongodb.com/**

**Create an account here to use the email api: https://www.mailjet.com/**

Please contact Victor or Anson if you do not know how to set it up
```
ATLAS_URI=<YOUR_MONGO_ATLAS_URI_HERE>
MAILJET_API_KEY=<YOUR_MAILJET_API_KEY>
MAILJET_SECRET_KEY=<YOUR_MAILJET_SECRET_KEY>
FINANCE_EMAIL=<EMAIL_WHERE_YOU_WANT_TO_SEND_FROM>
```

To start the server, run

```
npm install -g nodemon
cd backend
npm install
nodemon start
```

---

## Frontend Configuration 

**Create an account here to get authentication working: https://firebase.google.com/**

Once you create a project and add a web app, fill in the following in the `.env` file you create in the "frontend" folder
```
REACT_APP_API_KEY=
REACT_APP_AUTH_DOMAIN=
REACT_APP_PROJECT_ID=
REACT_APP_STORAGE_BUCKET=
REACT_APP_MESSAGING_SENDER_ID=
REACT_APP_APP_ID=
```

To start the frontend, run 
```
cd frontend 
npm start
```