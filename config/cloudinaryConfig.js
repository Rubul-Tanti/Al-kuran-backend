const { v2  } =require('cloudinary');
const  { ApiError }=require('../middleware/Error');
const {CLOUDE_NAME,CLOUDINARY_API_KEY,CLOUDINARY_API_SECRET}=require("./envConfig")
const cloudinaryConfig=async()=>{
try{
  v2.config({ 
        cloud_name:CLOUDE_NAME , 
        api_key:CLOUDINARY_API_KEY, 
        api_secret:CLOUDINARY_API_SECRET // Click 'View API Keys' above to copy your API secret
    });
}catch(e){
    throw new ApiError(e.message,500)
}
}
module.exports=cloudinaryConfig