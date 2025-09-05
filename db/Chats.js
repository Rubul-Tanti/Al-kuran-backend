const mongoose=require("mongoose")
const chat=new mongoose.Schema({user1:{sequanc:String,message:String},user2:{sequanc:String,message:String}})
const chatobj=new mongoose.Schema(
    {user:{name:String,id:{type:mongoose.Types.ObjectId},profilePic:String},chats:[chat]}
)
const ChatsSchema=new mongoose.Schema({
    user:{type:String,required:true},
    chatsList:[chatobj]
})