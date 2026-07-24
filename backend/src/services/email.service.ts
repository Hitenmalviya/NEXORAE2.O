import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587', 10),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export const sendWelcomeEmail = async (
  to: string,
  data: {
    fullName: string;
    nexoraeId: string;
    collegeName: string;
    branch: string;
    year: string;
    isIEEE: boolean;
    enrollmentNumber?: string;
    contactNumber?: string;
    email?: string;
    ieeeId?: string;
  }
) => {
  const html = `
    <div style="background-color: #050505; color: #ffffff; font-family: sans-serif; padding: 20px;">
      <h2 style="color: #dc2626;">Welcome to NEXORAE 2.0!</h2>
      <p>Hi ${data.fullName},</p>
      <p>Thank you for registering. Your unique NEXORAE ID is:</p>
      <div style="background-color: #1a1a1a; border-left: 4px solid #dc2626; padding: 10px; margin: 20px 0; font-size: 24px; font-weight: bold;">
        ${data.nexoraeId}
      </div>
      <p><strong>Details:</strong></p>
      <ul>
        <li>College: ${data.collegeName}</li>
        <li>Branch: ${data.branch}</li>
        <li>Year: ${data.year}</li>
        <li>IEEE Member: ${data.isIEEE ? 'Yes' : 'No'}</li>
      </ul>
      <p>Keep this ID handy for event registrations.</p>
    </div>
  `;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject: 'Welcome to NEXORAE 2.0 — Your NEXORAE ID',
    html,
  });
};

export const sendPaymentConfirmedEmail = async (
  to: string,
  data: { fullName: string; nexoraeId: string; registrationId: string; eventName: string; eventDate: string; venue: string; amount: number; transactionId: string }
) => {
  const html = `
    <div style="background-color: #050505; color: #ffffff; font-family: sans-serif; padding: 20px;">
      <h2 style="color: #22c55e;">Registration Confirmed ✓</h2>
      <p>Hi ${data.fullName} (${data.nexoraeId}),</p>
      <p>Your payment of ₹${data.amount} for <strong>${data.eventName}</strong> has been successfully verified.</p>
      <div style="background-color: #1a1a1a; border-left: 4px solid #22c55e; padding: 10px; margin: 20px 0;">
        Registration ID: <strong>${data.registrationId}</strong>
      </div>
      <p><strong>Event Details:</strong></p>
      <ul>
        <li>Event: ${data.eventName}</li>
        <li>Date/Time: ${data.eventDate}</li>
        <li>Venue: ${data.venue}</li>
        <li>Transaction ID: ${data.transactionId}</li>
      </ul>
      <p>We look forward to seeing you at the event!</p>
    </div>
  `;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject: 'NEXORAE 2.0 — Registration Confirmed ✓',
    html,
  });
};

export const sendPaymentRejectedEmail = async (
  to: string,
  data: { fullName: string; nexoraeId: string; eventName: string; amount: number; adminNote?: string }
) => {
  const html = `
    <div style="background-color: #050505; color: #ffffff; font-family: sans-serif; padding: 20px;">
      <h2 style="color: #dc2626;">Payment Verification Required</h2>
      <p>Hi ${data.fullName} (${data.nexoraeId}),</p>
      <p>There was an issue verifying your payment of ₹${data.amount} for <strong>${data.eventName}</strong>.</p>
      <div style="background-color: #1a1a1a; border-left: 4px solid #dc2626; padding: 10px; margin: 20px 0;">
        <strong>Reason:</strong> ${data.adminNote || 'Invalid screenshot or details mismatch.'}
      </div>
      <p>Please log in to the website with your NEXORAE ID and resubmit the correct payment screenshot.</p>
    </div>
  `;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject: 'NEXORAE 2.0 — Payment Verification Required',
    html,
  });
};
