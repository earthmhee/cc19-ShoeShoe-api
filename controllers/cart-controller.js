// const prisma = require("../config/prisma");

// exports.viewcart = async (req, res, next) => {
//   try {
//     const { clerkID } = req.user; // รับค่า clerkID จาก Clerk Authentication
//     if (!clerkID) {
//       return res.status(401).json({ msg: "Unauthorized: กรุณาเข้าสู่ระบบ" });
//     }
    
//     console.log("Request received at /view-cart with Clerk ID:", clerkID);

//     // ค้นหา user ในฐานข้อมูลจาก clerkID
//     const user = await prisma.user.findUnique({
//       where: { clerkID },
//       include: {
//         cart: { include: { cartItems: { include: { product: true } } } },
//       }, // ดึงข้อมูลตะกร้าและสินค้า
//     });

//     if (!user || !user.cart) {
//       return res.status(404).json({ msg: "ไม่พบตะกร้าสินค้า" });
//     }

//     res.status(200).json({
//       msg: "View Cart Success",
//       cart: user.cart,
//     });
//   } catch (error) {
//     console.error("Error:", error);
//     next(error);
//   }
// };

// exports.addcart = async (req, res, next) => {
//   try {
//     const { clerkID } = req.user; // รับค่า clerkID จาก Clerk Authentication
//     const { product_id, quantity, sizeId } = req.body; // รับค่า product_id และจำนวนสินค้า

//     if (!clerkID) {
//       return res.status(401).json({ msg: "Unauthorized: กรุณาเข้าสู่ระบบ" });
//     }

//     if (!product_id || !quantity) {
//       return res.status(400).json({ msg: "กรุณาระบุสินค้าและจำนวนให้ครบถ้วน" });
//     }

//     console.log(" Request received at /add-cart with Clerk ID:", clerkID);
//     console.log(" Product ID:", product_id, "Quantity:", quantity);

//     // ตรวจสอบว่าสินค้ามีอยู่จริงหรือไม่
//     const existingProduct = await prisma.product.findUnique({
//       where: { id: parseInt(product_id) },
//     });

//     if (!existingProduct) {
//       return res.status(404).json({ msg: "ไม่พบสินค้าในระบบ" });
//     }

//     // ค้นหา user จาก clerkID
//     let user = await prisma.user.findUnique({
//       where: { clerkID },
//       include: { cart: true },
//     });

//     if (!user) {
//       return res.status(404).json({ msg: "ไม่พบบัญชีผู้ใช้" });
//     }

//     // ถ้ายังไม่มีตะกร้า ให้สร้างใหม่
//     if (!user.cart) {
//       user.cart = await prisma.cart.create({
//         data: {
//           user_id: user.id,
//         },
//       });
//     }

//     // ตรวจสอบว่าสินค้านี้มีอยู่ในตะกร้าแล้วหรือไม่
//     const existingCartItem = await prisma.cart_Item.findFirst({
//       where: {
//         cart_id: user.cart.id,
//         product_id: parseInt(product_id),
//       },
//     });

//     if (existingCartItem) {
//       // ถ้ามีสินค้าอยู่แล้วให้เพิ่มจำนวนสินค้า
//       await prisma.cart_Item.update({
//         where: { id: existingCartItem.id },
//         data: { quantity: existingCartItem.quantity + parseInt(quantity) },
//       });
//     } else {
//       // ถ้ายังไม่มี ให้เพิ่มสินค้าลงตะกร้า
//       await prisma.cart_Item.create({
//         data: {
//           cart_id: user.cart.id,
//           product_id: parseInt(product_id),
//           quantity: parseInt(quantity),
//         },
//       });
//     }

//     console.log("Product added to cart successfully!");

//     res.status(200).json({
//       msg: "Add to Cart Success",
//     });
//   } catch (error) {
//     console.error(" Error:", error);
//     next(error);
//   }
// };

// controllers/cartController.js
const prisma = require("../config/prisma");

