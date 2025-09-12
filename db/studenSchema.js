const mongoose = require("mongoose")
const chat=new mongoose.Schema({name:String,profilePic:String,id:mongoose.Schema.ObjectId,chatId:mongoose.Schema.ObjectId,socketId:String})

const StudentSchema = new mongoose.Schema({
    password: { type: String, required: true },
    persnalDetails: {
        fullName: { type: String, required: true }
        , email: { type: String, required: true, unique: true },
        profileImage: { type: String, default: "https://cdn.vectorstock.com/i/500p/11/28/profile-icon-male-avatar-user-circles-vector-50791128.avif" },
        phone: { type: String }, // optional, for teacher/student contact
        gender: { type: String, enum: ["Male", "Female", "Other"] },
        dob: { type: Date }, // for age-based tracking
        country: { type: String }, // helpful for time zone handling,
        createdAt: { type: Date, default: Date.now },
    }, ongoingCourses: [{
        classTime: { type: String, required: true },
        classDoneTill: { type: String, required: true },
        courseName: { type: String, required: true },
        courseDescription: { type: String, required: true },
        courseTeacher: { teacherId: { type: String, required: true } },
        courseDuration: { type: String, required: true }
    }]
    , completedCourse: [{
        courseName: { type: String, required: true },
        courseDescription: { type: String, required: true },
        courseTeacher: { teacherId: { type: String, required: true } },
        courseDuration: { type: String, required: true }
    }],role: { type: String, enum: ["student", "teacher","admin"], default: "student" },
    QtuorCourse:[{courseId:{type:mongoose.Schema.Types.ObjectId,ref:"course"},courseName:{type:String,
        required:true},courseDescription:{type:String,required:true},
        courseDuration:{type:String,required:true}}],chats:[chat],
          socketId:String
  ,online:{type:Boolean,default:false}
})
const StudentModel = mongoose.model("Students", StudentSchema)
module.exports = StudentModel