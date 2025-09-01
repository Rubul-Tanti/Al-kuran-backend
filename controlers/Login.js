const comparePassword = require("../utils/comparePassword");
const StudentModel = require("../db/studenSchema");
const generateTokens = require("../utils/generateJwtToken");
const teacherModel = require("../db/teacerScheama");

const Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Enter all credentials" });
    }

    // find user
    const alreadyUser = await StudentModel.findOne({
      "persnalDetails.email": email,
    });
    const alreadyTeacher = await teacherModel.findOne({
      "persnalDetails.email": email,
    });

    if (!alreadyUser&&!alreadyTeacher) {
      return res
        .status(400)
        .json({ success: false, message: "Email or Password is incorrect" });
    }
const user=alreadyUser?alreadyUser:alreadyTeacher
    // compare passwords
    console.log(user)
    const matched = await comparePassword(
      user.password,
      password
    );
    if (!matched) {
      return res
        .status(400)
        .json({ success: false, message: "Email or Password is incorrect" });
    }

    // data to encode in JWT
    const data = {
      id: user._id,
      fullName: user.persnalDetails.fullName,
      role: user.role,
    };

    // generate tokens
    const { accessToken, refreshToken } = generateTokens(data);

    // store refresh token in cookie (secure)
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // HTTPS only in prod
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: data,
      accessToken,
    });
  } catch (e) {
    console.log("Login error:", e);
    return res.status(500).json({ success: false, message: e.message });
  }
};

module.exports = Login;
