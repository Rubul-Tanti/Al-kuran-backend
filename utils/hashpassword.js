const bcrypt=require("bcryptjs")
const hashPassword=async(password)=>{
const pass=bcrypt.hash(password,12)
return pass
}
module.exports=hashPassword