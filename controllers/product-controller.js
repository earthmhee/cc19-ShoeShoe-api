const prisma = require("../config/prisma");

exports.showproduct = async (req, res, next) => {
  try {
    // ตรวจสอบว่า req.body มีค่าหรือไม่
    const filters = req?.body || {};
    console.log("📌 Received filter parameters:", filters);

    // ฟิลเตอร์พื้นฐาน
    const filter = {};

    if (filters.category) {
      filter.category_id = parseInt(filters.category);
    }
    if (filters.gender) {
      filter.gender = filters.gender;
    }
    if (filters.brand) {
      filter.brand = filters.brand;
    }
    if (filters.priceRange) {
      filter.price = {};
      if (filters.priceRange.min !== undefined) {
        filter.price.gte = parseInt(filters.priceRange.min);
      }
      if (filters.priceRange.max !== undefined) {
        filter.price.lte = parseInt(filters.priceRange.max);
      }
    }

    console.log("📌 Applied filters:", filter);

    // ดึงสินค้าจากฐานข้อมูล
    let products = await prisma.product.findMany({
      where: filter,
      include: {
        category: true,
        stock: { include: { size: true } },
      },
    });

    console.log(`📌 Found ${products.length} products`);

    // ตรวจสอบว่ามี `res` หรือไม่ (ถ้าเรียกจาก API)
    if (res) {
      return res.status(200).json({ msg: "Get Products Success", data: products });
    }
    return products; // คืนค่าสำหรับการใช้ใน AI Controller
  } catch (error) {
    console.error("❌ Error fetching products:", error);
    if (res) {
      return res.status(500).json({ msg: "Error fetching products" });
    }
    return [];
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

// controllers/product-controller.js
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Request params:', req.params);
    console.log('Product ID:', req.params.id);
    // Validate id
    if (!id) {
      return res.status(400).json({
        status: 'error',
        message: 'Product ID is required'
      });
    }

    // Convert id to integer and validate
    const productId = parseInt(id);
    if (isNaN(productId)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid product ID format'
      });
    }

    const product = await prisma.product.findUnique({
      where: {
        id: productId  // Make sure to pass the actual value, not just the type
      },
      include: {
        category: true,
        stock: true,
        reviews: {
          include: {
            user: {
              select: {
                username: true,
              }
            }
          }
        }
      }
    });

    if (!product) {
      return res.status(404).json({
        status: 'error',
        message: 'Product not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: product
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch product',
      error: error.message
    });
  }
};
exports.deleteproduct = async (req, res, next) => {
    try {
        const { id } = req.params; // รับค่า id จาก URL
        if (!id) {
            return res.status(400).json({ msg: "กรุณาระบุ ID ของสินค้า" });
        }

        console.log("Request received at /delete-product with ID:", id);

        // ตรวจสอบว่าสินค้ามีอยู่จริง
        const existingProduct = await prisma.product.findUnique({
            where: { id: parseInt(id) },
        });

        if (!existingProduct) {
            return res.status(404).json({ msg: "ไม่พบสินค้าในระบบ" });
        }

        // ลบสินค้าออกจากฐานข้อมูล
        await prisma.product.delete({
            where: { id: parseInt(id) },
        });

        console.log("Product deleted successfully:", id);

        res.status(200).json({
            msg: "Delete Product Success",
            productId: id,
        });
    } catch (error) {
        console.error("Error:", error);
        next(error);
    }
};
