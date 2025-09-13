const nodemailer = require("nodemailer");
const {EMAILCLR,EMAIL,EMAILPASS,EMAILPORT}=require("../config/envConfig");
const { ApiError } = require("../middleware/Error");
const GenerateOtp = require("./createOtp");
const transporter = nodemailer.createTransport({
  host: EMAILCLR,                
  port: EMAILPORT,            
  secure: EMAILPORT == 465,     
  auth: {
    user: EMAIL,             
    pass: EMAILPASS,             
  },
  pool: true,
  maxConnections: 5,
  maxMessages: 100,
  rateLimit: 10,
});

transporter.verify((error, success) => {
  if (error) {
    console.error("❌ Email server not ready:", error);
  } else {
    console.log("✅ Email server ready for sending messages");
  }
});


const sendOtpEmail = async (email,length) => {
  try {
    const otp=await GenerateOtp(length)
    const info = await transporter.sendMail({
      from:EMAIL,
      to:email,
      subject: `Qtuor- Your OTP Code`,
      text: `Hello,\n\nYour OTP is ${otp}. It will expire in 2 min.\n\nRegards Qtuor Team`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #333; max-width: 500px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #2d3748;">🔐 Qtuor - One Time Password</h2>
          <p>Hello,</p>
          <p>Your OTP is:</p>
          <h1 style="text-align: center; background: #f3f4f6; padding: 10px; border-radius: 8px; color: #111;">${otp}</h1>
          <p>This OTP will expire in <b>5 minutes</b>. Please do not share it with anyone.</p>
          <br/>
          <p>Best Regards,</p>
          <p><a href="www.qtuor.com" style="color: #2563eb; text-decoration: none;">Qtuor Team</a></p>
        </div>
      `,
    });

    console.log("📩 OTP Email sent:", info.messageId);
    return {info,otp};
  } catch (error) {
    console.error("❌ Failed to send OTP email:", error);
    throw new ApiError(`${error.message}OTP email delivery failed`,500);
  }
};

module.exports = sendOtpEmail;

