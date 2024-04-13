# Setup Guide - LOCAL

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
WATO_FINANCE_ATLAS_URI=<YOUR_MONGO_ATLAS_URI_HERE>
WATO_FINANCE_MAILJET_API_KEY=<YOUR_MAILJET_API_KEY>
WATO_FINANCE_MAILJET_SECRET_KEY=<YOUR_MAILJET_SECRET_KEY>
WATO_FINANCE_FINANCE_EMAIL=<EMAIL_WHERE_YOU_WANT_TO_SEND_FROM>
WATO_FINANCE_EMAIL_RECIPIENTS=<EMAILS_TO_RECEIVE_SEPERATED_BY_COMMA_(NO_SPACE)>
WATO_FINANCE_CLIENT_URL=http://localhost:3000
```

In order to upload attachments, AWS credentials are needed. To access a role that is already set up with policies on WATonomous' AWS account, please contact Victor.

```
WATO_FINANCE_AWS_SECRET_ACCESS_KEY=<YOUR_SECRET_ACCESS_KEY>
WATO_FINANCE_AWS_ACCESS_KEY_ID=<YOUR_ACCESS_KEY>
WATO_FINANCE_AWS_FINANCE_BUCKET_NAME=<S3_BUCKET_NAME>
```

To start the server, run

```
npm install -g nodemon
cd backend
nodemon start
```

### Permissions

Create a file `/backend/user_directory.json` that has the following shape. This will determine your approval levels. If for some reason you have multiple accounts, simply add more elements to the array.
In the production environment this file is mounted automatically based on https://github.com/WATonomous/infra-config/tree/master/directory/users/data

```
[
    {
        finance_system: {
        email: <YOUR_WATO_EMAIL>
        enabled: true
        membership: 'Administrator' | 'Member'
        }
    }
 ]
```

### Generating seeding data

To generate seed data, in the terminal in the backend directory, you must first add an additional environment variable to `backend/.env`. Note that this is the same firebase api key as the web app, instructions can be found later in this README.

`WATO_FINANCE_FIREBASE_API_KEY=<YOUR_FIREBASE_API_KEY>`

run:

```
npm run seeddata
```

or

```
npm run seeddata-prod
```

Note that this step is not optional due to the fact we need to inject wato cash's id as it is a special case for a funding item. The -prod version will only create the wato cash fund, and no dummy data will be created.

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
REACT_APP_WATO_FINANCE_API_KEY=<YOUR_FIREBASE_API_KEY>
REACT_APP_WATO_FINANCE_AUTH_DOMAIN=<YOUR_FIREBASE_AUTH_DOMAIN>
REACT_APP_WATO_FINANCE_PROJECT_ID=<YOUR_FIREBASE_PROJECT_ID>
REACT_APP_WATO_FINANCE_STORAGE_BUCKET=<YOUR_FIREBASE_STORAGE_BUCKET>
REACT_APP_WATO_FINANCE_MESSAGING_SENDER_ID=<YOUR_FIREBASE_MESSAGING_SENDER_ID>
REACT_APP_WATO_FINANCE_APP_ID=<YOUR_FIREBASE_API_ID>
REACT_APP_WATO_FINANCE_BACKEND_URL=http://localhost:5000
```

### Connect Backend to Project

1. To be able to use `firebase-admin`, select the gear icon next to the Project Overview screen
2. Go to **Project Settings** > **Service Accounts** and generate a new private key
3. Name the file `serviceAccountKey.json` and paste the JSON file in the "backend" folder

### Enable Google OAuth

1. In your Firebase Console, select Authentication on the left sidebarw
2. Select the Sign-in method tab, select Google, and then select Enable
3. Project public-facing name does not matter for dev environment, give it a nickname (`watofinance`) or not
4. Set Project support email to your own email
5. Select Save and ensure that the Google Provider has the Enabled Status

### Changing authorization for debugging

1. If you would like to change your authorization for debugging, set `REACT_APP_AUTH_OVERRIDE=ADMIN | TEAM_CAPTAIN | DIRECTOR` in the frontend env, and `AUTH_OVERRIDE=ADMIN | TEAM_CAPTAIN | DIRECTOR` in the backend env.

### Starting the app

To start the frontend, in a different terminal run

```
cd frontend
npm start
```

# Docker setup

Assuming your .env files are configured properly, you can run them in docker containers as well.

## Docker setup - frontend

```
cd frontend
docker build -t wato-finance-frontend .
docker run -p 3000:3000 -d wato-finance-frontend
```

## Docker setup - backend

```
cd backend
docker build -t wato-finance-backend .
docker run -p 5000:5000 -d wato-finance-backend
```

---

## Notes

### Running prettier

If you have created a pr and are getting failed pipelines due to prettier, run `npx prettier -w .` in the root directory
You can also configure prettier to run on save, by installing prettier and [following this guide](https://www.alphr.com/auto-format-vs-code)
