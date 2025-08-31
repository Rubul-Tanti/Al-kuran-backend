const mongoose=require("mongoose")
const Env=require("../config/envConfig")
const { ApiError } = require("../middleware/Error")
const connectToDb=async()=>{
    try{
        await mongoose.connect(Env.mongourl)
        console.log("connect to db")
    }catch(e){
        throw new ApiError('internal Server Error ',500)
    }
}
module.exports=connectToDb