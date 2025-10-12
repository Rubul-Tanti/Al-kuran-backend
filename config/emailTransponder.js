const nodemailer = require("nodemailer");
const env=require("dotenv")
env.config()

      const  EMAIL=process.env.EMAIL
    const EMAILPASS=process.env.EMAILPASS
    const EMAILPORT=process.env.EMAILPORT
     const EMAILCLR=process.env.EMAILCLR
     console.log(EMAIL)
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