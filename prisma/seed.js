const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();


async function main() {
  // Create categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { id: 1 },
      update: {},
      create: {
        categoryname: "Sneakers",
      },
    }),
    prisma.category.upsert({
      where: { id: 2 },
      update: {},
      create: {
        categoryname: "Sports",
      },
    }),
    prisma.category.upsert({
      where: { id: 3 },
      update: {},
      create: {
        categoryname: "Sandals",
      },
    }),
    prisma.category.upsert({
      where: { id: 4 },
      update: {},
      create: {
        categoryname: "Slippers",
      },
    }),
  ]);

  console.log("Categories created");

  // Create sizes for men
  const menSizes = [];
  for (let i = 7; i <= 13; i++) {
    const size = await prisma.size.upsert({
      where: { id: i - 6 },
      update: {},
      create: {
        us_size: i,
        gender: "Men",
      },
    });
    menSizes.push(size);
  }

  // Create sizes for women
  const womenSizes = [];
  for (let i = 5; i <= 11; i++) {
    const size = await prisma.size.upsert({
      where: { id: i + 2 },
      update: {},
      create: {
        us_size: i,
        gender: "Women",
      },
    });
    womenSizes.push(size);
  }

  console.log("Sizes created");

  // Product seed data with 3 images per product
  const products = [
    // Men's Sneakers
    {
      productname: "Air Classic Runner",
      description:
        "The iconic casual sneaker with air cushioning and premium materials for everyday comfort.",
      price: 12990,
      discount: 0,
      brand: "Nike",
      gender: "Men",
      category_id: 1, // Sneakers
      images:JSON.stringify ([
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1740105121/pic_1740105116285_16.jpg",
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1740105121/pic_1740105116285_16.jpg",
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1740105121/pic_1740105116285_16.jpg",
      ]),
      sizes: menSizes.map((size) => ({
        size_id: size.id,
        stock_quantity: Math.floor(Math.random() * 20) + 10,
      })),
    },
    {
      productname: "Street Force One",
      description:
        "A streetwear staple with clean lines and premium leather for urban style.",
      price: 10990,
      discount: 1000,
      brand: "Nike",
      gender: "Men",
      category_id: 1, // Sneakers
      images:JSON.stringify ([
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1740105121/pic_1740105116285_16.jpg",
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1740105121/pic_1740105116285_16.jpg",
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1740105121/pic_1740105116285_16.jpg",
      ]),
      sizes: menSizes.map((size) => ({
        size_id: size.id,
        stock_quantity: Math.floor(Math.random() * 20) + 10,
      })),
    },
    {
      productname: "Originals Superlight",
      description:
        "Classic three-stripe design with modern comfort features and lightweight construction.",
      price: 9990,
      discount: 1500,
      brand: "Adidas",
      gender: "Men",
      category_id: 1, // Sneakers
      images:JSON.stringify ([
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1740105121/pic_1740105116285_16.jpg",
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1740105121/pic_1740105116285_16.jpg",
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1740105121/pic_1740105116285_16.jpg",
      ]),
      sizes: menSizes.map((size) => ({
        size_id: size.id,
        stock_quantity: Math.floor(Math.random() * 20) + 10,
      })),
    },

    // Women's Sneakers
    {
      productname: "Cloud Stepper",
      description:
        "Lightweight sneakers designed for everyday comfort with cloud-like cushioning.",
      price: 8990,
      discount: 0,
      brand: "Nike",
      gender: "Women",
      category_id: 1, // Sneakers
      images:JSON.stringify ([
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1740105121/pic_1740105116285_16.jpg",
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1740105121/pic_1740105116285_16.jpg",
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1740105121/pic_1740105116285_16.jpg",
      ]),
      sizes: womenSizes.map((size) => ({
        size_id: size.id,
        stock_quantity: Math.floor(Math.random() * 20) + 10,
      })),
    },
    {
      productname: "Urban Glider",
      description:
        "Sleek and stylish sneakers perfect for city life with responsive cushioning.",
      price: 9990,
      discount: 2000,
      brand: "Adidas",
      gender: "Women",
      category_id: 1, // Sneakers
      images:JSON.stringify ([
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1740105121/pic_1740105116285_16.jpg",
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1740105121/pic_1740105116285_16.jpg",
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1740105121/pic_1740105116285_16.jpg",
      ]),
      sizes: womenSizes.map((size) => ({
        size_id: size.id,
        stock_quantity: Math.floor(Math.random() * 20) + 10,
      })),
    },

    // Men's Sports
    {
      productname: "Pro Runner Elite",
      description:
        "Professional-grade running shoes with responsive cushioning and breathable mesh for maximum performance.",
      price: 14990,
      discount: 1000,
      brand: "Nike",
      gender: "Men",
      category_id: 2, // Sports
      images:JSON.stringify ([
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1740105121/pic_1740105116285_16.jpg",
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1740105121/pic_1740105116285_16.jpg",
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1740105121/pic_1740105116285_16.jpg",
      ]),
      sizes: menSizes.map((size) => ({
        size_id: size.id,
        stock_quantity: Math.floor(Math.random() * 20) + 10,
      })),
    },
    {
      productname: "Court Dominator",
      description:
        "Basketball shoes with ankle support and exceptional grip for quick cuts and jumps.",
      price: 13990,
      discount: 0,
      brand: "Nike",
      gender: "Men",
      category_id: 2, // Sports
      images:JSON.stringify ([
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1740105121/pic_1740105116285_16.jpg",
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1740105121/pic_1740105116285_16.jpg",
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1740105121/pic_1740105116285_16.jpg",
      ]),
      sizes: menSizes.map((size) => ({
        size_id: size.id,
        stock_quantity: Math.floor(Math.random() * 20) + 10,
      })),
    },

    // Women's Sports
    {
      productname: "Flex Runner Lite",
      description:
        "Ultra-lightweight running shoes designed for women with flexible soles and breathable upper.",
      price: 11990,
      discount: 1500,
      brand: "Nike",
      gender: "Women",
      category_id: 2, // Sports
      images:JSON.stringify ([
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1740105121/pic_1740105116285_16.jpg",
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1740105121/pic_1740105116285_16.jpg",
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1740105121/pic_1740105116285_16.jpg",
      ]),
      sizes: womenSizes.map((size) => ({
        size_id: size.id,
        stock_quantity: Math.floor(Math.random() * 20) + 10,
      })),
    },
    {
      productname: "Endurance Trail",
      description:
        "Trail running shoes with rugged outsole for excellent traction on rough terrain.",
      price: 12990,
      discount: 0,
      brand: "Adidas",
      gender: "Women",
      category_id: 2, // Sports
      images:JSON.stringify ([
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1740105121/pic_1740105116285_16.jpg",
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1740105121/pic_1740105116285_16.jpg",
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1740105121/pic_1740105116285_16.jpg",
      ]),
      sizes: womenSizes.map((size) => ({
        size_id: size.id,
        stock_quantity: Math.floor(Math.random() * 20) + 10,
      })),
    },

    // Men's Sandals
    {
      productname: "Comfort Slide",
      description:
        "Casual slides with contoured footbed for maximum comfort and support.",
      price: 4990,
      discount: 500,
      brand: "Nike",
      gender: "Men",
      category_id: 3, // Sandals
      images:JSON.stringify ([
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1740105121/pic_1740105116285_16.jpg",
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1740105121/pic_1740105116285_16.jpg",
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1740105121/pic_1740105116285_16.jpg",
      ]),
      sizes: menSizes.map((size) => ({
        size_id: size.id,
        stock_quantity: Math.floor(Math.random() * 20) + 10,
      })),
    },
    {
      productname: "Adventure Strap",
      description:
        "Rugged outdoor sandals with adjustable straps and durable outsole for hiking and water activities.",
      price: 6990,
      discount: 0,
      brand: "Teva",
      gender: "Men",
      category_id: 3, // Sandals
      images:JSON.stringify ([
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1740105121/pic_1740105116285_16.jpg",
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1740105121/pic_1740105116285_16.jpg",
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1740105121/pic_1740105116285_16.jpg",
      ]),
      sizes: menSizes.map((size) => ({
        size_id: size.id,
        stock_quantity: Math.floor(Math.random() * 20) + 10,
      })),
    },

    // Women's Sandals
    {
      productname: "Summer Breeze",
      description:
        "Lightweight and comfortable sandals with soft straps and cushioned footbed for everyday summer wear.",
      price: 5990,
      discount: 1000,
      brand: "Birkenstock",
      gender: "Women",
      category_id: 3, // Sandals
      images:JSON.stringify ([
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1740105121/pic_1740105116285_16.jpg",
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1740105121/pic_1740105116285_16.jpg",
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1740105121/pic_1740105116285_16.jpg",
      ]),
      sizes: womenSizes.map((size) => ({
        size_id: size.id,
        stock_quantity: Math.floor(Math.random() * 20) + 10,
      })),
    },
    {
      productname: "Elegant Strappy",
      description:
        "Stylish sandals with decorative straps and slight heel, perfect for casual outings or beach events.",
      price: 7990,
      discount: 0,
      brand: "Steve Madden",
      gender: "Women",
      category_id: 3, // Sandals
      images:JSON.stringify ([
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1740105121/pic_1740105116285_16.jpg",
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1740105121/pic_1740105116285_16.jpg",
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1740105121/pic_1740105116285_16.jpg",
      ]),
      sizes: womenSizes.map((size) => ({
        size_id: size.id,
        stock_quantity: Math.floor(Math.random() * 20) + 10,
      })),
    },

    // Men's Slippers
    {
      productname: "Home Comfort",
      description:
        "Plush indoor slippers with memory foam insole for ultimate relaxation at home.",
      price: 3990,
      discount: 0,
      brand: "UGG",
      gender: "Men",
      category_id: 4, // Slippers
      images:JSON.stringify ([
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1740105121/pic_1740105116285_16.jpg",
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1740105121/pic_1740105116285_16.jpg",
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1740105121/pic_1740105116285_16.jpg",
      ]),
      sizes: menSizes.map((size) => ({
        size_id: size.id,
        stock_quantity: Math.floor(Math.random() * 20) + 10,
      })),
    },
    {
      productname: "Lounge Moccasin",
      description:
        "Classic moccasin-style slippers with soft lining and durable sole for indoor and light outdoor use.",
      price: 4590,
      discount: 500,
      brand: "Polo Ralph Lauren",
      gender: "Men",
      category_id: 4, // Slippers
      images:JSON.stringify ([
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1740105121/pic_1740105116285_16.jpg",
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1740105121/pic_1740105116285_16.jpg",
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1740105121/pic_1740105116285_16.jpg",
      ]),
      sizes: menSizes.map((size) => ({
        size_id: size.id,
        stock_quantity: Math.floor(Math.random() * 20) + 10,
      })),
    },

    // Women's Slippers
    {
      productname: "Fluffy Cloud",
      description:
        "Ultra-soft fuzzy slippers with cloud-like cushioning for cozy comfort around the house.",
      price: 3490,
      discount: 0,
      brand: "UGG",
      gender: "Women",
      category_id: 4, // Slippers
      images:JSON.stringify ([
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1740105121/pic_1740105116285_16.jpg",
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1740105121/pic_1740105116285_16.jpg",
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1740105121/pic_1740105116285_16.jpg",
      ]),
      sizes: womenSizes.map((size) => ({
        size_id: size.id,
        stock_quantity: Math.floor(Math.random() * 20) + 10,
      })),
    },
    {
      productname: "Cozy Bootie",
      description:
        "Ankle-height slipper boots with soft lining and rubber sole, perfect for keeping feet warm during colder months.",
      price: 5990,
      discount: 1000,
      brand: "UGG",
      gender: "Women",
      category_id: 4, // Slippers
      images:JSON.stringify ([
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1740105121/pic_1740105116285_16.jpg",
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1740105121/pic_1740105116285_16.jpg",
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1740105121/pic_1740105116285_16.jpg",
      ]),
      sizes: womenSizes.map((size) => ({
        size_id: size.id,
        stock_quantity: Math.floor(Math.random() * 20) + 10,
      })),
    },
  ];

  // Create products and their stock entries
  for (const productData of products) {
    const { sizes, ...productInfo } = productData;
    const product = await prisma.product.create({
      data: productInfo,
    });

    // Create stock entries for each size
    for (const sizeData of sizes) {
      await prisma.stock.create({
        data: {
          product_id: product.id,
          size_id: sizeData.size_id,
          stock_quantity: sizeData.stock_quantity,
          updated_at: new Date(),
        },
      });
    }
  }

  console.log("Products and stock created");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
