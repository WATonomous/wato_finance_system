# Setup Guide

After you clone the repository, run

```
npm install
```

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

### Create Project

1. Create a project at `console.firebase.google.com`
2. Name it `wato-finance-system`
3. Select parent resource/organization as `watonomous.ca`
4. Optionally add analytics then wait for project to be created

### Connect to web app

1. In the Project Overview screen, add your app by web app
2. Provide a nickname (`watofinance`) and do not enable Firebase Hosting
3. Look for the `firebaseConfig` constant and fill in the following info in the `.env` file you create in the "frontend" folder

```
REACT_APP_API_KEY=<YOUR_FIREBASE_API_KEY>
REACT_APP_AUTH_DOMAIN=<YOUR_FIREBASE_AUTH_DOMAIN>
REACT_APP_PROJECT_ID=<YOUR_FIREBASE_PROJECT_ID>
REACT_APP_STORAGE_BUCKET=<YOUR_FIREBASE_STORAGE_BUCKET>
REACT_APP_MESSAGING_SENDER_ID=<YOUR_FIREBASE_MESSAGING_SENDER_ID>
REACT_APP_APP_ID=<YOUR_FIREBASE_API_ID>
```

### Enable Google OAuth

1. In your Firebase Console, select Authentication on the left sidebarw
2. Select the Sign-in method tab, select Google, and then select Enable
3. Project public-facing name does not matter for dev environment, give it a nickname (`watofinance`) or not
4. Set Project support email to your own email
5. Select Save and ensure that the Google Provider has the Enabled Status

To start the frontend, in a different terminal run

```
cd frontend
npm start
```

---

## Generate Seed Data

To generate seed data (generic testing data), in the terminal in the backend directory, run:

```
npm run generatedata
```
