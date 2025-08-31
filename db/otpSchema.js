const mongoose=require("mongoose")

const otpSchema= new mongoose.Schema({
    email:{required:true,
        type:String,
        unique:true
    },
    otp:{require:true,
        type:String
    },  createdAt: { type: Date, default: Date.now, expires:120 }

})
const otp=mongoose.model("otp",otpSchema)
module.exports=otp