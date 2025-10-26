const mongoose=require("mongoose")
const TransactionSchema=new mongoose.Schema({
  paymentType:{
type:String,
enum:['salary','membership','',]
  },
 amount: {  
    type: Number,
    required: true,
    min: [0, "Amount must be positive"]
  },
  // Transaction participants
  payer: {
    name: { type: String, required: true },
    id: { 
      type: mongoose.Schema.Types.ObjectId, 
      required: true 
    },
    profilePic: String
  },
  receiver: {
    name: { type: String, required: true },
    id: { 
      type: mongoose.Schema.Types.ObjectId,
      required: true 
    },
    profilePic: String
  },
 date: {
    type: Date,
    default: Date.now,
    required: true
  },jobId:{
    type:mongoose.Types.ObjectId,
    required:true   
  },
  proposalId:{
    type:mongoose.Types.ObjectId,
    required:true  
  }
},
{
  timestamps: true
});
const TransactionModel=mongoose.model("Transaction",TransactionSchema)
module.exports=TransactionModel