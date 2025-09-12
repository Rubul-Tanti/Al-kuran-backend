const teacherModel=require("././db/teacerScheama")
const studentModel=require("././db/studenSchema")
const chatModel=require("././db/Chats")
const Socket=async(Io)=>{
Io.on("connection",async(socket)=>{
 const {userId,role} = socket.handshake.auth;
if(role==="student"){
    const student=await studentModel.findByIdAndUpdate(userId,{socketId:socket.id,online:true})
}
else if(role==="teacher"){
    const teacher=await teacherModel.findByIdAndUpdate(userId,{socketId:socket.id,online:true})
}
 
  socket.on("disconnect", async() => {
if(role==="student"){
    const student=await studentModel.findByIdAndUpdate(userId,{socketId:null,online:false})
}
else if(role==="teacher"){
    const teacher=await teacherModel.findByIdAndUpdate(userId,{socketId:null,online:false})
}

  });
  socket.on("sendMessage", async ({senderUserId,senderSocketId, receiverUserId,receiverSocketId,chatId, message,type,userRole }) => {
    try{
      console.log("socketid",message )
  const newChat=await chatModel.findByIdAndUpdate(chatId,{$push:{messages:{sender:senderUserId,type,text:message}}})
       if (!Io.sockets.sockets.has(receiverSocketId)){
      const user=userRole==="student"?await studentModel.findById(receiverUserId):await teacherModel.findById(receiverUserId)
 
      if(user.online){
         Io.to(user.socketId).emit("receiveMessage", {senderSocketId,newChat:{sender:senderUserId,type,text:message,createdAt:new Date().toISOString()}
          });
      }
    }else{
        Io.to(receiverSocketId).emit("receiveMessage", {senderSocketId,newChat:{sender:senderUserId,type,text:message,createdAt:new Date().toISOString()}});
    }
    }catch(e){
      console.log(e)
    }
});

})
}
module.exports=Socket