# Setup Guide

After you clone the repository

To setup frontend in one terminal:

```
npm install
npm start
```

To setup backend,
create a `.env` file in the root folder

create a `.env` file in the "backend" folder

_MongoDB atlas URI_
Set the following config variable, which is your MongoDB atlas URI
ATLAS*URI=<YOUR_MONGO_ATLAS_URI_HERE>
\_Email Keys*
Create an account here to use the email api: https://www.mailjet.com/
MAILJET_API_KEY=<YOUR_MAILJET_API_KEY>
MAILJET_SECRET_KEY=<YOUR_MAILJET_SECRET_KEY>
FINANCE_EMAIL=<EMAIL_WHERE_YOU_WANT_TO_SEND_FROM>

Please contact Victor or Anson if you do not know how to set it up

In another terminal:

```
npm install -g nodemon
cd backend
npm install
nodemon start
```
