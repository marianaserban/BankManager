const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');

const serviceAccount = require("./credentials/ticproject-e1e6d-firebase-adminsdk-fxhfj-e07f746b0d.json");

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore(); //this is the reference to the database

module.exports = db;
