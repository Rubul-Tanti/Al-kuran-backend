const jwt = require("jsonwebtoken");
const env= require("../config/envConfig");

const generateTokens = (payload) => {
  const accessToken = jwt.sign(payload,env.JWTSECRET, {
    expiresIn: "15m", // short life
  });

  const refreshToken = jwt.sign(payload,env.REFRESH_SECRET, {
    expiresIn: "7d", // long life
  });

  return { accessToken, refreshToken };
};

module.exports = generateTokens;
