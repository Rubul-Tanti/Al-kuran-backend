const mongoose=require("mongoose")

const chat=new mongoose.Schema({
  sender:mongoose.Types.ObjectId,
  sequance:String,
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
 


const ChatSchema=new mongoose.Schema({
  teacher:String,
  student:String,
  messages:[chat]
})

module.exports=mongoose.model("Chats",ChatSchema)