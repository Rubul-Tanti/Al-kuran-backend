const hashPassword=require("../utils/hashpassword")
const otpModule=require("../db/otpSchema")
const StudentModel=require("../db/studenSchema")
const { ApiError } = require("../middleware/Error")
const verifyotp=async(req,res)=>{
try{
const {email,fullName,password,gender,otp}  =req.body
  if (!email || !fullName || !password || !gender || !otp) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }
       const alreadyuser=await StudentModel.findOne({"persnalDetails.email":email});
    if (alreadyuser) {res.status(400).json({ success: false, message: "User already exists" });
      return;}
const otpobject=await otpModule.findOne({email}) 
if(!otpobject){
    return res.status(200).json({message:"otp expired"})
}
console.log(otpobject.otp)
if(otp==otpobject.otp){
    console.log("pass")
 const deletedobj=await otpModule.findByIdAndDelete(otpobject._id)
 const hashedPassword = await hashPassword(password);
const newStudent=await StudentModel.create({
    persnalDetails: {
        fullName,
        email
        ,gender},password:hashedPassword})
console.log(newStudent)
if(!newStudent){
    return res.status(400).json({success:false,message:"Something went wrong"})
}
res.status(200).json({message:"otp matched",success:true,data:newStudent})
}else{
    res.status(400).json({message:"otp not matched",success:false})
}
}catch(e){
    console.log(e)
throw new ApiError(e.message, 500);
} 
}
module.exports=verifyotp