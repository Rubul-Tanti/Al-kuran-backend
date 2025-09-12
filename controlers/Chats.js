const Chatmodule = require("../db/Chats")
const teacherModel = require("../db/teacerScheama")
const studentModel = require("../db/studenSchema")
const { ApiError } = require("../middleware/Error")
const Chats = require("../db/Chats")
const createChat = async (req, res) => {
  try {
    const { teacher, student } = req.body
    console.log(teacher,student)
    if (!teacher || !student) { return res.status(500).json({ message: "internal server error" }) }
    const alreadyExists = await Chatmodule.findOne({ teacher: teacher.teacherId, student: student.studentId })
    if (alreadyExists){
      alreadyExists.messages.push({ sender: student.studentId, sequance: alreadyExists.messages.length + 1, text: "Hi, let’s connect for an interview!", type: "text" })
      alreadyExists.save()
      // await teacherModel.findByIdAndUpdate(teacher.teacherId,{chats:[]})
      // await studentModel.findByIdAndUpdate(student.studentId,{chats:[]})
      console.log("pass")
      return res.status(200).json({ message: "interview msg sent",data:alreadyExists ,success:true })
    }
    const newChat = await Chatmodule.create({ teacher: teacher.teacherId, student: student.studentId,
      messages:[
        { sender: student.studentId, sequance:1, text: "Hi, let’s connect for an interview!", type: "text" }
      ] 
    })
    if (!newChat) { return res.status(501).json({ message: "internal server error" }) }
    
    const newteacherobj = await teacherModel.findByIdAndUpdate(teacher.teacherId, {
      $push: {
        chats: {
          name: student.studentName,
          profilePic: student.studentProfilePic,
          id: student.studentId,
          chatId: newChat._id,
        },
      },
    })
    const newstudentobj = await studentModel.findByIdAndUpdate(student.studentId, {
      $push: {
        chats: {
          name: teacher.teacherName,
          profilePic: teacher.teacherProfilePic,
          id: teacher.teacherId,
          chatId: newChat._id,
        },
      },
    })
    res.status(200).json({ success: true, data: newChat })
  } catch (e) {
    throw new ApiError(e.message, 500)
  }
}
const fetchChat=async(req,res)=>{
  try{
const {id}=req.params
console.log(id)
const chat=await Chatmodule.findById(id)
if(!chat){return res.status(501).json({message:"something went wrong"})}
res.status(200).json({success:true,message:"fetch successfully chats",data:chat})
  }catch(e){
    throw new ApiError(e.message,500)
  }
}

module.exports = { createChat,fetchChat }