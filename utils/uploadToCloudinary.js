const { ApiError } = require("../middleware/Error")
const { v2: cloudinary } = require("cloudinary");
const uploadToCloudinary=async(files)=>{
    try{ 
             const uploadResult = await cloudinary.uploader.upload(files.path,{
               public_id:files.fieldname
           })
           return uploadResult.url
    }
    catch(e){
        throw new ApiError(e.message,500)
    }
}
module.exports=uploadToCloudinary