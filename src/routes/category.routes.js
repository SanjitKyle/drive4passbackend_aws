const express = require('express');
const router = express.Router();
const CategoryController = require('../controllers/category.controller');

// Create
router.post('/categories/', CategoryController.createCategory);
router.get('/categories/', CategoryController.getCategories);
router.get('/categories/:id', CategoryController.getCategoryById);
router.post('/categories/:id', CategoryController.updateCategory);
router.get('/categories/delete/:id', CategoryController.deleteCategory);

module.exports = router;