// View cart
exports.viewcart = async (req, res, next) => {
  try {
    const  clerkID  = req.auth.userId
    console.log(req.auth.userId);
    
    if (!clerkID) {
      return res.status(401).json({ msg: "Unauthorized: กรุณาเข้าสู่ระบบ" });
    }
    
    console.log("Request received at /view-cart with Clerk ID:", clerkID);

    // Find user and include cart with items and product details
    const user = await prisma.user.findUnique({
      where: { clerkID },
      include: {
        cart: { 
          include: { 
            cartItems: { 
              include: { 
                product: true,
                size: true  // Include size information
              } 
            } 
          } 
        },
      },
    });

    if (!user || !user.cart) {
      // If no cart exists, return empty cart
      return res.status(200).json({
        msg: "Cart is empty",
        cart: {
          items: [],
          totalItems: 0,
          totalPrice: 0
        }
      });
    }

    // Format cart items for response
    const items = user.cart.cartItems.map(item => {
      const product = item.product;
      const size = item.size;
      
      // Calculate discounted price
      const price = product.price;
      const discount = product.discount || 0;
      const discountedPrice = discount > 0 
        ? (discount < 1 
            ? price - (price * discount) 
            : price - (price * (discount / 100)))
        : price;
      
      // Parse images
      let images = [];
      try {
        images = typeof product.images === 'string' 
          ? JSON.parse(product.images) 
          : (Array.isArray(product.images) ? product.images : []);
      } catch (e) {
        console.error('Error parsing images:', e);
      }
      
      return {
        id: item.id,
        productId: product.id,
        productName: product.productname,
        brand: product.brand,
        price,
        discountedPrice,
        image: images[0] || '',
        sizeId: size?.id,
        sizeUS: size?.us_size,
        sizeGender: size?.gender,
        quantity: item.quantity
      };
    });
    
    // Calculate totals
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce((sum, item) => sum + (item.discountedPrice * item.quantity), 0);

    res.status(200).json({
      msg: "View Cart Success",
      items,
      totalItems,
      totalPrice
    });
  } catch (error) {
    console.error("Error:", error);
    next(error);
  }
};

// Add to cart
exports.addcart = async (req, res, next) => {
  try {
    const { clerkID } = req.user;
    const { product_id, quantity, sizeId } = req.body;

    if (!clerkID) {
      return res.status(401).json({ msg: "Unauthorized: กรุณาเข้าสู่ระบบ" });
    }

    if (!product_id || !quantity || !sizeId) {
      return res.status(400).json({ msg: "กรุณาระบุสินค้า, ขนาด และจำนวนให้ครบถ้วน" });
    }

    console.log("Request received at /add-cart with Clerk ID:", clerkID);
    console.log("Product ID:", product_id, "Size ID:", sizeId, "Quantity:", quantity);

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id: parseInt(product_id) },
    });

    if (!existingProduct) {
      return res.status(404).json({ msg: "ไม่พบสินค้าในระบบ" });
    }

    // Check if size exists
    const existingSize = await prisma.size.findUnique({
      where: { id: parseInt(sizeId) },
    });

    if (!existingSize) {
      return res.status(404).json({ msg: "ไม่พบขนาดสินค้าในระบบ" });
    }

    // Check stock availability
    const stockItem = await prisma.stock.findFirst({
      where: {
        product_id: parseInt(product_id),
        size_id: parseInt(sizeId)
      }
    });

    if (!stockItem || stockItem.stock_quantity < parseInt(quantity)) {
      return res.status(400).json({ msg: "สินค้าไม่เพียงพอ" });
    }

    // Find user
    let user = await prisma.user.findUnique({
      where: { clerkID },
      include: { cart: true },
    });

    if (!user) {
      return res.status(404).json({ msg: "ไม่พบบัญชีผู้ใช้" });
    }

    // Create cart if it doesn't exist
    if (!user.cart) {
      user.cart = await prisma.cart.create({
        data: {
          user_id: user.id,
        },
      });
    }

    // Check if item already exists in cart
    const existingCartItem = await prisma.cart_Item.findFirst({
      where: {
        cart_id: user.cart.id,
        product_id: parseInt(product_id),
        size_id: parseInt(sizeId)
      },
    });

    if (existingCartItem) {
      // Update quantity if item exists
      await prisma.cart_Item.update({
        where: { id: existingCartItem.id },
        data: { quantity: existingCartItem.quantity + parseInt(quantity) },
      });
    } else {
      // Add new item to cart
      await prisma.cart_Item.create({
        data: {
          cart_id: user.cart.id,
          product_id: parseInt(product_id),
          size_id: parseInt(sizeId),
          quantity: parseInt(quantity),
        },
      });
    }

    // Get updated cart for response
    const updatedUser = await prisma.user.findUnique({
      where: { clerkID },
      include: {
        cart: { 
          include: { 
            cartItems: { 
              include: { 
                product: true,
                size: true
              } 
            } 
          } 
        },
      },
    });

    // Format cart items for response
    const items = updatedUser.cart.cartItems.map(item => {
      const product = item.product;
      const size = item.size;
      
      // Calculate discounted price
      const price = product.price;
      const discount = product.discount || 0;
      const discountedPrice = discount > 0 
        ? (discount < 1 
            ? price - (price * discount) 
            : price - (price * (discount / 100)))
        : price;
      
      // Parse images
      let images = [];
      try {
        images = typeof product.images === 'string' 
          ? JSON.parse(product.images) 
          : (Array.isArray(product.images) ? product.images : []);
      } catch (e) {
        console.error('Error parsing images:', e);
      }
      
      return {
        id: item.id,
        productId: product.id,
        productName: product.productname,
        brand: product.brand,
        price,
        discountedPrice,
        image: images[0] || '',
        sizeId: size?.id,
        sizeUS: size?.us_size,
        sizeGender: size?.gender,
        quantity: item.quantity
      };
    });
    
    // Calculate totals
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce((sum, item) => sum + (item.discountedPrice * item.quantity), 0);

    console.log("Product added to cart successfully!");

    res.status(200).json({
      msg: "Add to Cart Success",
      items,
      totalItems,
      totalPrice
    });
  } catch (error) {
    console.error("Error:", error);
    next(error);
  }
};

