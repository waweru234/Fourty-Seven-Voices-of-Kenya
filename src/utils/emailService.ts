import { getFunctions, httpsCallable } from 'firebase/functions';

interface EmailData {
  email: string;
  name: string;
  subject?: string;
  message?: string;
  verificationLink?: string;
  resetLink?: string;
}

const functions = getFunctions();

// Send welcome email
export const sendWelcomeEmail = async (email: string, name: string) => {
  try {
    const sendWelcomeEmailFn = httpsCallable<EmailData, { success: boolean }>(
      functions,
      'sendWelcomeEmail'
    );
    const result = await sendWelcomeEmailFn({ email, name });
    return result.data.success;
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return false;
  }
};

// Send custom email
export const sendCustomEmail = async (email: string, name: string, subject: string, message: string) => {
  try {
    const sendCustomEmailFn = httpsCallable<EmailData, { success: boolean }>(
      functions,
      'sendCustomEmail'
    );
    const result = await sendCustomEmailFn({ email, name, subject, message });
    return result.data.success;
  } catch (error) {
    console.error('Error sending custom email:', error);
    return false;
  }
};

// Send verification email
export const sendVerificationEmail = async (email: string, name: string, verificationLink: string) => {
  try {
    const sendVerificationEmailFn = httpsCallable<EmailData, { success: boolean }>(
      functions,
      'sendVerificationEmail'
    );
    const result = await sendVerificationEmailFn({ email, name, verificationLink });
    return result.data.success;
  } catch (error) {
    console.error('Error sending verification email:', error);
    return false;
  }
};

// Send password reset email
export const sendPasswordResetEmail = async (email: string, name: string, resetLink: string) => {
  try {
    const sendPasswordResetEmailFn = httpsCallable<EmailData, { success: boolean }>(
      functions,
      'sendPasswordResetEmail'
    );
    const result = await sendPasswordResetEmailFn({ email, name, resetLink });
    return result.data.success;
  } catch (error) {
    console.error('Error sending password reset email:', error);
    return false;
  }
}; 