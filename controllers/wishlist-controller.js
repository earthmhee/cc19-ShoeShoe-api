const prisma = require("../config/prisma");
const createError = require("../utils/createError");

// Get user's wishlist
exports.getWishlist = async (req, res, next) => {
  try {
    const { id: userId } = req.user;

    // Check if the user has a wishlist
    let wishlist = await prisma.wishlist.findUnique({
      where: { user_id: parseInt(userId) },
      include: {
        wishlistItems: {
          include: {
            product: {
              include: {
                category: true
              }
            }
          }
        }
      }
    });

    // If no wishlist exists, create an empty one
    if (!wishlist) {
      wishlist = {
        id: null,
        user_id: parseInt(userId),
        created_at: new Date(),
        wishlistItems: []
      };
    }

    res.status(200).json({
      msg: "Wishlist retrieved successfully",
      data: wishlist
    });
  } catch (error) {
    console.error("Error retrieving wishlist:", error);
    next(error);
  }
};

// Add product to wishlist
exports.addToWishlist = async (req, res, next) => {
  try {
    const { id: userId } = req.user;
    const { product_id } = req.body;

    if (!product_id) {
      return next(createError(400, "Product ID is required"));
    }

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: parseInt(product_id) }
    });

    if (!product) {
      return next(createError(404, "Product not found"));
    }

    // Find or create a wishlist for the user
    let wishlist = await prisma.wishlist.findUnique({
      where: { user_id: parseInt(userId) }
    });

    if (!wishlist) {
      wishlist = await prisma.wishlist.create({
        data: {
          user_id: parseInt(userId)
        }
      });
    }

    // Check if product is already in wishlist
    const existingItem = await prisma.wishlist_Item.findFirst({
      where: {
        wishlist_id: wishlist.id,
        product_id: parseInt(product_id)
      }
    });

    if (existingItem) {
      return res.status(200).json({
        msg: "Product already exists in wishlist",
        data: existingItem
      });
    }

    // Add product to wishlist
    const wishlistItem = await prisma.wishlist_Item.create({
      data: {
        wishlist_id: wishlist.id,
        product_id: parseInt(product_id)
      },
      include: {
        product: true
      }
    });

    res.status(201).json({
      msg: "Product added to wishlist successfully",
      data: wishlistItem
    });
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    next(error);
  }
};

// Remove product from wishlist
exports.removeFromWishlist = async (req, res, next) => {
  try {
    const { id: userId } = req.user;
    const { id: productId } = req.params;

    // Check if the user has a wishlist
    const wishlist = await prisma.wishlist.findUnique({
      where: { user_id: parseInt(userId) }
    });

    if (!wishlist) {
      return next(createError(404, "Wishlist not found"));
    }

    // Find the wishlist item
    const wishlistItem = await prisma.wishlist_Item.findFirst({
      where: {
        wishlist_id: wishlist.id,
        product_id: parseInt(productId)
      }
    });

    if (!wishlistItem) {
      return next(createError(404, "Product not found in wishlist"));
    }

    // Delete the wishlist item
    await prisma.wishlist_Item.delete({
      where: { id: wishlistItem.id }
    });

    res.status(200).json({
      msg: "Product removed from wishlist successfully"
    });
  } catch (error) {
    console.error("Error removing from wishlist:", error);
    next(error);
  }
};

// Clear all items from wishlist
exports.clearWishlist = async (req, res, next) => {
  try {
    const { id: userId } = req.user;

    // Check if the user has a wishlist
    const wishlist = await prisma.wishlist.findUnique({
      where: { user_id: parseInt(userId) }
    });

    if (!wishlist) {
      return next(createError(404, "Wishlist not found"));
    }

    // Delete all wishlist items
    await prisma.wishlist_Item.deleteMany({
      where: { wishlist_id: wishlist.id }
    });

    res.status(200).json({
      msg: "Wishlist cleared successfully"
    });
  } catch (error) {
    console.error("Error clearing wishlist:", error);
    next(error);
  }
};