// Update cart item quantity
exports.updateCartItem = async (req, res, next) => {
  try {
    const { clerkID } = req.user;
    const { cartItemId } = req.params;
    const { quantity } = req.body;

    if (!clerkID) {
      return res.status(401).json({ msg: "Unauthorized: กรุณาเข้าสู่ระบบ" });
    }

    if (!cartItemId || !quantity) {
      return res.status(400).json({ msg: "กรุณาระบุรายการสินค้าและจำนวนให้ครบถ้วน" });
    }

    console.log("Request received at /update-cart-item with Clerk ID:", clerkID);
    console.log("Cart Item ID:", cartItemId, "New Quantity:", quantity);

    // Find user and cart
    const user = await prisma.user.findUnique({
      where: { clerkID },
      include: { cart: true },
    });

    if (!user || !user.cart) {
      return res.status(404).json({ msg: "ไม่พบตะกร้าสินค้า" });
    }

    // Find cart item
    const cartItem = await prisma.cart_Item.findFirst({
      where: {
        id: parseInt(cartItemId),
        cart_id: user.cart.id
      },
      include: {
        product: true,
        size: true
      }
    });

    if (!cartItem) {
      return res.status(404).json({ msg: "ไม่พบรายการสินค้าในตะกร้า" });
    }

    // Check stock availability
    const stockItem = await prisma.stock.findFirst({
      where: {
        product_id: cartItem.product_id,
        size_id: cartItem.size_id
      }
    });

    if (!stockItem || stockItem.stock_quantity < parseInt(quantity)) {
      return res.status(400).json({ msg: "สินค้าไม่เพียงพอ" });
    }

    // Update cart item quantity
    await prisma.cart_Item.update({
      where: { id: parseInt(cartItemId) },
      data: { quantity: parseInt(quantity) },
    });

    // Get updated cart for response
    const updatedUser = await prisma.user.findUnique({
      where: { clerkID },
      include: {
        cart: { 
          include: { 
            cartItems: { 
              include: { 
                product: true,
                size: true
              } 
            } 
          } 
        },
      },
    });

    // Format cart items for response
    const items = updatedUser.cart.cartItems.map(item => {
      const product = item.product;
      const size = item.size;
      
      // Calculate discounted price
      const price = product.price;
      const discount = product.discount || 0;
      const discountedPrice = discount > 0 
        ? (discount < 1 
            ? price - (price * discount) 
            : price - (price * (discount / 100)))
        : price;
      
      // Parse images
      let images = [];
      try {
        images = typeof product.images === 'string' 
          ? JSON.parse(product.images) 
          : (Array.isArray(product.images) ? product.images : []);
      } catch (e) {
        console.error('Error parsing images:', e);
      }
      
      return {
        id: item.id,
        productId: product.id,
        productName: product.productname,
        brand: product.brand,
        price,
        discountedPrice,
        image: images[0] || '',
        sizeId: size?.id,
        sizeUS: size?.us_size,
        sizeGender: size?.gender,
        quantity: item.quantity
      };
    });
    
    // Calculate totals
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce((sum, item) => sum + (item.discountedPrice * item.quantity), 0);

    console.log("Cart item updated successfully!");

    res.status(200).json({
      msg: "Update Cart Item Success",
      items,
      totalItems,
      totalPrice
    });
  } catch (error) {
    console.error("Error:", error);
    next(error);
  }
};

