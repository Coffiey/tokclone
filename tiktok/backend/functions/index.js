/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

const db = admin.firestore();

exports.newUser = functions.auth.user().onCreate((user) => {
  return db
    .collection("user")
    .doc(user.uid)
    .create(JSON.parse(JSON.stringify(user)));
});

exports.counterCreate = functions.firestore
  .document(`post/{id}/{type}/{uid}`)
  .onCreate((_, context) => {
    let updateObj = {};
    if (context.params.type == "comment") {
      updateObj = {
        commentsCount: admin.firestore.FieldValue.increment(1),
      };
    }
    if (context.params.type == "likes") {
      updateObj = {
        likesCount: admin.firestore.FieldValue.increment(1),
      };
    }
    // if (context.params.type == "following") {
    //   updateObj = {
    //     followingCount: admin.firestore.FieldValue.increment(1),
    //   };
    // }
    return db.collection("post").doc(context.params.id).update({
      updateObj,
    });
  });

exports.counterDelete = functions.firestore
  .document(`post/{id}/{type}/{uid}`)
  .onDelete((_, context) => {
    if (context.params.type == "comment") {
      updateObj = {
        likesCount: admin.firestore.FieldValue.increment(-1),
      };
    }
    if (context.params.type == "likes") {
      updateObj = {
        likesCount: admin.firestore.FieldValue.increment(-1),
      };
    }
    // if (context.params.type == "following") {
    //   updateObj = {
    //     followingCount: admin.firestore.FieldValue.increment(-1),
    //   };
    // }
    return db.collection("post").doc(context.params.id).update({
      updateObj,
    });
  });

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
