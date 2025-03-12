const prisma = require("../config/prisma");

exports.viewcart = async (req, res, next) => {
  try {
    const { clerkID } = req.user; // รับค่า clerkID จาก Clerk Authentication
    if (!clerkID) {
      return res.status(401).json({ msg: "Unauthorized: กรุณาเข้าสู่ระบบ" });
    }

    console.log("Request received at /view-cart with Clerk ID:", clerkID);

    // ค้นหา user ในฐานข้อมูลจาก clerkID
    const user = await prisma.user.findUnique({
      where: { clerkID },
      include: {
        cart: { include: { cartItems: { include: { product: true } } } },
      }, // ดึงข้อมูลตะกร้าและสินค้า
    });

    if (!user || !user.cart) {
      return res.status(404).json({ msg: "ไม่พบตะกร้าสินค้า" });
    }

    res.status(200).json({
      msg: "View Cart Success",
      cart: user.cart,
    });
  } catch (error) {
    console.error("Error:", error);
    next(error);
  }
};

exports.addcart = async (req, res, next) => {
  try {
    const { clerkID } = req.user; // รับค่า clerkID จาก Clerk Authentication
    const { product_id, quantity } = req.body; // รับค่า product_id และจำนวนสินค้า

    if (!clerkID) {
      return res.status(401).json({ msg: "Unauthorized: กรุณาเข้าสู่ระบบ" });
    }

    if (!product_id || !quantity) {
      return res.status(400).json({ msg: "กรุณาระบุสินค้าและจำนวนให้ครบถ้วน" });
    }

    console.log(" Request received at /add-cart with Clerk ID:", clerkID);
    console.log(" Product ID:", product_id, "Quantity:", quantity);

    // ตรวจสอบว่าสินค้ามีอยู่จริงหรือไม่
    const existingProduct = await prisma.product.findUnique({
      where: { id: parseInt(product_id) },
    });

    if (!existingProduct) {
      return res.status(404).json({ msg: "ไม่พบสินค้าในระบบ" });
    }

    // ค้นหา user จาก clerkID
    let user = await prisma.user.findUnique({
      where: { clerkID },
      include: { cart: true },
    });

    if (!user) {
      return res.status(404).json({ msg: "ไม่พบบัญชีผู้ใช้" });
    }

    // ถ้ายังไม่มีตะกร้า ให้สร้างใหม่
    if (!user.cart) {
      user.cart = await prisma.cart.create({
        data: {
          user_id: user.id,
        },
      });
    }

    // ตรวจสอบว่าสินค้านี้มีอยู่ในตะกร้าแล้วหรือไม่
    const existingCartItem = await prisma.cart_Item.findFirst({
      where: {
        cart_id: user.cart.id,
        product_id: parseInt(product_id),
      },
    });

    if (existingCartItem) {
      // ถ้ามีสินค้าอยู่แล้วให้เพิ่มจำนวนสินค้า
      await prisma.cart_Item.update({
        where: { id: existingCartItem.id },
        data: { quantity: existingCartItem.quantity + parseInt(quantity) },
      });
    } else {
      // ถ้ายังไม่มี ให้เพิ่มสินค้าลงตะกร้า
      await prisma.cart_Item.create({
        data: {
          cart_id: user.cart.id,
          product_id: parseInt(product_id),
          quantity: parseInt(quantity),
        },
      });
    }

    console.log("Product added to cart successfully!");

    res.status(200).json({
      msg: "Add to Cart Success",
    });
  } catch (error) {
    console.error(" Error:", error);
    next(error);
  }
};
