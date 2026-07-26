import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.ethereal.email",
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER || "",
    pass: process.env.SMTP_PASS || "",
  },
});

export async function POST(request: Request) {
  try {
    const { to, subject, html } = await request.json();

    if (!to || !subject || !html) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      return NextResponse.json({ sent: false, note: "SMTP not configured. Set SMTP_HOST, SMTP_USER, SMTP_PASS env vars." });
    }

    await transporter.sendMail({
      from: `"The Archivist" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    });

    return NextResponse.json({ sent: true });
  } catch (err) {
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}
