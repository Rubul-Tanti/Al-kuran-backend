const Chats = require("../db/Chats");
const Class = require("../db/class");
const mongoose=require("mongoose")
const JobModule = require("../db/jobPost");
const { ApiError, asyncError } = require("../middleware/Error");
const createClass=async(req,res)=>{
    try{
        const {
  studentId,
  studentName,
  studentProfilePic,
  teacherId,
  teacherName,
  teacherProfilePic,
  classDays,
  classTime,
  subject,
  perHourRate,
  startingDate
} = req.body;

if (
    !startingDate||
  !studentId ||
  !studentName ||
  !studentProfilePic ||
  !teacherId ||
  !teacherName ||
  !teacherProfilePic ||
  !classDays?.length>0 ||
  !classTime ||
  !subject ||
  !perHourRate
) {
  return res.status(400).json({ message: "Enter all fields" });
}
console.log(  studentId,
  studentName,
  studentProfilePic,
  teacherId,
  teacherName,
  teacherProfilePic,
  classDays,
  classTime,
  subject,
  perHourRate,
  startingDate  )
const newClass=await Class.create({
    student:{
        id:studentId
        ,name:studentName
        ,profilePic:studentProfilePic
    },
    teacher:{
        id:teacherId,
        name:teacherName,
        profilePic:teacherProfilePic
    },
    classDays,
    classTime,
    subject,
    perHourRate,
    startingDate
})
if(!newClass){return res.status(401).json({success:false,message:"internal server Error Please Try Later"})}
res.status(200).json({message:"successfully created class",success:true,data:newClass})
}
catch(e){
        throw new ApiError(e.message,500)
    }
}

const updateClass=async(req,res)=>{
       try{
        const {
            classId,
     student:{
        id:studentId
        ,name:studentName
        ,profilePic:studentProfilePic
    },
    teacher:{
        id:teacherId,
        name:teacherName,
        profilePic:teacherProfilePic
    },
  classDays,
  classTime,
  subject,
  perHourRate,
  startingDate
} = req.body;

if (!classId||
    !startingDate||
  !studentId ||
  !studentName ||
  !studentProfilePic ||
  !teacherId ||
  !teacherName ||
  !teacherProfilePic ||
  !classDays?.length>0 ||
  !classTime ||
  !subject ||
  !perHourRate
) {
  return res.status(400).json({ message: "Enter all fields" });
}

const updatedClass=await Class.findByIdAndUpdate(classId,{
    student:{
        id:studentId
        ,name:studentName
        ,profilePic:studentProfilePic
    },
    teacher:{
        id:teacherId,
        name:teacherName,
        profilePic:teacherProfilePic
    },
    classDays,
    classTime,
    subject,
    perHourRate,
    startingDate
})
if(!updatedClass){return res.status(401).json({success:false,message:"internal server Error Please Try Later"})}
res.status(200).json({message:"successfully created class",success:true,data:updatedClass})
}
    catch(e){
        throw new ApiError(e.message,500)
    }
}

const addSession=async(req,res)=>{
    try{
        const {date,startTime,endTime,duration,status,attendance,classId}=req.body
        if (!date || !startTime || !endTime || !duration || !status || !attendance || !classId) {
          return res.status(400).json({ message: "Please provide all required fields" });
        }
        const updatedClass=await Class.findByIdAndUpdate(classId,{sessions:{$push:{date,startTime,endTime,duration,status,attendance,startTime,endTime}}})
        if(!updateClass){return res.status(200).json({message:"internal server Error",success:false})}
        res.status(200).json({message:"successfully update class added session",success:true,data:updateClass})
    }catch(e){
throw new ApiError(e.message,500)
 }
}
 
const updatedSession=async()=>{
     const {date,startTime,endTime,duration,status,attendance,classId,payment}=req.body
}
const getproposalDetails=async(req,res)=>{
    try{
    const {jobId,proposalId}=req.body
    console.log(jobId,proposalId)
    if(!jobId||!proposalId){return res.status(400).json({message:"enter all fields",success:false})}
    const jobDetails=await JobModule.findById(jobId)
    if(!jobDetails){return res.status(401).json({message:"internal server error",success:false})}
    const proposal=jobDetails.applicants.find(p=> p._id==proposalId )
    if(!proposal){return res.status(402).json({message:"internal server error",success:false})}
        const data={teacher:proposal,student:jobDetails.postedBy,perHourRate:jobDetails.budget,subject:jobDetails.course }
    res.status(200).json({message:"successfully fetch proposal details",data,success:true})
    }catch(e){
        throw ApiError(e.message,500)
    }
}
const fetchClasses=async(req,res)=>{
    const {id,role}=req.body
    if(!id||!role){return res.status(400).json({message:"enter all fields"})}
    let query;
        if (role === "teacher") {
      query = { "teacher.id": id };
    } else if (role === "student") {
      query = { "students.id": id };
    } else {
      return res.status(400).json({ message: "Invalid role" });
    }
    const classes=await Class.find(query)
    if(!classes){return res.status(401).json({message:"no class found",})}
    res.status(200).json({message:"fetched classes successfully",data:classes,success:true})
}

const aproveClass=async(req,res)=>{
try{
const {userId,classId}=req.body
if(!userId||!classId){
  return res.status(400).json({messsage:"enter all fields"})
}

const fclass=await Class.findById(classId)
console.log(fclass.teacher.id,userId)
if((fclass.teacher.id).toString()!==userId){
  return res.status(401).json({message:"not autherized"})
}
fclass.status="ongoing"
fclass.save()
res.status(200).json({message:"aproved succesfully",success:true})

}catch(e){
  throw new ApiError(e.message,500)
}
}
const requestChangesClass=async(req,res)=>{
  try{
  const {teacherId,studentId}=req.body
  if(!teacherId||!studentId){return res.status(400).json({
    message:"enter all fields"
  })}
  const chatRoom=await Chats.findOne({teacher:teacherId,student:studentId})
  if(!chatRoom){return res.status(401).json({message:"internal server error"})}
   chatRoom.messages.push({ sender:teacherId, sequance:chatRoom.messages.length + 1, text: "Hi,i would like some changes to the class !", type: "text" })
      chatRoom.save()
  res.status(200).json({message:"fetch chatRoom successfully",success:true,data:chatRoom._id})}catch(e){
    throw new ApiError(e.message,500)
  }
}


module.exports ={createClass,updateClass,addSession,getproposalDetails,fetchClasses,aproveClass,requestChangesClass}