const mongoose = require("mongoose")

const StudentSchema = new mongoose.Schema({
    password: { type: String, required: true },
    persnalDetails: {
        fullName: { type: String, required: true }
        , email: { type: String, required: true, unique: true },
        profileImage: { type: String, default: "https://res.cloudinary.com/dq1xj3v2h/image/upload/v1735681234/Al-kuran-Backend/defaultProfileImage.png" },
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
        courseDuration:{type:String,required:true}}],
})
const StudentModel = mongoose.model("Students", StudentSchema)
module.exports = StudentModel