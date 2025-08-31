const jobModule = require("../db/jobPost");
const { ApiError } = require("../middleware/Error");

// Create Job
const createJob = async (req, res, next) => {
  try {
    const { name, id, title, description, language, course, budget } = req.body;
    console.log(req.body)
    if (!name || !id || !title || !description || !language || !course || !budget) {
      return res.status(400).json({ message: "Enter all fields", success: false });
    }

    const job = await jobModule.create({
      postedBy: { name, id },
      title,
      description,
      budget,
      course,
      language,
    });

    res.status(201).json({ success: true, message: "Job created successfully", data: job });
  } catch (e) {
    next(new ApiError(e.message, 500));
  }
};

// Delete Job
const deleteJob = async (req, res, next) => {
  try {
    const id = req.params.id;
console.log(id)
    if (!id) return next(new ApiError("Job ID is required", 400));

    const deletedobj = await jobModule.findByIdAndDelete(id);

    if (!deletedobj) return next(new ApiError("Job not found", 404));

    res.status(200).json({ success: true, message: "Job deleted successfully" });
  } catch (e) {
    next(new ApiError(e.message, 500));
  }
};

// Update Job
const updateJob = async (req, res, next) => {
  try {
    const { title, description, language, course, budget, id } = req.body;
    const job = await jobModule.findByIdAndUpdate(
      id,
      {
        title,
        description,
        budget,
        course,
        language,
      },
      { new: true } // return updated job
    );

    if (!job) return next(new ApiError("Job not found", 404));

    res.status(200).json({ success: true, message: "Job updated successfully", data: job });
  } catch (e) {
    next(new ApiError(e.message, 500));
  }
};
const fetchPost=async(req,res)=>{
  try{const allposts=await jobModule.find()
    console.log("rubul")
  if(allposts.length<0){
    return res.status(500).json({success:false,message:"internal Error"})
  }
  res.status(200).json({success:true,message:"successfully fetched Data",data:allposts})
}catch(e){
  throw new ApiError(500,e.message)
}
}
const fetchMyPosts=async(req,res)=>{
  try{
    const allposts = await jobModule.find({
  "postedBy.id": req.body.id,
  "postedBy.name": req.body.name,
});
  if(allposts.length<0){
    return res.status(500).json({success:false,message:"internal Error"})
  }
  res.status(200).json({success:true,message:"successfully fetched Data",data:allposts})
}catch(e){
  throw new ApiError(500,e.message)
}
}

module.exports = { createJob, deleteJob, updateJob,fetchPost,fetchMyPosts };
