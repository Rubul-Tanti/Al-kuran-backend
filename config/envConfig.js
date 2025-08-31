const env=require("dotenv")
env.config()

const Env={
    port:process.env.PORT,
    mongourl:process.env.mongourl,
    EMAIL:process.env.EMAIL
    ,EMAILPASS:process.env.EMAILPASS
    ,EMAILPORT: process.env.EMAILPORT,
    EMAILCLR:process.env.EMAILCLR,
    JWTSECRET:process.env.JWTSECRET,
    REFRESH_SECRET:process.env.REFRESH_SECRET,  
    CLOUDE_NAME:process.env.CLOUDE_NAME,
    CLOUDINARY_API_KEY:process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET:process.env.CLOUDINARY_API_SECRET,
    CLOUDINARY_URL:process.env.CLOUDINARY_URL

}
module.exports=Env