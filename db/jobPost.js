const mongoose = require("mongoose");
const applicant={
 id:{ type: mongoose.Types.ObjectId, ref: "User" },name:{type:String},proposal:{type:String},profilePic:{type:String,}}

const jobSchema = new mongoose.Schema({
  postedBy:{name:{type:String,required:true}, id:{
    type: mongoose.Types.ObjectId,
    ref: "student", // assuming you have a User model
    required: true,
  },profilePic:{type:String
  },socketId:{type:String,requied:true}},
  postedAt: {
    type: Date,
    default: Date.now,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  budget: {
    type: String,
    required: true,
  },
  course: {
    type: String,
    enum: ["Noorani Qaida", "Arabic Course", "Tajweed Course", "Hifz Course"],
    required: true,
  },
  language: {
    type: String,
    required: true,
  },
  sentInvites: [
    { type: mongoose.Types.ObjectId, ref: "User" } // array of invited users
  ],
  interviewing: [
    { type: mongoose.Types.ObjectId, ref: "User" } // users in interview stage
  ],
  applicants: [
   applicant
  ],
});
const JobModule = mongoose.model("Job", jobSchema);

module.exports = JobModule;
