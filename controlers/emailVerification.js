const otpModule = require("../db/otpSchema");
const StudentModel = require("../db/studenSchema");
const SendOtp = require("../utils/otp");
const GenerateOtp = require("../utils/createOtp");
const teacherModel = require("../db/teacerScheama");

const emailVerification = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: "Enter all Fields" });
    }

    const alreadyuser=await StudentModel.findOne({"persnalDetails.email":email});
    const alreadyteacher=await teacherModel.findOne({"persnalDetails.email":email});
    if (alreadyuser||alreadyteacher) {res.status(400).json({ success: false, message: "User already exists" });
      return;}
    const existingOtp = await otpModule.findOne({ email });

    if (existingOtp) {
      const TWO_MINUTES = 2 * 60 * 1000;
      const elapsed = Date.now() - existingOtp.createdAt.getTime();
      const remaining = TWO_MINUTES - elapsed;

      if (remaining > 0) {
        return res.status(400).json({
          success: false,
          message: `Cannot send OTP yet. Please wait ${Math.ceil(remaining / 1000)} seconds.`,
        });
      }

      // delete old OTP if expired
      await otpModule.findByIdAndDelete(existingOtp._id);
    }

    // Generate new OTP
      const otpLength=6
    const {info,otp} =await SendOtp(email,otpLength);

    if (!info.accepted) {
      return res.status(500).json({ success: false, message: "Something went wrong" });
    }
    const stored = await otpModule.create({ email, otp });
    if (!stored) {
      return res.status(400).json({ success: false, message: "Something went wrong" });
    }

    res.status(200).json({ success: true, message: "OTP has been sent to your email" });

  } catch (e) {
    console.log(req.body)
    console.error(e);
    res.status(500).json({ success: false, message: e });
  }
};

module.exports = emailVerification;