// Remove item from cart
exports.removeCartItem = async (req, res, next) => {
  try {
    const { clerkID } = req.user;
    const { cartItemId } = req.params;

    if (!clerkID) {
      return res.status(401).json({ msg: "Unauthorized: กรุณาเข้าสู่ระบบ" });
    }

    console.log("Request received at /remove-cart-item with Clerk ID:", clerkID);
    console.log("Cart Item ID:", cartItemId);

    // Find user and cart
    const user = await prisma.user.findUnique({
      where: { clerkID },
      include: { cart: true },
    });

    if (!user || !user.cart) {
      return res.status(404).json({ msg: "ไม่พบตะกร้าสินค้า" });
    }

    // Find cart item
    const cartItem = await prisma.cart_Item.findFirst({
      where: {
        id: parseInt(cartItemId),
        cart_id: user.cart.id
      }
    });

    if (!cartItem) {
      return res.status(404).json({ msg: "ไม่พบรายการสินค้าในตะกร้า" });
    }

    // Delete cart item
    await prisma.cart_Item.delete({
      where: { id: parseInt(cartItemId) },
    });

    // Get updated cart for response
    const updatedUser = await prisma.user.findUnique({
      where: { clerkID },
      include: {
        cart: { 
          include: { 
            cartItems: { 
              include: { 
                product: true,
                size: true
              } 
            } 
          } 
        },
      },
    });

    // Format cart items for response
    const items = updatedUser.cart.cartItems.map(item => {
      const product = item.product;
      const size = item.size;
      
      // Calculate discounted price
      const price = product.price;
      const discount = product.discount || 0;
      const discountedPrice = discount > 0 
        ? (discount < 1 
            ? price - (price * discount) 
            : price - (price * (discount / 100)))
        : price;
      
      // Parse images
      let images = [];
      try {
        images = typeof product.images === 'string' 
          ? JSON.parse(product.images) 
          : (Array.isArray(product.images) ? product.images : []);
      } catch (e) {
        console.error('Error parsing images:', e);
      }
      
      return {
        id: item.id,
        productId: product.id,
        productName: product.productname,
        brand: product.brand,
        price,
        discountedPrice,
        image: images[0] || '',
        sizeId: size?.id,
        sizeUS: size?.us_size,
        sizeGender: size?.gender,
        quantity: item.quantity
      };
    });
    
    // Calculate totals
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce((sum, item) => sum + (item.discountedPrice * item.quantity), 0);

    console.log("Cart item removed successfully!");

    res.status(200).json({
      msg: "Remove Cart Item Success",
      items,
      totalItems,
      totalPrice
    });
  } catch (error) {
    console.error("Error:", error);
    next(error);
  }
};

