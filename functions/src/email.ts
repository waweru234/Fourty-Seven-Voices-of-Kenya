import * as nodemailer from "nodemailer";

// Email configuration
const emailConfig = {
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
};

// Create transporter
const transporter = nodemailer.createTransport(emailConfig);

// Email template interface
interface EmailTemplate {
  subject: string;
  html: string;
}

// Email templates
const emailTemplates = {
  welcome: (name: string): EmailTemplate => ({
    subject: "Welcome to Voices of Kenya!",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1a5f7a;">Welcome to Voices of Kenya!</h2>
        <p>Dear ${name},</p>
        <p>Welcome to our community! We're excited to have you join us.</p>
      </div>
    `
  }),
  verification: (name: string, verificationLink: string): EmailTemplate => ({
    subject: "Verify Your Email",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1a5f7a;">Email Verification</h2>
        <p>Dear ${name},</p>
        <p>Please click the link below to verify your email:</p>
        <a href="${verificationLink}" style="display: inline-block; padding: 10px 20px; background-color: #1a5f7a; color: white; text-decoration: none; border-radius: 5px;">Verify Email</a>
      </div>
    `
  }),
  resetPassword: (name: string, resetLink: string): EmailTemplate => ({
    subject: "Reset Your Password",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1a5f7a;">Password Reset</h2>
        <p>Dear ${name},</p>
        <p>Click the link below to reset your password:</p>
        <a href="${resetLink}" style="display: inline-block; padding: 10px 20px; background-color: #1a5f7a; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a>
      </div>
    `
  })
};

// Send email function
export const sendEmail = async (
  to: string,
  templateName: keyof typeof emailTemplates,
  data: Record<string, string>
): Promise<boolean> => {
  try {
    const template = emailTemplates[templateName](data.name, data.link);
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject: template.subject,
      html: template.html
    });
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
}; 