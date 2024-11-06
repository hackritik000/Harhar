import nodemailer from "nodemailer";

export async function sendPasswordResetEmail(email, resetLink) {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: "ranjeetjeengar212000@gmail.com",
      pass: "5BE71BEDADCF243C2946E8457010CC779123",
    },
  });

  await transporter.sendMail({
    from: "ranjeetjeengar212000@gmail.com",
    to: email,
    subject: "Password Reset Request",
    text: `You requested a password reset. Click the link to reset your password: ${resetLink}`,
    html: `<p>You requested a password reset.</p><p><a href="${resetLink}">Click here to reset your password</a></p>`,
  });
}
