/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */


// import {onRequest} from "firebase-functions/v2/https";
// import * as logger from "firebase-functions/logger";

import * as functions from "firebase-functions";

import Filter from "bad-words";
import * as admin from "firebase-admin";

admin.initializeApp();
const db = admin.firestore();

export const detectEvilUsers = functions.firestore
  .document("messages/{msgId}")
  .onCreate(
    async (doc, ctx) => {
      const filter = new Filter();
      const {text, uid} = doc.data();
      if (filter.isProfane(text)) {
        const cleaned = filter.clean(text);
        await doc.ref.update({
          text: `I got BANNED for life for saying... ${cleaned}`,
        });
        await db.collection("banned").doc(uid).set({});
      }
    }
  );

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
