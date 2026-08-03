const categoryService = require("./category.service");

/**
 * @desc Get all active categories
 * @route GET /api/categories
 * @access Public
 */
const getAllCategories = async (req, res) => {
  try {
    const includeInactive = req.query.all === "true" && req.user?.role === "ADMIN";
    const categories = await categoryService.getAllCategories(includeInactive);
    return res.status(200).json({
      success: true,
      count: categories.length,
      data: categories
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch categories."
    });
  }
};

/**
 * @desc Get category by ID or slug
 * @route GET /api/categories/:id
 * @access Public
 */
const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await categoryService.getCategoryById(id);
    return res.status(200).json({
      success: true,
      data: category
    });
  } catch (error) {
    console.error("Error fetching category:", error);
    return res.status(404).json({
      success: false,
      message: error.message || "Category not found."
    });
  }
};

/**
 * @desc Create new category
 * @route POST /api/categories
 * @access Private (Admin)
 */
const createCategory = async (req, res) => {
  try {
    const category = await categoryService.createCategory(req.body);
    return res.status(201).json({
      success: true,
      message: "Category created successfully.",
      data: category
    });
  } catch (error) {
    console.error("Error creating category:", error);
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to create category."
    });
  }
};

/**
 * @desc Update category
 * @route PUT /api/categories/:id
 * @access Private (Admin)
 */
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await categoryService.updateCategory(id, req.body);
    return res.status(200).json({
      success: true,
      message: "Category updated successfully.",
      data: updated
    });
  } catch (error) {
    console.error("Error updating category:", error);
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to update category."
    });
  }
};

/**
 * @desc Delete category
 * @route DELETE /api/categories/:id
 * @access Private (Admin)
 */
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    await categoryService.deleteCategory(id);
    return res.status(200).json({
      success: true,
      message: "Category deleted successfully."
    });
  } catch (error) {
    console.error("Error deleting category:", error);
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to delete category."
    });
  }
};

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
};
