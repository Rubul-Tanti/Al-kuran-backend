const nodemailer = require("nodemailer");
const env=require("dotenv")
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
