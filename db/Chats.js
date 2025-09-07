const mongoose=require("mongoose")

const chat=new mongoose.Schema({
  sender:{user:mongoose.Types.ObjectId}
  ,sequance:String,
  text:String,
type: {
      type: String,
      enum: ["url", "text"],
      default: "text",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
)
 
const users=new mongoose.Schema({
    user:mongoose.Types.ObjectId
})

const ChatSchema=new mongoose.Schema({
  participants:[],
  messages:[chat]
})

module.exports=mongoose.model("Chats",ChatSchema)