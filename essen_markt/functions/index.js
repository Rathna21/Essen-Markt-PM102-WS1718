const functions = require('firebase-functions');
const express = require('express');


const app = express();
app.post('/login', (request, response) => {
    var text= request.body.mail;

    response.send(JSON.stringify(text));
}
);
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.app = functions.https.onRequest(app);
