const express =require("express")
const verifyStudentAndRegisterStudent=require("../controlers/varifyotpAndRegisterStudent")
const { createJob, deleteJob, updateJob, fetchPost, fetchMyPosts, fetchJob, SendProposal, nothire }=require("../controlers/job")
const router=express.Router()
const {asyncError}=require("../middleware/Error")
const emailVerification = require("../controlers/emailVerification")
const Login = require("../controlers/Login")
const { fetchUser, getUserDetail } = require("../controlers/fetchUser")
const upload = require("../middleware/multerUpload")
const verifyOtpAndRegisterTeacher = require("../controlers/verifyotpAndRegisterTeacher.")
const { teacherList, teacherDetails } = require("../controlers/teacherList")
const { createChat, fetchChat } = require("../controlers/Chats")
const { generateToken, listRooms, removeParticipant, endRoom } = require("../controlers/livekit")
const {updateClass,createClass, getproposalDetails, fetchClasses, aproveClass, requestChangesClass, getClassDetails} = require("../controlers/Class")
router.post("/email-verification",asyncError(emailVerification))
router.post("/verifyStudentAndRegisterStudent",asyncError(verifyStudentAndRegisterStudent))
router.post("/login",asyncError(Login))
router.post("/fetchUser",asyncError(fetchUser))
router.get("/teacherlist",asyncError(teacherList))
router.post("/verifyTeacherAndRegisterTeacher",upload.any(),asyncError(verifyOtpAndRegisterTeacher))
router.post("/createjob",asyncError(createJob))
router.post("/updatejob",asyncError(updateJob))
router.post("/teacherDetails/:id",asyncError(teacherDetails))
router.post("/deletejob/:id",asyncError(deleteJob))
router.get("/fetchjobs/:skip/:limit",asyncError(fetchPost))
router.post("/fetchJobDetails/:id",asyncError(fetchJob))
router.post("/fetchmyposts",asyncError(fetchMyPosts))
router.post("/job/sendproposal",asyncError(SendProposal))
router.post("/job/proposal-delete",asyncError(nothire))
router.post("/job/initialize-chat",asyncError(createChat))
router.get("/chats/:id",asyncError(fetchChat))
router.post("/logout", (req, res) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,        // MUST be true on a live site using HTTPS
    sameSite: "None",    // <-- CHANGE THIS to allow cross-site clearing
    path: "/",
  });
  return res.status(200).json({ message: "Logged out" });
});

router.post("/livekit/token",asyncError(generateToken));
router.get("/livekit/rooms",asyncError( listRooms));
router.post("/livekit/remove-participant",asyncError(removeParticipant) );
router.post("/livekit/end-room", asyncError(endRoom));
router.post("/get-user",asyncError(getUserDetail))
router.post("/hire/create-class",asyncError(createClass))
router.post("/hire/update-class",asyncError(updateClass))
router.post("/get-proposal-detail",asyncError(getproposalDetails))
router.post("/fetch-classes",asyncError(fetchClasses))
router.post("/aprove-class",asyncError(aproveClass))
router.post('/request-changes-class',asyncError(requestChangesClass))
router.post('/get-classDetails',asyncError(getClassDetails))
module.exports=router