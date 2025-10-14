// sendOtpEmail.js
const { Resend } =require("resend")
const GenerateOtp =require("./createOtp.js")
const dotenv =require ("dotenv");
const { ApiError } =require("../middleware/Error.js");

dotenv.config();

// Initialize Resend with API key
const resend = new Resend(process.env.RESEND_API_KEY);
console.log(process.env.RESEND_API_KEY,"rubulM")
const sendOtpEmail = async (email, length) => {
  try {
    const otp = await GenerateOtp(length);

    const {error,data} = await resend.emails.send({
      from: "Resend <onboarding@resend.dev>",       // verified Resend sender
      to: email,
      subject: "Qtuor - Your OTP Code",
      html: `
        <div style="font-family: Arial, sans-serif; color: #333; max-width: 500px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #2d3748;">🔐 Qtuor - One Time Password</h2>
          <p>Hello,</p>
          <p>Your OTP is:</p>
          <h1 style="text-align: center; background: #f3f4f6; padding: 10px; border-radius: 8px; color: #111;">${otp}</h1>
          <p>This OTP will expire in <b>5 minutes</b>. Please do not share it with anyone.</p>
          <br/>
          <p>Best Regards,</p>
          <p><a href="https://www.qtuor.com" style="color: #2563eb; text-decoration: none;">Qtuor Team</a></p>
        </div>
      `
    });
  if (error) {
    return console.error({ error });
  }
    console.log("📩 OTP Email sent via Resend:", data);
    return { info: response, otp };
  } catch (error) {
    console.error("❌ Failed to send OTP email:", error);
    throw new ApiError(`${error} OTP email delivery failed`, 500);
  }
};

module.exports= sendOtpEmail;
