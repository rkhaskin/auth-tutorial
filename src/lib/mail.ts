import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const domain = process.env.NEXT_PUBLIC_APP_URL;

export async function sendTwoFactorEmail(email: string, token: string) {
  await resend.emails.send({
    from: "Acme <onboarding@resend.dev>",
    to: [email],
    subject: "Confirm your email",
    html: `<p>Your 2FA code is ${token}</p>`,
  });
}

export async function sendVerificationEmail(email: string, token: string) {
  const confirmLink = `${domain}/auth/new-verification?token=${token}`;

  await resend.emails.send({
    from: "Acme <onboarding@resend.dev>",
    to: [email],
    subject: "Confirm your email",
    html: `<p>Click <a href=${confirmLink}>here</a> to confirm email</p>`,
  });
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetLink = `http://localhost:3000/auth/new-password?token=${token}`;

  await resend.emails.send({
    from: "Acme <onboarding@resend.dev>",
    to: [email],
    subject: "Reset password email",
    html: `<p>Click <a href=${resetLink}>here</a> to reset password</p>`,
  });
}
