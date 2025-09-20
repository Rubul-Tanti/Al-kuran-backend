const nodemailer = require("nodemailer");
const { EMAILCLR, EMAIL, EMAILPASS, EMAILPORT } = require("../config/envConfig");
const { ApiError } = require("../middleware/Error");

// const transporter = nodemailer.createTransport({
//   host: EMAILCLR,
//   port: EMAILPORT,
//   secure: EMAILPORT == 465,
//   auth: {
//     user: EMAIL,
//     pass: EMAILPASS,
//   },
//   pool: true,
//   maxConnections: 5,
//   maxMessages: 100,
//   rateLimit: 10,
// });

const transporter = nodemailer.createTransport({
        service:"gmail",
        port:"465",
        secure:false,
        auth:{
          user:"hashenger@gmail.com"
          , pass:"svtp tusp prny gbin"
        }
      })
      
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ Email server not ready:", error);
  } else {
    console.log("✅ Email server ready for sending messages");
  }
});

/**
 * Send secure password email
 * @param {string} email - User's email address
 * @param {string} password - Securely generated password
 */
const sendPasswordEmail = async (email, password) => {
  try {
    const info = await transporter.sendMail({
      from: EMAIL,
      to: email,
      subject: `Qtuor - Your Secure Password`,
      text: `Hello,\n\nYour secure password is: ${password}\n\nPlease change it after logging in for better security.\n\nRegards,\nQtuor Team`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #333; max-width: 500px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #2d3748;">🔐 Qtuor - Secure Password</h2>
          <p>Hello,</p>
          <p>Your secure password is:</p>
          <h1 style="text-align: center; background: #f3f4f6; padding: 10px; border-radius: 8px; color: #111;">${password}</h1>
          <p>⚠️ For your security, please change this password immediately after your first login.</p>
          <br/>
          <p>Best Regards,</p>
          <p><a href="https://www.qtuor.com" style="color: #2563eb; text-decoration: none;">Qtuor Team</a></p>
        </div>
      `,
    });

    console.log("📩 Password Email sent:", info.messageId);
    return info;
  } catch (error) {
    console.error("❌ Failed to send password email:", error);
    throw new ApiError("Password email delivery failed", 500);
  }
};

module.exports = sendPasswordEmail;
