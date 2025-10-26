const mongoose = require("mongoose");


// Sessions subdocument schema
const sessionSchema = new mongoose.Schema({
  date: { type:String, required: true },
  startTime: { type: String, required: true }, // "10:00 AM"
  endTime: { type: String, required: true }, // "11:00 AM"
  duration: { type: Number }, // in minutes
  month:[{type:String}],
  status: {
    type: String,
    enum: ["scheduled", "ongoing", "completed", "cancelled", "rescheduled"],
    default: "scheduled"
  },
  attendance: {
    studentPresent: { type: Boolean },
    teacherPresent: { type: Boolean },
  },

  cancelReason: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Main Class schema
const classSchema = new mongoose.Schema({
  jobId:{type:mongoose.Types.ObjectId},
  proposalId:{type:mongoose.Types.ObjectId},
  sessions: [sessionSchema],
  paidFor:Number,
    planStatus: {
    type: String,
    enum: ["pending", "active", "expired"],
    default: "pending"
  },
  student: {
    id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    profilePic: String,
  },
  
  teacher: {
    id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: String,
    profilePic: String,
  },
  
  status: {
    type: String,
    enum: [ "hiring", "ongoing", "completed", "cancelled"],
    default: "hiring",
  },
  
  // Schedule details
  classDays: {
    type: [String],
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', "Saturday", "Sunday"],
    validate: {
      validator: function(arr) {
        return arr.length > 0;
      },
      message: "At least one class day must be selected"
    }
  },
  
  classTime: {
    start: { type: String, required: true }, // "10:00 AM"
    end: { type: String, required: true }, // "11:00 AM"
    timezone: { type: String, default: "Asia/Kolkata" },
  },
  
  // Subject and pricing
  subject: { 
    type: String, 
    required: true,
    trim: true 
  },   
  perMonthRate: { 
    type: Number, 
    min: 0,
    required: true 
  },
  payment:{
    paid:{type:Boolean,},
    transactionId:{type:mongoose.Types.ObjectId}
  },
  // Metadata
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  startingDate: { type: Date },  
  completedAt: { type: Date },
  cancellationReason: String,
  cancelledAt: { type: Date },
  cancelledBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
}, {
  timestamps: true // Automatically adds createdAt and updatedAt
});

// Indexes for better query performance
classSchema.index({ 'student.id': 1 });
classSchema.index({ 'teacher.id': 1 });
classSchema.index({ status: 1 });
classSchema.index({ createdAt: -1 });


// Pre-save middleware to update timestamps
classSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});
classSchema.pre("save", function (next) {
  if(this.sessions.length>0){
  const currentDate = new Date();
  // Sort sessions by date to pick the last one properly
  this.sessions.sort((a, b) => new Date(a.date) - new Date(b.date));
  const lastSession = this.sessions[this.sessions.length - 1];

  const fullyUsed = this.sessions.length >= this.paidFor;
  const lastSessionEnded = lastSession.date && new Date(lastSession.date) < currentDate;

  if (fullyUsed && lastSessionEnded) {
    this.planStatus = "expired";
  }
}
next();
});

const Class = mongoose.model('Class', classSchema);

module.exports = Class;