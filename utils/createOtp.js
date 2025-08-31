const crypto=require("crypto")
const GenerateOtp=(length)=>{
 const otp=crypto.randomInt(0,Math.pow(10,length))
return otp.toString().padStart(length,"0")
}
module.exports =GenerateOtp