const teacherModel = require("../db/teacerScheama");
const otpModule = require("../db/otpSchema");
const hashpassword = require("../utils/hashpassword");
const uploadToCloudinary = require("../utils/uploadToCloudinary");
const { ApiError } = require("../middleware/Error");
const sendPasswordEmail = require("../utils/sendPassword");
const generatePassword = require("../utils/generatePassword");

const verifyOtpAndRegisterTeacher = async (req, res) => {
  try {
    const {
      email,
      dob,
      name,
      bio,
      gender,
      otp,
      educationDetails,
      country,
      phone,
      languages,
      specializations,
      rate,
    } = req.body;



   console.log(req.body,"rubul")
    if (
      !email || !dob || !name || !bio || !gender || !otp ||
      !educationDetails || !country ||
      !Array.isArray(languages) || languages.length === 0
    ) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    // User already exists?
    const alreadyUser = await teacherModel.findOne({ "persnalDetails.email": email });
    if (alreadyUser) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    // OTP validation
    const otpObject = await otpModule.findOne({ email });
    if (!otpObject) {
      return res.status(400).json({ success: false, message: "OTP expired or invalid" });
    }
console.log(otp,otpObject.otp)
    if (otp !== otpObject.otp) {
      return res.status(400).json({ success: false, message: "OTP not matched" });
    }

    // Delete OTP after success
    await otpModule.findByIdAndDelete(otpObject._id);

    // Generate and hash password
    const password = generatePassword(8);
    const hashedPassword = await hashpassword(password);

    // Upload images
    const getImageurl = async () => {
          const files = req.files;
      let profilePicture = "";
      let certificates = [];

      if (!files || files.length === 0) return { profilePicture, certificates };

      await Promise.all(
        files.map(async (file) => {
          const cloudinaryResult = await uploadToCloudinary(file);
          if (file.fieldname === "profilePicture") {
            profilePicture = cloudinaryResult;
          } else {
            certificates.push(cloudinaryResult);
          }
        })
      );

      return { profilePicture, certificates };
    };

    const resu = await getImageurl();

    // Create teacher
    const newTeacher = await teacherModel.create({
      persnalDetails: {
        name,
        email,
        gender,
        languageSpoken: languages,
        phone,
        profilePic: resu?.profilePicture,
        country,
        dob,
      },
      profesnalDetails: {
        specializations,
        bio,
        certificates: resu?.certificates,
        educationDetails,
        hourlyRate: rate,
      },
      password: hashedPassword,
    });

    if (!newTeacher) {
      return res.status(400).json({ success: false, message: "Something went wrong" });
    }

    // Send password email
    await sendPasswordEmail(email, password);

    return res.status(200).json({ message: "OTP matched", success: true, data: newTeacher });
  } catch (e) {
    console.error("Error in register teacher:", e);
    return res.status(500).json({ success: false, message: e.message || "Internal server error" });
  }
};

module.exports = verifyOtpAndRegisterTeacher;
