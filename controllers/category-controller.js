const prisma = require("../config/prisma");

// Get all categories
exports.getAllCategories = async (req, res, next) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        categoryname: 'asc'
      }
    });

    res.status(200).json({
      msg: "Categories retrieved successfully",
      data: categories
    });
  } catch (error) {
    console.error("Error retrieving categories:", error);
    next(error);
  }
};

// Get a single category by ID
exports.getCategoryById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ msg: "Category ID is required" });
    }

    const category = await prisma.category.findUnique({
      where: { id: parseInt(id) },
      include: {
        products: true
      }
    });
    
    if (!category) {
      return res.status(404).json({ msg: "Category not found" });
    }

    res.status(200).json({
      msg: "Category retrieved successfully",
      data: category
    });
  } catch (error) {
    console.error("Error retrieving category:", error);
    next(error);
  }
};