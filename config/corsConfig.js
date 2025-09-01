const cors = require("cors");

const corsConfig = cors({
  origin: (origin, callback) => {
    const allowedOrigin = ["http://localhost:5173","https://al-quran-kappa-one.vercel.app/"];
    if (!origin || allowedOrigin.includes(origin)) {
      callback(null,true);  
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization", "Accept-Version"],
  exposedHeaders: ["X-Total-Count", "Content-Range"],
  preflightContinue: false,
  credentials: true,
});

module.exports = corsConfig;
