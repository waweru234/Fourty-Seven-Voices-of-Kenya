/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import { onCall } from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import { sendEmail } from "./email";
import * as functions from 'firebase-functions';

// Initialize Firebase Admin
admin.initializeApp();

// Type definitions
interface EmailData {
  email: string;
  name?: string;
  link?: string;
  resetLink?: string;
}

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

// Send welcome email
export const sendWelcomeEmail = onCall<EmailData>(async (request) => {
  // Check if the request is authenticated
  if (!request.auth) {
    throw new Error("User must be authenticated.");
  }

  const { email, name } = request.data;
  
  if (!email || !name) {
    throw new Error("Email and name are required.");
  }

  const success = await sendEmail(email, "welcome", { name });
  
  if (!success) {
    throw new Error("Failed to send welcome email.");
  }

  return { success: true };
});

// Send password reset email
export const sendPasswordResetEmail = onCall<EmailData>(async (request) => {
  const { email, resetLink } = request.data;
  
  if (!email || !resetLink) {
    throw new Error("Email and reset link are required.");
  }

  try {
    // Get user by email
    const user = await admin.auth().getUserByEmail(email);
    
    const success = await sendEmail(email, "resetPassword", { 
      name: user.displayName || "User",
      link: resetLink 
    });
    
    if (!success) {
      throw new Error("Failed to send password reset email.");
    }

    return { success: true };
  } catch (error) {
    console.error("Error sending password reset email:", error);
    throw new Error("Failed to process password reset request.");
  }
});

export const deleteUser = functions.https.onCall(async (data, context) => {
  // Check if the request is made by an admin
  if (!context.auth?.token.admin) {
    throw new functions.https.HttpsError(
      'permission-denied',
      'Only admins can delete users'
    );
  }

  try {
    const { uid } = data;
    await admin.auth().deleteUser(uid);
    return { success: true };
  } catch (error) {
    throw new functions.https.HttpsError(
      'internal',
      'Error deleting user from authentication'
    );
  }
});
