const mongoose = require("mongoose")

const course = {
  classTime: { type: String, required: true },
  hourlyRate: { type: Number },
  courseName: { type: String, required: true, enum: ["Noorani Qaida", "Arabic Course", "Tajweed Course", "Hifz Course"] },
  duration: { type: String, required: true },
}
const liveClass = {
  studentDetail: {
    studentName: { type: String },
    studenProfilePic: { type: String, required: true },
    studentId: { type: mongoose.Types.ObjectId },
    country: { type: String, required: true }
  },
  status: { type: String, enum: ["ongoing", "completed"] },
  courseDetail: course,
  hourlyRate: { type: String, required: true }
}

const chat=new mongoose.Schema({name:String,profilePic:String,id:mongoose.Schema.ObjectId,chatId:mongoose.Schema.ObjectId})

const teacherSchema = new mongoose.Schema({
  password: { type: String, required: true, min: [8, "password cannot be less than 8 characters"], max: [12, "password cannot be more than 12 characters"] },
  rating: { type: Number, default: 0 },
  verified: { type: Boolean, default: false },
  role: { type: String, default: "teacher" },
  persnalDetails: {
     name: { type: String, required: true }
     ,gender: { type: String, required: true },
     email: { type: String, required: true }
     ,dob: { type: Date, required: true },
     country: { type: String, required: true },
     profilePic: { type: String },
     phone: { type: String, required: true },
     languageSpoken:[ { type: String, required: true }]
  },
  reviews: [{
    studentDetail: {
      studentName: { type: String },
      studenProfilePic: { type: String, required: true },
      studentId: { type: mongoose.Types.ObjectId },
      country: { type: String, required: true }
    },
      rating: { type: String, required: true }
    , review: { type: String, required: true }
  }],
  profesnalDetails:{
    profesnalEmail:{type:String,},
    hourlyRate:{type:String,required:true},
    course: [liveClass],
    cirtificates: [{ type: String }],
    educationDetails: { type: String, required: true },
    bio: { type: String,required: true}, 
    specializations:[{type:String,required:true}],
  }
  ,chats:[chat]
  
})
const teacherModel = mongoose.model("teachers", teacherSchema)
module.exports = teacherModel