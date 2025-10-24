const nodemailer = require("nodemailer");
const env=require("dotenv");
const { EMAIL, EMAILPASS, EMAILCLR, EMAILPORT } = require("./envConfig");
env.config()

 const transporter = nodemailer.createTransport({
  host: process.env.EMAILCLR, // mail.domain.com
  port: Number(process.env.EMAILPORT), // usually 465 or 587
  secure: Number(process.env.EMAILPORT) === 465,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAILPASS,
  },
  tls: {
    rejectUnauthorized: false, // 👈 allow self-signed certs
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
    console.log(EMAIL,EMAILPASS,EMAILCLR,EMAILPORT)
    console.log("✅ Email server ready for sending messages");
  }
});

    // const transporter = nodemailer.createTransport({
    //     service:"gmail",
    //     port:"465",
    //     secure:true,
    //     auth:{
    //       user:"hashenger@gmail.com"
    //       , pass:"svtp tusp prny gbin"
    //     }
    //   })

module.exports=transporter