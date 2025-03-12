const prisma = require("../config/prisma");

exports.showproduct = async (req, res, next) => {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
        // reviews: true,   //เก็บไว้ก่อน
        stock: true,
      },
    });

    res.status(200).json({
      msg: "add Product Success",
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

exports.addproduct = async (req, res, next) => {
  try {
    const {
      productname,
      description,
      price,
      discount,
      brand,
      gender,
      images,
      category_id,
    } = req.body;

    console.log(" Received Data:", req.body); // ดูว่าข้อมูลจาก client ถูกส่งมาไหม

    // ตรวจสอบว่าข้อมูลที่จำเป็นครบถ้วน
    if (
      !productname ||
      !price ||
      !brand ||
      !gender ||
      !images ||
      !category_id
    ) {
      console.error("ข้อมูลไม่ครบถ้วน");
      return res.status(400).json({ msg: "กรุณากรอกข้อมูลให้ครบถ้วน" });
    }

    // เพิ่มสินค้าใหม่ลงในฐานข้อมูล
    const newProduct = await prisma.product.create({
      data: {
        productname,
        description,
        price: parseInt(price),
        discount: discount ? parseInt(discount) : null,
        brand,
        gender,
        images,
        category_id: parseInt(category_id),
      },
    });

    console.log("Product added successfully:", newProduct); // Log ข้อมูลสินค้าที่เพิ่มสำเร็จ

    res.status(201).json({
      msg: "add Product Success",
      data: newProduct,
    });
  } catch (error) {
    console.error("Error:", error); // Log error
    next(error);
  }
};

exports.updateproduct = async (req, res, next) => {
  try {
    const { id } = req.params; // รับค่า id ของสินค้าที่ต้องการอัปเดต
    const {
      productname,
      description,
      price,
      discount,
      brand,
      gender,
      images,
      category_id,
    } = req.body;

    console.log("Request received at /update-product with ID:", id);
    console.log("Update Data:", req.body);

    // ตรวจสอบว่ามีสินค้านี้ในฐานข้อมูลหรือไม่
    const existingProduct = await prisma.product.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingProduct) {
      return res.status(404).json({ msg: "ไม่พบสินค้าในระบบ" });
    }

    // ถ้ามี category_id ใหม่ ต้องตรวจสอบว่าหมวดหมู่นั้นมีอยู่จริง
    if (category_id) {
      const existingCategory = await prisma.category.findUnique({
        where: { id: parseInt(category_id) },
      });

      if (!existingCategory) {
        return res
          .status(400)
          .json({ msg: "category_id ไม่ถูกต้อง หรือไม่มีอยู่ในระบบ" });
      }
    }

    // อัปเดตข้อมูลสินค้า
    const updatedProduct = await prisma.product.update({
      where: { id: parseInt(id) },
      data: {
        productname,
        description,
        price: price ? parseInt(price) : undefined,
        discount: discount ? parseInt(discount) : undefined,
        brand,
        gender,
        images,
        category_id: category_id ? parseInt(category_id) : undefined,
      },
    });

    console.log("Product updated successfully:", updatedProduct);

    res.status(200).json({
      msg: "Update Product Success",
      data: updatedProduct,
    });
  } catch (error) {
    console.error("Error:", error);
    next(error);
  }
};
