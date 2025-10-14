const mongoose=require("mongoose")
const TransactionSchema=new mongoose.Schema({
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
   classId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: true
  },
  
  sessionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Session'
  },
 date: {
    type: Date,
    default: Date.now,
    required: true
  }

}, {
  timestamps: true
});
const TransactionModel=mongoose.model("Transaction",TransactionSchema)
module.exports=TransactionModel