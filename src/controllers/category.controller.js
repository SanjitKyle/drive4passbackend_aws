const CategoryModel = require('../models/category.model');

// Create Category
exports.createCategory = async (req, res, next) => {
  try {
    const { category_name } = req.body;
    const newCategory = await CategoryModel.create({ category_name });

    return res.status(201).json({
      status: true,
      message: 'Category created successfully',
      data: newCategory
    });
  } catch (err) {
    next(err);
  }
};

// Get All Categories
exports.getCategories = async (req, res, next) => {
  try {
    const categories = await CategoryModel.find().sort({ category_name: 1 });
    return res.status(200).json({
      status: true,
      message: 'Categories fetched successfully',
      data: categories
    });
  } catch (err) {
    next(err);
  }
};

// Get Category by Id
exports.getCategoryById = async (req, res, next) => {
  try {
    const category = await CategoryModel.findById(req.params.id);
    if (!category) {
      return res.status(404).json({
        status: false,
        message: 'Category not found'
      });
    }
    return res.status(200).json({
      status: true,
      message: 'Category fetched successfully',
      data: category
    });
  } catch (err) {
    next(err);
  }
};

// Update Category
exports.updateCategory = async (req, res, next) => {
  try {
    const { category_name } = req.body;
    const updated = await CategoryModel.findByIdAndUpdate(
      req.params.id,
      { category_name },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({
        status: false,
        message: 'Category not found'
      });
    }

    return res.status(200).json({
      status: true,
      message: 'Category updated successfully',
      data: updated
    });
  } catch (err) {
    next(err);
  }
};

// Delete Category
exports.deleteCategory = async (req, res, next) => {
  try {
    const deleted = await CategoryModel.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({
        status: false,
        message: 'Category not found'
      });
    }
    return res.status(200).json({
      status: true,
      message: 'Category deleted successfully'
    });
  } catch (err) {
    next(err);
  }
};
