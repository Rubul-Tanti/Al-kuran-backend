const { ApiError } = require("../middleware/Error");
const StudentModel = require("../db/studenSchema"); // adjust path
const jwt = require("jsonwebtoken");
const env =require("../config/envConfig");
const teacherModel = require("../db/teacerScheama");
const fetchUser = async (req, res, next) => {
  try {
      // Extract refresh token from cookies
      const refreshToken = req.cookies.refreshToken;
      console.log(env.REFRESH_SECRET,refreshToken)
   
    if (!refreshToken) {
      return res.status(401).json({ success: false, message: "No refresh token provided" });
    }

    // Verify refresh token
    let decoded;
    try {
      decoded = jwt.verify(refreshToken,env.REFRESH_SECRET);
    } catch (err) {
      throw new ApiError("Invalid refresh token", 401);
    }

    // Fetch user from DB
    const student = await StudentModel.findById(decoded.id).select("-password"); 
    const teacher = await teacherModel.findById(decoded.id).select("-password"); 

    if (!student&&!teacher) {
      throw new ApiError("StudentModel not found", 404);
    }
    const user =student?student:teacher

    // Optionally issue a new access token
    const accessToken = jwt.sign(
      {user},
      process.env.JWTSECRET,
      { expiresIn: "15m" }
    );

    return res.status(200).json({
      success: true,
      user,
      accessToken,
    });
  } catch (e) {
    next(new ApiError(e.message, e.statusCode || 500));
  }
};

module.exports = { fetchUser };
