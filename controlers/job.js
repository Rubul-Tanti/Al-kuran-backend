const jobModule = require("../db/jobPost");
const { ApiError } = require("../middleware/Error");

// Create Job
const createJob = async (req, res, next) => {
  try {
    const { name, id, title, description, language, course, budget ,profilePic,socketId} = req.body;
    console.log(req.body)
    if (!name || !id || !title || !description || !language || !course || !budget||!profilePic||!socketId) {
      return res.status(400).json({ message: "Enter all fields", success: false });
    }

    const job = await jobModule.create({
      postedBy: { name, id,profilePic,socketId },
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
  const {limit}=req.params
  const skip=req.params.skip||0
  console.log(skip,limit)

  try{const allposts=await jobModule.find().skip(skip||0).limit(limit||20)

  if(allposts.length<0){
    return res.status(500).json({success:false,message:"internal Error"})
  }
  const total = await jobModule.countDocuments();
    const hasNext = skip + limit < total;
    const hasPrev=skip>0
  res.status(200).json({success:true,message:"successfully fetched Data",data:{allposts,hasNext,hasPrev}})
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
  res.status(200).json({success:true,message:"successfully fetched Data",data:allposts})
}catch(e){
  throw new ApiError(e.message,500)
}
}
const fetchJob = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ success: false, message: "Job ID is required" });
    }

    const job = await jobModule.findById(id);

    if (!job) {
      return res.status(404).json({ success: false, message: "No job found" });
    }

    return res.status(200).json({ success: true, data: job });

  } catch (error) {
    console.error("Error fetching job:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

const SendProposal=async(req,res)=>{
try{
  console.log("pass")
  const {proposal,postId,userId,username,userImage}=req.body
  if(!proposal||!postId||!userId||!username||!userImage){
    return res.status(500).json({message:'Enter All Fields'})
  }
  const post = await jobModule.findByIdAndUpdate(
      postId,
      {
        $push: {
          applicants: {
            name: username,
            id: userId,
            profilePic: userImage,
            proposal,
          },
        },
      },
      { new: true } // return updated doc
    );
  if(!post){throw new ApiError("internal server Error ",501) } 
  res.status(200).json({success:true,message:"proposal sent successfully"})
}catch(e){ApiError(e.message,500)}
}
const nothire=async(req,res)=>{
    try {
    const { jobId, proposalId } = req.body;

    if (!jobId || !proposalId) {
      return res.status(400).json({ success: false, message: "Job ID and Proposal ID are required" });
    }

    // Find job and pull applicant with matching proposalId
    const updatedJob = await jobModule.findByIdAndUpdate(
      jobId,
      { $pull: { applicants: { _id: proposalId } } },
      { new: true }
    );

    if (!updatedJob) {
      return res.status(404).json({ success: false, message: "Job post not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Proposal deleted successfully",
      job: updatedJob,
    });
  } catch (error) {
    throw new ApiError(error.message,500)
  }
}

module.exports = { createJob, deleteJob, updateJob,fetchPost,fetchMyPosts ,fetchJob,SendProposal,nothire};