// Clear cart
exports.clearCart = async (req, res, next) => {
  try {
    const { clerkID } = req.user;

    if (!clerkID) {
      return res.status(401).json({ msg: "Unauthorized: กรุณาเข้าสู่ระบบ" });
    }

    console.log("Request received at /clear-cart with Clerk ID:", clerkID);

    // Find user and cart
    const user = await prisma.user.findUnique({
      where: { clerkID },
      include: { cart: true },
    });

    if (!user || !user.cart) {
      return res.status(404).json({ msg: "ไม่พบตะกร้าสินค้า" });
    }

    // Delete all cart items
    await prisma.cart_Item.deleteMany({
      where: { cart_id: user.cart.id },
    });

    console.log("Cart cleared successfully!");

    res.status(200).json({
      msg: "Clear Cart Success",
      items: [],
      totalItems: 0,
      totalPrice: 0
    });
  } catch (error) {
    console.error("Error:", error);
    next(error);
  }
};

// Checkout
exports.checkout = async (req, res, next) => {
  try {
    const { clerkID } = req.user;
    const { shippingDetails } = req.body;

    if (!clerkID) {
      return res.status(401).json({ msg: "Unauthorized: กรุณาเข้าสู่ระบบ" });
    }

    if (!shippingDetails) {
      return res.status(400).json({ msg: "กรุณาระบุข้อมูลการจัดส่ง" });
    }

    console.log("Request received at /checkout with Clerk ID:", clerkID);

    // Find user and cart with items
    const user = await prisma.user.findUnique({
      where: { clerkID },
      include: {
        cart: { 
          include: { 
            cartItems: { 
              include: { 
                product: true,
                size: true
              } 
            } 
          } 
        },
      },
    });

    if (!user || !user.cart || user.cart.cartItems.length === 0) {
      return res.status(404).json({ msg: "ไม่พบสินค้าในตะกร้า" });
    }

    // Calculate order total
    let orderTotal = 0;
    const orderItems = [];

    for (const item of user.cart.cartItems) {
      // Check stock availability
      const stockItem = await prisma.stock.findFirst({
        where: {
          product_id: item.product_id,
          size_id: item.size_id
        }
      });

      if (!stockItem || stockItem.stock_quantity < item.quantity) {
        return res.status(400).json({ 
          msg: `สินค้า ${item.product.productname} ขนาด ${item.size.us_size} มีไม่เพียงพอ` 
        });
      }

      // Calculate item price
      const price = item.product.price;
      const discount = item.product.discount || 0;
      const discountedPrice = discount > 0 
        ? (discount < 1 
            ? price - (price * discount) 
            : price - (price * (discount / 100)))
        : price;
      
      orderTotal += discountedPrice * item.quantity;
      
      orderItems.push({
        product_id: item.product_id,
        size_id: item.size_id,
        quantity: item.quantity,
        price: discountedPrice
      });
    }

    // Create order
    const order = await prisma.order.create({
      data: {
        user_id: user.id,
        total_amount: orderTotal,
        status: 'pending',
        shipping_address: shippingDetails.address,
        shipping_city: shippingDetails.city,
        shipping_postal_code: shippingDetails.postalCode,
        shipping_country: shippingDetails.country,
        order_items: {
          create: orderItems.map(item => ({
            product_id: item.product_id,
            size_id: item.size_id,
            quantity: item.quantity,
            price: item.price
          }))
        }
      }
    });

    // Update stock quantities
    for (const item of user.cart.cartItems) {
      const stockItem = await prisma.stock.findFirst({
        where: {
          product_id: item.product_id,
          size_id: item.size_id
        }
      });
      
      await prisma.stock.update({
        where: { id: stockItem.id },
        data: { stock_quantity: stockItem.stock_quantity - item.quantity }
      });
    }

    // Clear cart
    await prisma.cart_Item.deleteMany({
      where: { cart_id: user.cart.id },
    });

    console.log("Checkout completed successfully!");

    res.status(200).json({
      msg: "Checkout Success",
      order: {
        id: order.id,
        totalAmount: order.total_amount,
        status: order.status,
        createdAt: order.created_at
      }
    });
  } catch (error) {
    console.error("Error:", error);
    next(error);
  }
};