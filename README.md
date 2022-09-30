# Setup Guide

After you clone the repository

To setup frontend in one terminal:
```
npm install 
npm start
```

To setup backend, 
create a `.env` file in the root folder 
Set the following config variable, which is your MongoDB atlas URI
ATLAS_URI=<YOUR_MONGO_ATLAS_URI_HERE>
Please contact Victor or Anson if you do not know how to set it up

In another terminal:
```
npm install -g nodemon
cd backend
npm install 
nodemon start
```
