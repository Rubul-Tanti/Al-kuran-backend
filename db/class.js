const mongoose = require("mongoose");

// Sessions subdocument schema
const sessionSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  startTime: { type: String, required: true }, // "10:00 AM"
  endTime: { type: String, required: true }, // "11:00 AM"
  duration: { type: Number }, // in minutes
  status: {
    type: String,
    enum: ["scheduled", "ongoing", "completed", "cancelled", "rescheduled"],
    default: "scheduled"
  },
  attendance: {
    studentPresent: { type: Boolean },
    teacherPresent: { type: Boolean },
  },
  payment: {
    transactionId: { type: mongoose.Schema.Types.ObjectId },
    amount: { type: Number },
    status: { 
      type: String, 
      enum: ["pending", "paid", "refunded"],
      default: "pending"
    },
    paidAt: { type: Date }
  },
  cancelReason: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Main Class schema
const classSchema = new mongoose.Schema({
  sessions: [sessionSchema],
  
  student: {
    id: { type: mongoose.Schema.Types.ObjectId, required: true },
    name: { type: String, required: true },
    profilePic: String,

  },
  
  teacher: {
    id: { type: mongoose.Schema.Types.ObjectId,  },
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
    enum: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"],
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
  

  subject: { 
    type: String, 
    required: true,
    trim: true 
  },

  
  perHourRate: { 
    type: Number, 
    min: 0,
    required: true 
  },
  completedHours: { 
    type: Number, 
    default: 0,
    min: 0 
  },

  // Metadata
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  startingDate: { type: Date },

  completedAt: { type: Date },

  
  cancellationReason: String,
  cancelledAt: { type: Date },
  canvelledBy:{type:String}
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

const Class = mongoose.model('Class', classSchema);

module.exports = Class;