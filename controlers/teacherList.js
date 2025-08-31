const { ApiError } = require("../middleware/Error");
const teacherModel = require("../db/teacerScheama");

const teacherList = async (req, res, next) => {
  try {
    // Destructure query params
    const {
      page = 1,
      limit = 10,
      sort = "-createdAt", // default: latest first
      name, // search by name
      subject, // filter by subject
      experience, // filter by experience
    } = req.query;

    // Build filter object
    const filter = {};
    if (name) {
      filter.name = { $regex: name, $options: "i" }; // case-insensitive search
    }
    if (subject) {
      filter.subject = subject;
    }
    if (experience) {
      filter.experience = { $gte: experience }; // e.g. teachers with >= experience
    }

    // Pagination setup
    const skip = (page - 1) * limit;

    // Query DB
    const teachers = await teacherModel
      .find(filter)
      .sort(sort)
      .skip(skip)
      .limit(Number(limit));

    // Count for pagination
    const total = await teacherModel.countDocuments(filter);

    res.status(200).json({
      success: true,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
      count: teachers.length,
      data: teachers,
    });
  } catch (e) {
    next(new ApiError(e.message, 500));
  }
};

module.exports = { teacherList };
