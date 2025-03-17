const prisma = require("../config/prisma");
const createError = require("../utils/createError");

// Get stock information for a specific product
exports.getProductStock = async (req, res, next) => {
  try {
    const { productId } = req.params;
    
    if (!productId) {
      return res.status(400).json({ msg: "Product ID is required" });
    }

    const stock = await prisma.stock.findMany({
      where: { 
        product_id: parseInt(productId) 
      },
      include: {
        size: true,
        product: {
          select: {
            productname: true,
            brand: true,
            gender: true
          }
        }
      },
      orderBy: {
        size: {
          us_size: 'asc'
        }
      }
    });

    if (!stock || stock.length === 0) {
      return res.status(404).json({ msg: "No stock found for this product" });
    }

    res.status(200).json({
      msg: "Stock retrieved successfully",
      data: stock
    });
  } catch (error) {
    console.error("Error retrieving stock:", error);
    next(error);
  }
};

// Add stock for a product and size
exports.addStock = async (req, res, next) => {
  try {
    const { product_id, size_id, stock_quantity } = req.body;
    
    if (!product_id || !size_id || stock_quantity === undefined) {
      return res.status(400).json({ msg: "Product ID, size ID, and stock quantity are required" });
    }

    // Validate product exists
    const product = await prisma.product.findUnique({
      where: { id: parseInt(product_id) }
    });
    
    if (!product) {
      return res.status(404).json({ msg: "Product not found" });
    }

    // Validate size exists
    const size = await prisma.size.findUnique({
      where: { id: parseInt(size_id) }
    });
    
    if (!size) {
      return res.status(404).json({ msg: "Size not found" });
    }

    // Check if stock entry already exists
    const existingStock = await prisma.stock.findFirst({
      where: {
        product_id: parseInt(product_id),
        size_id: parseInt(size_id)
      }
    });

    let result;
    
    if (existingStock) {
      // Update existing stock
      result = await prisma.stock.update({
        where: { id: existingStock.id },
        data: {
          stock_quantity: parseInt(stock_quantity),
          updated_at: new Date()
        },
        include: {
          size: true
        }
      });
      
      res.status(200).json({
        msg: "Stock updated successfully",
        data: result
      });
    } else {
      // Create new stock entry
      result = await prisma.stock.create({
        data: {
          product_id: parseInt(product_id),
          size_id: parseInt(size_id),
          stock_quantity: parseInt(stock_quantity),
          updated_at: new Date()
        },
        include: {
          size: true
        }
      });
      
      res.status(201).json({
        msg: "Stock added successfully",
        data: result
      });
    }
  } catch (error) {
    console.error("Error adding/updating stock:", error);
    next(error);
  }
};

// Update stock quantity
exports.updateStock = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { stock_quantity } = req.body;
    
    if (!id) {
      return res.status(400).json({ msg: "Stock ID is required" });
    }
    
    if (stock_quantity === undefined) {
      return res.status(400).json({ msg: "Stock quantity is required" });
    }

    // Check if stock exists
    const existingStock = await prisma.stock.findUnique({
      where: { id: parseInt(id) }
    });
    
    if (!existingStock) {
      return res.status(404).json({ msg: "Stock entry not found" });
    }

    // Update stock
    const updatedStock = await prisma.stock.update({
      where: { id: parseInt(id) },
      data: {
        stock_quantity: parseInt(stock_quantity),
        updated_at: new Date()
      },
      include: {
        size: true,
        product: {
          select: {
            productname: true
          }
        }
      }
    });

    res.status(200).json({
      msg: "Stock updated successfully",
      data: updatedStock
    });
  } catch (error) {
    console.error("Error updating stock:", error);
    next(error);
  }
};

// Delete stock entry
exports.deleteStock = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ msg: "Stock ID is required" });
    }

    // Check if stock exists
    const existingStock = await prisma.stock.findUnique({
      where: { id: parseInt(id) }
    });
    
    if (!existingStock) {
      return res.status(404).json({ msg: "Stock entry not found" });
    }

    // Delete stock
    await prisma.stock.delete({
      where: { id: parseInt(id) }
    });

    res.status(200).json({
      msg: "Stock deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting stock:", error);
    next(error);
  }
};

// Get all available sizes
exports.getAllSizes = async (req, res, next) => {
  try {
    const { gender } = req.query;
    
    let whereClause = {};
    if (gender) {
      whereClause.gender = gender;
    }
    
    const sizes = await prisma.size.findMany({
      where: whereClause,
      orderBy: {
        us_size: 'asc'
      }
    });

    res.status(200).json({
      msg: "Sizes retrieved successfully",
      data: sizes
    });
  } catch (error) {
    console.error("Error retrieving sizes:", error);
    next(error);
  }
};

// Add new size
exports.addSize = async (req, res, next) => {
  try {
    const { us_size, gender } = req.body;
    
    if (!us_size || !gender) {
      return res.status(400).json({ msg: "US size and gender are required" });
    }

    // Check if size already exists
    const existingSize = await prisma.size.findFirst({
      where: {
        us_size: parseInt(us_size),
        gender: gender
      }
    });
    
    if (existingSize) {
      return res.status(400).json({ msg: "Size already exists" });
    }

    // Create new size
    const newSize = await prisma.size.create({
      data: {
        us_size: parseInt(us_size),
        gender: gender
      }
    });

    res.status(201).json({
      msg: "Size added successfully",
      data: newSize
    });
  } catch (error) {
    console.error("Error adding size:", error);
    next(error);
  }
};

// Delete size
exports.deleteSize = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ msg: "Size ID is required" });
    }

    // Check if size exists
    const existingSize = await prisma.size.findUnique({
      where: { id: parseInt(id) }
    });
    
    if (!existingSize) {
      return res.status(404).json({ msg: "Size not found" });
    }

    // Check if size is used in any stock
    const usedInStock = await prisma.stock.findFirst({
      where: { size_id: parseInt(id) }
    });
    
    if (usedInStock) {
      return res.status(400).json({ 
        msg: "Size cannot be deleted as it's being used in product inventory. Remove associated products first." 
      });
    }

    // Delete size
    await prisma.size.delete({
      where: { id: parseInt(id) }
    });

    res.status(200).json({
      msg: "Size deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting size:", error);
    next(error);
  }
};