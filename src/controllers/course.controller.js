const CourseModel = require('../models/course.model');

exports.createCourse = async (req, res, next) => {
  try {
    const course = await CourseModel.create(req.body);
    res.status(201).json({status: true, message: 'Course created successfully.', course});
  } catch (err) {
    next(err);
  }
};

exports.getCourses = async (req, res, next) => {
  try {
    const courses = await CourseModel.find();
    res.status(200).json({status: true, message: 'Course fetched successfully.', courses});
  } catch (err) {
    next(err);
  }
};


// Get Course by ID
exports.getCourseById = async (req, res, next) => {
  try {
    const course = await CourseModel.findById(req.params.id)
      .populate('branch_ids', 'name');
    if (!course) return res.json({ status: false, message: 'Course not found' });
    return res.json({ status: true, message: 'Course data fetched successfully', course });
  } catch (err) {
    next(err);
  }
};

// Update Course
exports.updateCourse = async (req, res, next) => {
  try {
    const course = await CourseModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!course) return res.json({ status: false, message: 'Course not found' });
    res.json({ status: true, message: 'Course updated successfully', course });
  } catch (err) {
    next(err);
  }
};

// Delete Course
exports.deleteCourse = async (req, res, next) => {
  try {
    const course = await CourseModel.findByIdAndDelete(req.params.id);
    if (!course) return res.json({ status: false, message: 'Course not found' });
    res.json({ status: true, message: 'Course deleted successfully' });
  } catch (err) {
    next(err);
  }
};