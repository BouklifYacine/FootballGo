import nodemailer from "nodemailer";
import { render } from "@react-email/render";
import { ReactElement } from "react";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export async function sendEmail({
  to,
  subject,
  emailComponent,
}: {
  to: string;
  subject: string;
  emailComponent: ReactElement;
}) {
  const html = await render(emailComponent);

  try {
    const info = await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to,
      subject,
      html,
    });
    return { success: true, info };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error };
  }
}
