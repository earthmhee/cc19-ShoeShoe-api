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
      productname: "Adidas campus 00s men's sneakers - collegiate navy",
      description:
        "Introducing the CAMPUS 00s Shoes for men, a nod to the iconic primary colours of the 2000s. Crafted from leather and textile with a rubber outsole, these shoes are an update on the classic CAMPUS 80s silhouette. The vibrant full body colour is contrasted by white stripes and terry lining, creating a strong aesthetic that's both simple and impactful. Lace up and step into a new generation of style with these LWG & PREFERRED MATERIALS shoes.",
      price: 3800,
      discount: 0.2,
      brand: "Adidas",
      gender: "Men",
      category_id: 1, // Sneakers1
      images: JSON.stringify([
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1742188337/9991-ADIJI4488NAV008-1_det73l.jpg",
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1742188361/9991-ADIJI4488NAV008-2_ucym4r.jpg",
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1742188387/9991-ADIJI4488NAV008-3_aqunr2.jpg",
      ]),
      sizes: menSizes.map((size) => ({
        size_id: size.id,
        stock_quantity: Math.floor(Math.random() * 20) + 10,
      })),
    },
    {
      productname: "Gazelle men's sneakers - mineral green",
      description:
        "Stride in style with the Gazelle Shoes, a classic adidas icon that transcends trends. Crafted from premium suede with a comfortable nylon tongue and robust rubber outsole, these shoes were originally born for training but quickly found their place in the lifestyle realm. With dark gum soles and lace closure, the Gazelle embodies timeless design and unwavering comfort for every man's wardrobe.",
      price: 3800,
      discount: 0.1,
      brand: "Adidas",
      gender: "Men",
      category_id: 1, // Sneakers2
      images: JSON.stringify([
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1742188097/9991-ADIIF9655EE0009-1_dx6s9n.jpg",
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1742188110/9991-ADIIF9655EE0009-2_zhdbax.jpg",
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1742188127/9991-ADIIF9655EE0009-3_m6eeif.jpg",
      ]),
      sizes: menSizes.map((size) => ({
        size_id: size.id,
        stock_quantity: Math.floor(Math.random() * 20) + 10,
      })),
    },
    {
      productname: "1906 unisex sneakers shoes - grey",
      description:
        "The 1906R, like its cousins the 2002R and the 860v2, is led by a sole unit featuring a combination of flexible ACTEVA LITE cushioning, shock absorbing N-ergy, and segmented ABZORB SBS pods at the heel. This hi-tech approach is also reflected in the 1906R's upper design, which features open-holed mesh and a series of curvilinear synthetic overlays. This distinctive take on the era's design conventions offers a refined execution of high-performance heritage.",
      price: 6000,
      discount: 0,
      brand: "New Balance",
      gender: "Men",
      category_id: 1, // Sneakers3
      images: JSON.stringify([
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1741702912/9991-NEWU1906RNYGRE008-1_octatw.jpg",
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1741702959/9991-NEWU1906RNYGRE008-3_yccwm9.jpg",
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1741702967/9991-NEWU1906RNYGRE008-4_opw3qw.jpg",
      ]),
      sizes: menSizes.map((size) => ({
        size_id: size.id,
        stock_quantity: Math.floor(Math.random() * 20) + 10,
      })),
    },
    {
      productname: "530 men's sneakers shoes- white/silver",
      description:
        "The 530 is back, and it comes in a range of stunning new colors.Inspired by our classic running shoes, the design is a throwback to the 1990s-2000s, especially the unique ABZORB® footbed. Each version has a breathable mesh upper for freshness and comfort.",
      price: 3900,
      discount: 0,
      brand: "New Balance",
      gender: "Men",
      category_id: 1, // Sneakers4
      images: JSON.stringify([
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1741703307/9991-NEWMR530EMA00W009-1_p1kxtw.jpg",
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1741703326/9991-NEWMR530EMA00W009-2_tdx7r9.jpg",
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1741703343/9991-NEWMR530EMA00W009-3_ikvfnd.jpg",
      ]),
      sizes: menSizes.map((size) => ({
        size_id: size.id,
        stock_quantity: Math.floor(Math.random() * 20) + 10,
      })),
    },
    {
      productname: "Nike air jordan 1 low men's basketball shoes - white",
      description:
        "Inspired by the original that debuted in 1985, the Air Jordan 1 Low offers a clean, classic look that's familiar yet always fresh. With an iconic design that pairs perfectly with any 'fit, these kicks ensure you'll always be on point.",
      price: 4300,
      discount: 0.2,
      brand: "Nike",
      gender: "Men",
      category_id: 1, // Sneakers5
      images: JSON.stringify([
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1741703511/9991-NIK55355817200W008-1_xboav9.jpg",
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1741703516/9991-NIK55355817200W008-2_lgxnkq.jpg",
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1741703526/9991-NIK55355817200W008-3_ywzadg.jpg",
      ]),
      sizes: menSizes.map((size) => ({
        size_id: size.id,
        stock_quantity: Math.floor(Math.random() * 20) + 10,
      })),
    },
    {
      productname: "9060 unisex sneakers shoes - grey",
      description:
        "The 9060 is a new expression of the refined style and innovation-led design of the classic 99X series. The 9060 reinterprets familiar 99X elements with a warped sensibility inspired by the proudly futuristic, visible tech aesthetic of the Y2K era. Sway bars, taken from the 990, are expanded and utilized throughout the entire upper for a sense of visible motion, while wavy lines and scaled up proportions on a sculpted pod midsole place an exaggerated emphasis on the familiar cushioning platforms of ABZORB and SBS.",
      price: 6300,
      discount: 0,
      brand: "Nike",
      gender: "Men",
      category_id: 1, // Sneakers6
      images: JSON.stringify([
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1741703649/9991-NEWU9060ZGBGRE007-1_p1yhhd.jpg",
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1741703662/9991-NEWU9060ZGBGRE007-3_zqwlcy.jpg",
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1741703670/9991-NEWU9060ZGBGRE007-4_kdjkoo.jpg",
      ]),
      sizes: menSizes.map((size) => ({
        size_id: size.id,
        stock_quantity: Math.floor(Math.random() * 20) + 10,
      })),
    },
    {
      productname: "Star player 76 men's sneakers - white/ocean drip/black",
      description:
        "COLOR REVIVAL Refresh your look with these sporty, archival low-tops. Durable canvas and leather details bring some classic style to your summer strut, while bold seasonal colors breathe new life into any wardrobe. Features And Benefits Classic canvas for that timeless Star Player look and feel OrthoLite cushioning helps provide optimal comfort Molded, brick-patterned outsole and classic diamond-texture toe bumper Iconic, leather Star Chevron",
      price: 2400,
      discount: 0,
      brand: "Converse",
      gender: "Men",
      category_id: 1, // Sneakers7
      images: JSON.stringify([
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1741703882/9991-CONA09857C00W004-1_agiova.jpg",
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1741703905/9991-CONA09857C00W004-3_gvdslg.jpg",
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1741703933/9991-CONA09857C00W004-4_gtu2pe.jpg",
      ]),
      sizes: menSizes.map((size) => ({
        size_id: size.id,
        stock_quantity: Math.floor(Math.random() * 20) + 10,
      })),
    },
    {
      productname: "Fastbreak pro men's sneakers - white/enamel red/white",
      description:
        "The Fastbreak Pro Men's Sneakers in White/Enamel Red/White blend vintage basketball style with modern performance. Featuring a leather and suede upper, cushioned insole, and a grippy rubber outsole, they deliver comfort, durability, and classic court-inspired looks.",
      price: 3010,
      discount: 0.3,
      brand: "Converse",
      gender: "Men",
      category_id: 1, // Sneakers8
      images: JSON.stringify([
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1741704183/9991-CONA10200C00W007-1_btrbnn.jpg",
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1741704207/9991-CONA10200C00W007-3_yfmv7b.jpg",
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1741704215/9991-CONA10200C00W007-4_vicoyz.jpg",
      ]),
      sizes: menSizes.map((size) => ({
        size_id: size.id,
        stock_quantity: Math.floor(Math.random() * 20) + 10,
      })),
    },

    // Men's Sports
    {
      productname: "Hoka men's clifton 9 running shoes - black / black",
      description:
        "Lighter and more cushioned than ever before. Eliminating weight while adding 3mm in stack height, a revitalized underfoot experience with a responsive new foam and improved outsole design. A plusher heel, reflective heel panel, and streamlined tongue with single-side medial gusset.",
      price: 5990,
      discount: 0,
      brand: "Hoka",
      gender: "Men",
      category_id: 2, // Sports1
      images: JSON.stringify([
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1741704615/9991-HKE1127895BL005009-1_nyhs84.jpg",
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1741704640/9991-HKE1127895BL005009-2_dlbt8w.jpg",
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1741704647/9991-HKE1127895BL005009-3_gmjgau.jpg",
      ]),
      sizes: menSizes.map((size) => ({
        size_id: size.id,
        stock_quantity: Math.floor(Math.random() * 20) + 10,
      })),
    },
    {
      productname: "Hoka Bondi 8 men's running shoes - slate/barley",
      description:
        "Everyday Run, Walking, Comfort. Engineered mesh construction, Recycled content lining mesh. Ortholite® hybrid sockliner, Lightweight, resilient foam, Zonal rubber placement for weight savings, Partially gusseted tongue, Heel pull tab, Durabrasion rubber outsole",
      price: 6490,
      discount: 0,
      brand: "Hoka",
      gender: "Men",
      category_id: 2, // Sports2
      images: JSON.stringify([
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1741704790/9991-HKE1123202SBOLI007-1_faoor7.jpg",
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1741704812/9991-HKE1123202SBOLI007-2_dqixuh.jpg",
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1741704817/9991-HKE1123202SBOLI007-3_gimo75.jpg",
      ]),
      sizes: menSizes.map((size) => ({
        size_id: size.id,
        stock_quantity: Math.floor(Math.random() * 20) + 10,
      })),
    },
    {
      productname: "Under armour phantom 1 unisex running shoes - white",
      description:
        "The Under Armour Phantom 1 Unisex Running Shoes in White offer a sleek, sock-like fit with a knit upper for breathability. Featuring responsive cushioning, a molded heel for support, and a durable rubber outsole, they provide comfort and performance for everyday runs.",
      price: 4690,
      discount: 0,
      brand: "Under Armour",
      gender: "Men",
      category_id: 2, // Sports3
      images: JSON.stringify([
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1741704989/9991-UAS28384-11000W009-1_fal9ri.jpg",
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1741705001/9991-UAS28384-11000W009-3_zqrtvn.jpg",
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1741705019/9991-UAS28384-11000W009-4_t3ytsa.jpg",
      ]),
      sizes: menSizes.map((size) => ({
        size_id: size.id,
        stock_quantity: Math.floor(Math.random() * 20) + 10,
      })),
    },
    {
      productname: "On running cloud 5 men's running shoes - white",
      description:
        "The On Running Cloud 5 Men's Running Shoes in White feature a lightweight, breathable mesh upper with CloudTec® cushioning for soft landings and smooth transitions. The speed-lacing system ensures a secure fit, while the durable outsole provides excellent grip for all-day comfort.",
      price: 5990,
      discount: 0,
      brand: "On",
      gender: "Men",
      category_id: 2, // Sports4
      images: JSON.stringify([
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1741705179/9991-ONR599891800W010-1_twbsua.jpg",
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1741705186/9991-ONR599891800W010-3_iiuhwm.jpg",
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1741705200/9991-ONR599891800W010-4_sm142y.jpg",
      ]),
      sizes: menSizes.map((size) => ({
        size_id: size.id,
        stock_quantity: Math.floor(Math.random() * 20) + 10,
      })),
    },
    {
      productname: "Mr530 men's running shoes - white with natural indigo",
      description:
        "Inspired by our classic running shoes, the design is a throwback to the 1990s-2000s, especially the unique ABZORB® footbed. Each version has a breathable mesh upper for freshness and comfort.",
      price: 3900,
      discount: 0,
      brand: "New Balance",
      gender: "Men",
      category_id: 2, // Sports5
      images: JSON.stringify([
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1741705410/9991-NEWMR530SGD00W005-1_ayvgd6.jpg",
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1741705425/9991-NEWMR530SGD00W005-2_fhm0gk.jpg",
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1741705432/9991-NEWMR530SGD00W005-3_wphstx.jpg",
      ]),
      sizes: menSizes.map((size) => ({
        size_id: size.id,
        stock_quantity: Math.floor(Math.random() * 20) + 10,
      })),
    },
    {
      productname: "Hoka clifton 9 men's running shoes - wheat/shifting sand",
      description:
        "Lightweight & Cushioned: The Clifton 9 is designed with an updated midsole foam that enhances responsiveness while maintaining a plush feel.",
      price: 5990,
      discount: 0,
      brand: "Hoka",
      gender: "Men",
      category_id: 2, // Sports6
      images: JSON.stringify([
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1741705603/9991-HKE1127895WH0CM009-1_bnu9xq.jpg",
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1741705608/9991-HKE1127895WH0CM009-3_efablh.jpg",
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1741705624/9991-HKE1127895WH0CM009-4_h4vt9q.jpg",
      ]),
      sizes: menSizes.map((size) => ({
        size_id: size.id,
        stock_quantity: Math.floor(Math.random() * 20) + 10,
      })),
    },
    {
      productname: "Hoka clifton 9 men'srunning shoes - white/white",
      description:
        "Lighter and more cushioned than ever before. Eliminating weight while adding 3mm in stack height, a revitalized underfoot experience with a responsive new foam and improved outsole design. A plusher heel, reflective heel panel, and streamlined tongue with single-side medial gusset.",
      price: 5990,
      discount: 0,
      brand: "Hoka",
      gender: "Men",
      category_id: 2, // Sports7
      images: JSON.stringify([
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1741705765/9991-HKE1127895WW00W007-1_saqzhm.jpg",
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1741705774/9991-HKE1127895WW00W007-2_utxvzh.jpg",
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1741705798/9991-HKE1127895WW00W007-3_er2ahh.jpg",
      ]),
      sizes: menSizes.map((size) => ({
        size_id: size.id,
        stock_quantity: Math.floor(Math.random() * 20) + 10,
      })),
    },
    {
      productname: "Hoka kawana 2 men's running shoes - slate/forest cover",
      description:
        "The HOKA Kawana 2 is a versatile running shoe designed to provide a balanced and responsive experience for daily training and gym workouts.",
      price: 5390,
      discount: 0,
      brand: "Hoka",
      gender: "Men",
      category_id: 2, // Sports8
      images: JSON.stringify([
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1741706111/9991-HKE1147930SCOLI007-1_pnspyx.jpg",
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1741706124/9991-HKE1147930SCOLI007-3_zmhemu.jpg",
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1741706129/9991-HKE1147930SCOLI007-5_zdbhzl.jpg",
      ]),
      sizes: menSizes.map((size) => ({
        size_id: size.id,
        stock_quantity: Math.floor(Math.random() * 20) + 10,
      })),
    },

    // Men's sandal
    {
      productname: "Classic crush clog - white",
      description:
        "For a fresh new take on your favorite clog, look to the Classic Crush Clog. Featuring added height and a bold design, this dynamic new clog offers many personalization options, with Jibbitz holes on the upper and the pivoting backstrap. The Crocs comfort you love, plus an extra dose of height, attitude, and style.",
      price: 2890,
      discount: 0,
      brand: "Crocs",
      gender: "Men",
      category_id: 3, // Sandal1
      images: JSON.stringify([
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1741706325/9991-CCR20752110000WM3W-1_yjjqrf.jpg",
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1741706340/9991-CCR20752110000WM3W-3_fzaswh.jpg",
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1741706346/9991-CCR20752110000WM3W-4_pwe3qt.jpg",
      ]),
      sizes: menSizes.map((size) => ({
        size_id: size.id,
        stock_quantity: Math.floor(Math.random() * 20) + 10,
      })),
    },
    {
      productname: "crocs echo ombre clog stk unisex sandals - shitake",
      description:
        "Classic Clog gets a seriously eye-catching makeover. Introducing the Classic Mega Crush Clog, featuring an enhanced rubber tread, updated detailing around the outsole, and a color dipped platform ready to take any outfit to the next level. Even better, the backstrap and upper are built to be personalized with Jibbitz™ charms. Are you ready for your new cru",
      price: 4590,
      discount: 0,
      brand: "Crocs",
      gender: "Men",
      category_id: 3, // Sandal2
      images: JSON.stringify([
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1741706462/9991-CCR2099092DS00GM0W-1_vpecmh.jpg",
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1741706473/9991-CCR2099092DS00GM0W-2_pfih1v.jpg",
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1741706479/9991-CCR2099092DS00GM0W-3_zw3ob9.jpg",
      ]),
      sizes: menSizes.map((size) => ({
        size_id: size.id,
        stock_quantity: Math.floor(Math.random() * 20) + 10,
      })),
    },
    {
      productname: "Hoka hopara unisex walking shoes - black/castlerock",
      description:
        "Easily navigates wet and dry terrain alike. Providing secure lockdown with a synthetic upper, neoprene collar and quick-lace system, the Hopara’s strategic cutouts ensure ample drainage. Cushioned with an EVA midsole, this versatile water sandal is finished with a sticky rubber outsole and rubberized toe cap",
      price: 4990,
      discount: 0,
      brand: "Hoka",
      gender: "Men",
      category_id: 3, // Sandal3
      images: JSON.stringify([
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1741706769/9991-HKE1123112BC005010-1_dgqzs6.jpg",
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1741706788/9991-HKE1123112BC005010-3_or5f14.jpg",
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1741706792/9991-HKE1123112BC005010-6_lpkwfz.jpg",
      ]),
      sizes: menSizes.map((size) => ({
        size_id: size.id,
        stock_quantity: Math.floor(Math.random() * 20) + 10,
      })),
    },
    {
      productname: "Classic unisex clog - bone",
      description:
        "It is the iconic clog that started a comfort revolution around the world! The irreverent go-to comfort shoe that you're sure to fall deeper in love with day after day. Crocs Classic Clogs offer lightweight Iconic Crocs Comfort™, a color for every personality, and an ongoing invitation to be comfortable in your own shoes.",
      price: 2190,
      discount: 0.5,
      brand: "Crocs",
      gender: "Men",
      category_id: 3, // Sandal4
      images: JSON.stringify([
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1741706616/9991-CCR10001-2Y2GREM3W-1_idjdkp.jpg",
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1741706637/9991-CCR10001-2Y2GREM3W-3_prmb6t.jpg",
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1741706661/9991-CCR10001-2Y2GREM3W-4_yfm6ft.jpg",
      ]),
      sizes: menSizes.map((size) => ({
        size_id: size.id,
        stock_quantity: Math.floor(Math.random() * 20) + 10,
      })),
    },
    {
      productname: "Calm men's sandals - black",
      description:
        "The Calm Men's Sandals in Black offer a sleek, minimalist design with a soft, cushioned footbed for all-day comfort. Featuring a lightweight, durable sole and an easy slip-on style, they’re perfect for casual wear and relaxation.",
      price: 3000,
      discount: 0,
      brand: "Nike",
      gender: "Men",
      category_id: 3, // Sandal5
      images: JSON.stringify([
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1741707037/9991-NIKFJ6044001005006-1_qlsu19.jpg",
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1741707074/9991-NIKFJ6044001005006-2_ptldad.jpg",
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1741707078/9991-NIKFJ6044001005006-3_pvqzqb.jpg",
      ]),
      sizes: menSizes.map((size) => ({
        size_id: size.id,
        stock_quantity: Math.floor(Math.random() * 20) + 10,
      })),
    },

    // Men"s Slipper
    {
      productname: "Calm men's sandals - sail",
      description:
        "When it comes to these slides, it's all in the name. Take a deep breath and slip into a minimalist look with maximalist cushioning. Contoured foam is seamlessly created from one piece, and cradles your feet to help keep them in place. To top it off, the water-friendly design dries quickly—making it ideal for relaxing poolside. You get all of the style, none of the effort. It's time for some Calm.",
      price: 1800,
      discount: 0,
      brand: "Nike",
      gender: "Men",
      category_id: 4, // slipper1
      images: JSON.stringify([
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1741707209/9991-NIKFD4116100IVO006-1_ajevyw.jpg",
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1741707219/9991-NIKFD4116100IVO006-2_faqmce.jpg",
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1741707224/9991-NIKFD4116100IVO006-3_ytxkmk.jpg",
      ]),
      sizes: menSizes.map((size) => ({
        size_id: size.id,
        stock_quantity: Math.floor(Math.random() * 20) + 10,
      })),
    },
    {
      productname: "Victori one men's sandals - black",
      description:
        "From the beach to the bleachers, the Victori One is a must-have slide for everyday activities. Subtle yet substantial updates like a wider strap and softer foam make lounging easy. Go ahead—enjoy endless comfort for your feet.",
      price: 1890,
      discount: 0,
      brand: "Nike",
      gender: "Men",
      category_id: 4, // slipper2
      images: JSON.stringify([
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1741707337/9991-NIKCN9675002000013-1_m1putm.jpg",
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1741707349/9991-NIKCN9675002000013-2_cw6ltg.jpg",
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1741707354/9991-NIKCN9675002000013-3_ecl7j1.jpg",
      ]),
      sizes: menSizes.map((size) => ({
        size_id: size.id,
        stock_quantity: Math.floor(Math.random() * 20) + 10,
      })),
    },
    {
      productname: "Adifom superstar mule men's slides - wonder beige",
      description:
        "Stride into style with the Adifom Superstar Mule Low Slides. Ideal for a laid-back lifestyle, these regular fit slides are a unique blend of classic and contemporary, featuring a camo-inspired colour mix. Crafted entirely from lightweight and comfortable adifom material, these slides deliver both visual appeal and tangible comfort — truly representative of the iconic Superstar franchise.",
      price: 2800,
      discount: 0,
      brand: "Adidas",
      gender: "Men",
      category_id: 4, // slipper3
      images: JSON.stringify([
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1741707519/9991-ADIIE9083GRE006-1_nzb0pj.jpg",
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1741707527/9991-ADIIE9083GRE006-3_sioccu.jpg",
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1741707531/9991-ADIIE9083GRE006-4_vfgrxi.jpg",
      ]),
      sizes: menSizes.map((size) => ({
        size_id: size.id,
        stock_quantity: Math.floor(Math.random() * 20) + 10,
      })),
    },
    {
      productname: "Adicane slide unisex sandals - sand strata",
      description:
        "Take casual chic anywhere and everywhere in these adidas slides. Featuring a simple, sophisticated design, they have an easy-wearing synthetic upper. The moulded footbed provides all-day comfort on the boardwalk or at the beach.",
      price: 1800,
      discount: 0,
      brand: "Adidas",
      gender: "Men",
      category_id: 4, // slipper4
      images: JSON.stringify([
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1741707640/9991-ADIHP9415018009-1_vub3g9.jpg",
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1741707650/9991-ADIHP9415018009-2_ic9dpr.jpg",
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1741707656/9991-ADIHP9415018009-3_udpqcg.jpg",
      ]),
      sizes: menSizes.map((size) => ({
        size_id: size.id,
        stock_quantity: Math.floor(Math.random() * 20) + 10,
      })),
    },
    // Women's Sneakers
    {
      productname: "530 unisex sneakers shoes - white/blue",
      description:
        "A throwback to a New Balance classic, these running shoes combine 2000s' style with modern technology.",
      price: 3900,
      discount: 0.3,
      brand: "New Balance",
      gender: "Women",
      category_id: 1, // Sneakers1
      images: JSON.stringify([
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1741747394/9991-NEWMR530RA00W009-1_rx3pzx.jpg",
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1741747405/9991-NEWMR530RA00W009-2_defmag.jpg",
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1741747411/9991-NEWMR530RA00W009-3_lj1zj2.jpg",
      ]),
      sizes: womenSizes.map((size) => ({
        size_id: size.id,
        stock_quantity: Math.floor(Math.random() * 20) + 10,
      })),
    },
    {
      productname: "New balance 530 unisex sneaker shoe - olive/grey",
      description:
        "The 530 men’s sneaker is a throwback of one of our classic running shoes. This casual kick combines everyday style with modern tech. ABZORB cushioning underfoot adds superior comfort. Put a retro spin on your step with the 530 men’s sneaker.",
      price: 3900,
      discount: 0,
      brand: "New Balance",
      gender: "Women",
      category_id: 1, // Sneakers2
      images: JSON.stringify([
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1741747598/9991-NEWMR530GADGN009-1_fbn33b.jpg",
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1741747608/9991-NEWMR530GADGN009-2_wywyz7.jpg",
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1741747615/9991-NEWMR530GADGN009-3_g6d6hv.jpg",
      ]),
      sizes: womenSizes.map((size) => ({
        size_id: size.id,
        stock_quantity: Math.floor(Math.random() * 20) + 10,
      })),
    },
    {
      productname: "Zoom vomero 5 women's sneakers shoes - vast grey",
      description:
        "Nike Zoom Vomero 5 Women's Sneakers Shoes - Vast Grey. There may be a 1-2cm difference in measurements depending on the development and manufacturing process.",
      price: 6300,
      discount: 0,
      brand: "Nike",
      gender: "Women",
      category_id: 1, // Sneakers3
      images: JSON.stringify([
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1741748180/9991-NIKHV6417001GRE006-1_diasfz.jpg",
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1741748190/9991-NIKHV6417001GRE006-2_rnfhys.jpg",
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1741748195/9991-NIKHV6417001GRE006-3_zmo1lt.jpg",
      ]),
      sizes: womenSizes.map((size) => ({
        size_id: size.id,
        stock_quantity: Math.floor(Math.random() * 20) + 10,
      })),
    },
    {
      productname: "Cortez women's sneakers shoes - sail",
      description:
        "Nike Cortez Women's Sneakers Shoes - Sail.There may be a 1-2cm difference in measurements depending on the development and manufacturing process.",
      price: 3600,
      discount: 0.4,
      brand: "Nike",
      gender: "Women",
      category_id: 1, // Sneakers4
      images: JSON.stringify([
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1741748641/9991-NIKHV6012161IVO006-1_nbabw7.jpg",
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1741748610/9991-NIKHV6012161IVO006-3_cuajyg.jpg",
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1741748562/9991-NIKHV6012161IVO006-5_hzgaiw.jpg",
      ]),
      sizes: womenSizes.map((size) => ({
        size_id: size.id,
        stock_quantity: Math.floor(Math.random() * 20) + 10,
      })),
    },
    {
      productname:
        "Lacoste carnaby pro leather tricolour trainers women's sneakers shoes - white",
      description:
        "Catch the court spirit with this casual sneaker. Inspired by tennis heritage. Enhanced with iconic Lacoste branding. A timeless finish to any outfit.Leather and synthetic uppersExposed stitches to the sideSynthetic linings Rubber outsoleLacoste branding to the tongue and heel",
      price: 3790,
      discount: 0,
      brand: "Lacoste",
      gender: "Women",
      category_id: 1, // Sneakers5
      images: JSON.stringify([
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1741749042/9991-LAC45SFA0084407005-1_glxjv4.jpg",
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1741749051/9991-LAC45SFA0084407005-4_almxva.jpg",
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1741749056/9991-LAC45SFA0084407005-5_jhindw.jpg",
      ]),
      sizes: womenSizes.map((size) => ({
        size_id: size.id,
        stock_quantity: Math.floor(Math.random() * 20) + 10,
      })),
    },
    {
      productname:
        "Lacoste t-clip tricolour leather and suede trainers women's sneakers shoes - women",
      description:
        "True 80s styling gets an update in the T-Clip, an archive-inspired court shoe with urban appeal and a Sideline silhouette. Made from soft, hand-feel nappa leather and elevated with a pigmented finish, uppers are layered with suede hits and paired with a retro gum outsole. The crocodile is embroidered in green on the quarter while debossed branding on the heel completes an old school Lacoste look.Leather and suede uppersRubber outsoleTextile linings, embroidered green crocodile branding at the quarter and a gum outsole enhances the retro look and feel",
      price: 3950,
      discount: 0,
      brand: "Lacoste",
      gender: "Women",
      category_id: 1, // Sneakers6
      images: JSON.stringify([
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1741749376/9991-LAC40SFA0043407005-1_hr76zq.jpg",
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1741749384/9991-LAC40SFA0043407005-2_rxunsk.jpg",
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1741749411/9991-LAC40SFA0043407005-3_zmgo0o.jpg",
      ]),
      sizes: womenSizes.map((size) => ({
        size_id: size.id,
        stock_quantity: Math.floor(Math.random() * 20) + 10,
      })),
    },
    {
      productname:
        "Asics gel-1090v2 women's sneakers shoes - cream/cement grey",
      description:
        "The GEL-1090 V2 sneaker from the IMPERFECTION Pack is inspired by the idea of celebrating imperfection. It's designed with visible foam and cracked leather details that resemble how clay pots age over time. Similar to the motion of a waving checkered flag, sweeping lines appear along the midsole. Meanwhile, the heel is layered with GEL technology to improve comfort.",
      price: 4200,
      discount: 0.1,
      brand: "Asics",
      gender: "Women",
      category_id: 1, // Sneakers7
      images: JSON.stringify([
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1741749577/9991-ASI22A4801010CM008-1_zmptnj.jpg",
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1741749584/9991-ASI22A4801010CM008-2_bbuvy0.jpg",
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1741749602/9991-ASI22A4801010CM008-3_oo5a8b.jpg",
      ]),
      sizes: womenSizes.map((size) => ({
        size_id: size.id,
        stock_quantity: Math.floor(Math.random() * 20) + 10,
      })),
    },
    {
      productname: "Asics gel-nyc unisex sneakers shoes - smoke grey",
      description:
        "Its upper construction references the GEL-NIMBUS™ 3 shoe from the early 2000s and blends it with various embellishments from the GEL-MC PLUS™ V design. The tooling contrasts the upper's retro influences by using the GEL-CUMULUS™ 16 shoe's tooling system. Through a combination of lightweight foams and GEL™ technology inserts, this midsole formation helps create advanced underfoot comfort.",
      price: 4700,
      discount: 0,
      brand: "Asics",
      gender: "Women",
      category_id: 1, // Sneakers8
      images: JSON.stringify([
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1741749728/9991-ASI23A383023GRE008-1_dgwomg.jpg",
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1741749735/9991-ASI23A383023GRE008-2_jubrdj.jpg",
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1741749766/9991-ASI23A383023GRE008-3_fmafmd.jpg",
      ]),
      sizes: womenSizes.map((size) => ({
        size_id: size.id,
        stock_quantity: Math.floor(Math.random() * 20) + 10,
      })),
    },

    // Women's Sports
    {
      productname:
        "Hoka clifton l suede unisex running shoes - oat milk/bellwether blue",
      description:
        "Hoka Clifton L Suede Unisex Running Shoes. There may be a 1-2cm difference in measurements depending on the development and manufacturing process.",
      price: 6490,
      discount: 0.4,
      brand: "Hoka",
      gender: "Women",
      category_id: 2, // Sports1
      images: JSON.stringify([
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1741749991/9991-HKE1122571OT0CM008-1_h2nmuy.jpg",
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1741750000/9991-HKE1122571OT0CM008-2_m9bpq5.jpg",
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1741750006/9991-HKE1122571OT0CM008-3_hie3ig.jpg",
      ]),
      sizes: womenSizes.map((size) => ({
        size_id: size.id,
        stock_quantity: Math.floor(Math.random() * 20) + 10,
      })),
    },
    {
      productname: "Hoka speedgoat 5 women's running shoes - cream/sandstone",
      description:
        "Trail Running and Hiking. Double layer jacquard engineered mesh, Protective toe rand, Late stage Meta-Rocker, Vibram Megagrip with Traction Lug, Lay-flat gusseted tongue, Bolstered heel collar, Molded EVA sockliner, Compression-molded foam midsole",
      price: 5990,
      discount: 0.2,
      brand: "Hoka",
      gender: "Women",
      category_id: 2, // Sports2
      images: JSON.stringify([
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1741750169/9991-HKE1123158CR0CM006-1_kfswf8.jpg",
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1741750188/9991-HKE1123158CR0CM006-2_xykanl.jpg",
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1741750205/9991-HKE1123158CR0CM006-4_fi9199.jpg",
      ]),
      sizes: womenSizes.map((size) => ({
        size_id: size.id,
        stock_quantity: Math.floor(Math.random() * 20) + 10,
      })),
    },
    {
      productname:
        "New balance fresh foam x 1080v13 women's running shoes - brown",
      description:
        "If we only made one running shoe, it would be the Fresh Foam X 1080. The unique combination of reliable comfort and high performance offers versatility that spans everyday to race day. The Fresh Foam X midsole cushioning is built for smooth transitions from landing to push-off, while a second-skin style mesh upper is breathable and supportive.",
      price: 5900,
      discount: 0,
      brand: "New Balance",
      gender: "Women",
      category_id: 2, // Sports3
      images: JSON.stringify([
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1741750749/9991-NEWW1080N13700008-1_ivj8yh.jpg",
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1741750743/9991-NEWW1080N13700008-3_b56uz7.jpg",
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1741750607/9991-NEWW1080N13700008-2_lfqdus.jpg",
      ]),
      sizes: womenSizes.map((size) => ({
        size_id: size.id,
        stock_quantity: Math.floor(Math.random() * 20) + 10,
      })),
    },
    {
      productname: "Cortez women's running shoes - yellow ochre",
      description:
        "NIKE CORTEZ. There may be a 1-2cm difference in measurements depending on the development and manufacturing process",
      price: 3400,
      discount: 0,
      brand: "Nike",
      gender: "Women",
      category_id: 2, // Sports4
      images: JSON.stringify([
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1741751150/9991-NIKDZ279570200Y007-1_uogwck.jpg",
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1741751156/9991-NIKDZ279570200Y007-2_vbqybt.jpg",
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1741751169/9991-NIKDZ279570200Y007-3_zmhcjk.jpg",
      ]),
      sizes: womenSizes.map((size) => ({
        size_id: size.id,
        stock_quantity: Math.floor(Math.random() * 20) + 10,
      })),
    },
    {
      productname: "Under armour phantom 1 unisex running shoes - white",
      description:
        "Phantom 1, there may be a 1-2cm difference in measurements depending on the development and manufacturing process.",
      price: 4690,
      discount: 0,
      brand: "Under Armour",
      gender: "Women",
      category_id: 2, // Sports5
      images: JSON.stringify([
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1741751424/9991-UAS28384-11000W009-1_evwvqi.jpg",
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1741751431/9991-UAS28384-11000W009-1_pmsetv.jpg",
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1741751436/9991-UAS28384-11000W009-2_l3xrwx.jpg",
      ]),
      sizes: womenSizes.map((size) => ({
        size_id: size.id,
        stock_quantity: Math.floor(Math.random() * 20) + 10,
      })),
    },
    {
      productname: "Hoka kawana 2 women's running shoes - white/nimbus cloud",
      description:
        "An accessible trainer that delivers a well-balanced ride, the Kawana 2 has been fine-tuned with a single_x005F_x0002_layer mesh upper, sock-like bootie, and eye row gillies for enhanced foot lockdown. Geared for lateral side-to-side movement, this go_x005F_x0002_to trainer easily shifts from street to studio with a speckled regrind midsole and gum rubber outsole.",
      price: 5390,
      discount: 0,
      brand: "Hoka",
      gender: "Women",
      category_id: 2, // Sports6
      images: JSON.stringify([
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1741751561/9991-HKE1147913WN00W008-1_hhp2xz.jpg",
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1741751566/9991-HKE1147913WN00W008-2_zasz1u.jpg",
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1741751572/9991-HKE1147913WN00W008-3_jqrftl.jpg",
      ]),
      sizes: womenSizes.map((size) => ({
        size_id: size.id,
        stock_quantity: Math.floor(Math.random() * 20) + 10,
      })),
    },
    {
      productname: "Hoka clifton 9 women's running shoes - sandstone/cream",
      description:
        "The ninth iteration of our award-winning Clifton franchise has launched, lighter and more cushioned than ever before. Eliminating weight while adding 3mm in stack height, the new Clifton 9 delivers a revitalized underfoot experience with a responsive new foam and improved outsole design. Removing overlays and hotmelts, the stripped back upper has been consciously crafted with a plusher heel, reflective heel panel, and streamlined tongue with single-side medial gusset",
      price: 5990,
      discount: 0,
      brand: "Hoka",
      gender: "Women",
      category_id: 2, // Sports7
      images: JSON.stringify([
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1741751922/9991-HKE1127896SN0CM006-1_jdlewp.jpg",
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1741751925/9991-HKE1127896SN0CM006-2_yuftdy.jpg",
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1741751972/9991-HKE1127896SN0CM006-3_mn3spu.jpg",
      ]),
      sizes: womenSizes.map((size) => ({
        size_id: size.id,
        stock_quantity: Math.floor(Math.random() * 20) + 10,
      })),
    },
    {
      productname: "Hoka bondi 8 women's running shoes - ether/illusion",
      description:
        "Everyday Run, Walking, Comfort. Engineered mesh construction, Recycled content lining mesh. Ortholite® hybrid sockliner, Lightweight, resilient foam, Zonal rubber placement for weight savings, Partially gusseted tongue, Heel pull tab, Durabrasion rubber outsole",
      price: 8990,
      discount: 0.5,
      brand: "Hoka",
      gender: "Women",
      category_id: 2, // Sports8
      images: JSON.stringify([
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1741752318/9991-HKE1127952EH12W006-1_kiy9hr.jpg",
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1741752359/9991-HKE1127952EH12W006-2_ajyjvl.jpg",
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1741752369/9991-HKE1127952EH12W006-3_hdllby.jpg",
      ]),
      sizes: womenSizes.map((size) => ({
        size_id: size.id,
        stock_quantity: Math.floor(Math.random() * 20) + 10,
      })),
    },

    // Women's Sandals
    {
      productname: "Crocs despicable me classic unisex clog - black",
      description:
        "Bello! The Minions Classic Clog is designed to look like your favorite yellow character, complete with printed denim overalls. The ankle strap features an eyeball with goggles, to top off the essential Minions look. Minions logos adorn the rivet and heel, while the entire design is supported by the iconic comfort of Crocs.",
      price: 2890,
      discount: 0,
      brand: "Crocs",
      gender: "Women",
      category_id: 3, // Sandals1
      images: JSON.stringify([
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1741752579/9991-CCR209477001005M8W-1_nkxyy3.jpg",
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1741752591/9991-CCR209477001005M8W-2_zdicjt.jpg",
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1741752603/9991-CCR209477001005M8W-3_jibxqu.jpg",
      ]),
      sizes: womenSizes.map((size) => ({
        size_id: size.id,
        stock_quantity: Math.floor(Math.random() * 20) + 10,
      })),
    },
    {
      productname: "Wednesday stomp unisex clog - black",
      description:
        "The Wednesday Stomp Clog is the next big Thing with an exaggerated platform sole and glossy upper. A molded white collar detail and dome studded ankle strap make for a style that’s gothic and glamourous. Exclusive Jibbitz feature dimensional charms like Thing and Wednesday’s iconic black cello, perfect for any Wednesday fan.",
      price: 3690,
      discount: 0,
      brand: "Crocs",
      gender: "Women",
      category_id: 3, // Sandals2
      images: JSON.stringify([
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1741752848/9991-CCR210214001005M3W-1_jv0kui.jpg",
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1741752866/9991-CCR210214001005M3W-2_jpvmbg.jpg",
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1741752897/9991-CCR210214001005M3W-3_on9isz.jpg",
      ]),
      sizes: womenSizes.map((size) => ({
        size_id: size.id,
        stock_quantity: Math.floor(Math.random() * 20) + 10,
      })),
    },
    {
      productname: "Classic floral cut out clog unisex - chalk",
      description:
        "Introducing our new and improved Classic Sandals Collection! Building on bold simplicity and versatility, we’ve updated the products’ most important aspects: the fit, feel, and look.The updated, modernized silhouettes now cup the whole foot in our Iconic Crocs Comfort™ allowing you to sink even more into whichever style you choose. And we didn’t forget about personalization. We kept the holes in each of our three sandals because Jibbitz™ charms allow you to put your personality on full display.",
      price: 2390,
      discount: 0,
      brand: "Crocs",
      gender: "Women",
      category_id: 3, // Sandals3
      images: JSON.stringify([
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1741753061/9991-CCR2109270WV018M3W-1_j8mmn4.jpg",
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1741753099/9991-CCR2109270WV018M3W-2_lmtur7.jpg",
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1741753115/9991-CCR2109270WV018M3W-3_kypdgo.jpg",
      ]),
      sizes: womenSizes.map((size) => ({
        size_id: size.id,
        stock_quantity: Math.floor(Math.random() * 20) + 10,
      })),
    },
    {
      productname: "Classic iridescent geo unisex clog - black",
      description:
        "A geometric molded design with iridescent finish provides extra style to this version of the iconic clog. The unique design and finish helps you show off your creative spirit, and Croslite™ foam construction keeps them light and easy to wear. Grounded in comfort, spiked with personality.",
      price: 2590,
      discount: 0,
      brand: "Crocs",
      gender: "Women",
      category_id: 3, // Sandals4
      images: JSON.stringify([
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1741753273/9991-CCR209841001005M3W-1_jj7lx5.jpg",
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1741753288/9991-CCR209841001005M3W-2_axyg1m.jpg",
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1741753327/9991-CCR209841001005M3W-3_puqvtf.jpg",
      ]),
      sizes: womenSizes.map((size) => ({
        size_id: size.id,
        stock_quantity: Math.floor(Math.random() * 20) + 10,
      })),
    },
    {
      productname: "Care bears unisex crush clog - white",
      description:
        "Feeling like walking on sunshine? The new Care Bears Crush Clog delivers a rainbow of comfort and style. This limited-edition silhouette features a printed colorful gradient on the upper, complemented with soft plush Jibbitz™ charms. The unique rainbow and cloud heel strap pivots for added stability and comfort wherever your daydreams take you.",
      price: 3590,
      discount: 0,
      brand: "Crocs",
      gender: "Women",
      category_id: 3, // Sandals5
      images: JSON.stringify([
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1741753455/9991-CCR21010310000WM4W-1_fh4ril.jpg",
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1741753465/9991-CCR21010310000WM4W-2_brlxuz.jpg",
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1741753483/9991-CCR21010310000WM4W-3_n1wvne.jpg",
      ]),
      sizes: womenSizes.map((size) => ({
        size_id: size.id,
        stock_quantity: Math.floor(Math.random() * 20) + 10,
      })),
    },

    // Women's Slippers
    {
      productname: "Adidas adifom stan mule women's sandals - clear pink",
      description:
        "Unveiling the Adifom Stan Mule Shoes, a stylish addition for women seeking a blend of comfort and originality. A delightful nod to Stan Smith, these sandals feature a clean synthetic upper and unique heel moustache detail, while bold proportions cater perfectly to the Gen Z mindset. With no closure design and eco-friendly foam material derived from sugar cane, it's easy to express creativity throughout the summer in these comfortable and distinctive mules.",
      price: 2500,
      discount: 0,
      brand: "Adidas",
      gender: "Women",
      category_id: 4, // Slippers1
      images: JSON.stringify([
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1741754364/9991-ADIIE04800PK009-1_ckqpqx.jpg",
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1741754368/9991-ADIIE04800PK009-2_mw9v9j.jpg",
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1741754443/9991-ADIIE04800PK009-3_bywpva.jpg",
      ]),
      sizes: womenSizes.map((size) => ({
        size_id: size.id,
        stock_quantity: Math.floor(Math.random() * 20) + 10,
      })),
    },
    {
      productname: "Rivalry mule women's slides - cloud white",
      description:
        "Introducing the Rivalry Mule Shoes, a fresh take on an '80s classic for the modern woman. Crafted from premium suede with a rubber outsole, these shoes offer both style and durability. The sleek design features a microsuede lining and platform EVA cupsole, providing comfort for everyday wear. Ideal for those seeking a casual yet chic look. Slip into effortless style with these mules.",
      price: 3500,
      discount: 0,
      brand: "Adidas",
      gender: "Women",
      category_id: 4, // Slippers2
      images: JSON.stringify([
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1741754569/9991-ADIIG223200W006-1_by1ytr.jpg",
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1741754575/9991-ADIIG223200W006-2_ulx309.jpg",
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1741754598/9991-ADIIG223200W006-3_kdjeki.jpg",
      ]),
      sizes: womenSizes.map((size) => ({
        size_id: size.id,
        stock_quantity: Math.floor(Math.random() * 20) + 10,
      })),
    },
    {
      productname: "Rivalry mule women's slides - core black",
      description:
        "Introducing the Rivalry Mule Shoes, a fresh take on an '80s classic for the modern woman. Crafted from premium suede with a rubber outsole, these shoes offer both style and durability. The sleek design features a microsuede lining and platform EVA cupsole, providing comfort for everyday wear. Ideal for those seeking a casual yet chic look. Slip into effortless style with these mules.",
      price: 3500,
      discount: 0,
      brand: "Adidas",
      gender: "Women",
      category_id: 4, // Slippers3
      images: JSON.stringify([
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1741754727/9991-ADIIF4651005006-1_qslllq.jpg",
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1741754738/9991-ADIIF4651005006-2_gfkwqz.jpg",
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1741754745/9991-ADIIF4651005006-3_ggrjtz.jpg",
      ]),
      sizes: womenSizes.map((size) => ({
        size_id: size.id,
        stock_quantity: Math.floor(Math.random() * 20) + 10,
      })),
    },
    {
      productname: "Gazelle beach women's slides - red",
      description:
        "Introducing the Gazelle Beach Slides, a woman's summer essential inspired by the iconic Terrace model Gazelle. These slides, made with synthetic and textile materials, offer a comfortable, everyday wear model with a light and soft EVA construction. The soft synthetic suede upper, in Terrace-inspired and fun colours, stays true to the Gazelle identity. Enjoy an authentic summer seasonality angle with these trendy, sport-inspired slides.",
      price: 2000,
      discount: 0,
      brand: "Adidas",
      gender: "Women",
      category_id: 4, // Slippers4
      images: JSON.stringify([
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1741754866/9991-ADIJQ742400R004-1_tsqa7v.jpg",
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1741754885/9991-ADIJQ742400R004-2_qpsrwa.jpg",
        "https://res.cloudinary.com/dfmqmyop1/image/upload/v1741754900/9991-ADIJQ742400R004-3_naomh9.jpg",
      ]),
      sizes: womenSizes.map((size) => ({
        size_id: size.id,
        stock_quantity: Math.floor(Math.random() * 20) + 10,
      })),
    },
  ];
  // Create products and their stock entries
  const createdProducts = [];
  for (const productData of products) {
    const { sizes, ...productInfo } = productData;
    const product = await prisma.product.create({
      data: productInfo,
    });
    createdProducts.push(product);

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

  // --------------------------
  // Create Users and Addresses
  // --------------------------

  const users = [
    {
      clerkID: "user_2PGBXqmTJelAGJEaOu3cNqFvNCT",
      username: "admin",
      firstname: "Admin",
      lastname: "User",
      email: "admin@shoestore.com",
      phone: "0812345678",
      role: "Admin",
      address: {
        homenum: "123/456",
        subdistrict: "Chatuchak",
        district: "Chatuchak",
        province: "Bangkok",
        postcode: 10900,
        phone: "0812345678",
      },
    },
    {
      clerkID: "user_2PGT4zLDoiB7DpxRmi7zowQY9WU",
      username: "johndoe",
      firstname: "John",
      lastname: "Doe",
      email: "john.doe@example.com",
      phone: "0823456789",
      role: "Customer",
      address: {
        homenum: "789/12",
        subdistrict: "Bang Rak",
        district: "Bang Rak",
        province: "Bangkok",
        postcode: 10500,
        phone: "0823456789",
      },
    },
    {
      clerkID: "user_2PHTpALg8j3RPcj7W1b1M19VC8x",
      username: "janesmith",
      firstname: "Jane",
      lastname: "Smith",
      email: "jane.smith@example.com",
      phone: "0834567890",
      role: "Customer",
      address: {
        homenum: "456/789",
        subdistrict: "Pathum Wan",
        district: "Pathum Wan",
        province: "Bangkok",
        postcode: 10330,
        phone: "0834567890",
      },
    },
    {
      clerkID: "user_2PILKbmnPqi9eoEQfHoMvf7aKNb",
      username: "bobwilliams",
      firstname: "Bob",
      lastname: "Williams",
      email: "bob.williams@example.com",
      phone: "0845678901",
      role: "Customer",
      address: {
        homenum: "321/654",
        subdistrict: "Watthana",
        district: "Watthana",
        province: "Bangkok",
        postcode: 10110,
        phone: "0845678901",
      },
    },
    {
      clerkID: "user_2PJcX9DcX1bEqZPdbrK8YlNEMzw",
      username: "sarahjohnson",
      firstname: "Sarah",
      lastname: "Johnson",
      email: "sarah.johnson@example.com",
      phone: "0856789012",
      role: "Customer",
      address: {
        homenum: "987/654",
        subdistrict: "Phra Khanong",
        district: "Khlong Toei",
        province: "Bangkok",
        postcode: 10110,
        phone: "0856789012",
      },
    },
  ];

  const createdUsers = [];
  for (const userData of users) {
    const { address, ...userInfo } = userData;

    // Create user
    const user = await prisma.user.create({
      data: userInfo,
    });

    // Create address for the user
    await prisma.address.create({
      data: {
        ...address,
        userId: user.id,
      },
    });

    createdUsers.push(user);
  }

  console.log("Users and addresses created");

  // --------------------------
// Create Carts and Cart Items
// --------------------------

// Create carts for 3 users (excluding admin)
const carts = [];
for (let i = 1; i < 4; i++) {
  const cart = await prisma.cart.create({
    data: {
      user_id: createdUsers[i].id,
    }
  });
  carts.push(cart);

  // Add 1-3 random products to each cart
  const numItems = Math.floor(Math.random() * 3) + 1;
  const selectedProducts = getRandomElements(createdProducts, numItems);

  for (const product of selectedProducts) {
    // Get a random size for the product's gender
    const availableSizes = product.gender === 'Men' ? menSizes : womenSizes;
    const randomSize = availableSizes[Math.floor(Math.random() * availableSizes.length)];

    await prisma.cart_Item.create({
      data: {
        quantity: Math.floor(Math.random() * 3) + 1,
        cart: {
          connect: { id: cart.id }
        },
        product: {
          connect: { id: product.id }
        },
        Size: {
          connect: { id: randomSize.id }
        }
      }
    });
  }
}
  console.log("Carts and cart items created");

  // --------------------------
  // Create Wishlists and Wishlist Items
  // --------------------------

  // Create wishlists for 3 users (excluding admin)
  const wishlists = [];
  for (let i = 1; i < 4; i++) {
    const wishlist = await prisma.wishlist.create({
      data: {
        user_id: createdUsers[i].id,
      },
    });
    wishlists.push(wishlist);

    // Add 2-4 random products to each wishlist
    const numItems = Math.floor(Math.random() * 3) + 2;
    const selectedProducts = getRandomElements(createdProducts, numItems);

    for (const product of selectedProducts) {
      await prisma.wishlist_Item.create({
        data: {
          wishlist_id: wishlist.id,
          product_id: product.id,
        },
      });
    }
  }

  console.log("Wishlists and wishlist items created");

  // --------------------------
  // Create Orders, Order Items, and Payments
  // --------------------------

  const orderStatuses = ["Pending", "Processing", "Shipped", "Delivered"];
  const shipmentStatuses = ["Pending", "Delivered"];
  const paymentStatuses = ["Unpaid", "Paid", "Cancel"];
  const paymentMethods = ["CreditCard", "Promptpay"];

  // Create 5 orders distributed among users
  for (let i = 0; i < 5; i++) {
    // Select a random user (excluding admin)
    const user = createdUsers[Math.floor(Math.random() * 4) + 1];

    // Create between 1-3 items for the order
    const numItems = Math.floor(Math.random() * 3) + 1;
    const orderItems = [];
    let totalAmount = 0;

    const selectedProducts = getRandomElements(createdProducts, numItems);

    for (const product of selectedProducts) {
      const quantity = Math.floor(Math.random() * 2) + 1;
      const price = product.price * (1 - (product.discount || 0));
      totalAmount += price * quantity;

      orderItems.push({
        product_id: product.id,
        quantity,
        price,
      });
    }

    // Randomly decide if the order is older (for delivered orders)
    const isOlderOrder = Math.random() > 0.5;
    const orderDate = isOlderOrder
      ? new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000) // Up to 60 days ago
      : new Date(); // Current date

    const shipmentStatus = isOlderOrder ? "Delivered" : "Pending";
    const paymentStatus = isOlderOrder
      ? "Paid"
      : Math.random() > 0.3
      ? "Paid"
      : "Unpaid";
    const orderStatus = isOlderOrder
      ? "Delivered"
      : orderStatuses[Math.floor(Math.random() * 3)];

    // Create the order
    const order = await prisma.order.create({
      data: {
        user_id: user.id,
        order_date: orderDate,
        updated_at: new Date(),
        total_amount: Math.round(totalAmount),
        status: orderStatus,
        shipment_status: shipmentStatus,
        payment_status: paymentStatus,
      },
    });

    // Create order items
    for (const item of orderItems) {
      await prisma.order_Item.create({
        data: {
          order_id: order.id,
          product_id: item.product_id,
          quantity: item.quantity,
          price: Math.round(item.price),
        },
      });
    }

    // Create payment if the order is paid
    if (paymentStatus === "Paid") {
      await prisma.payment.create({
        data: {
          order_id: order.id,
          payment_date: new Date(orderDate.getTime() + 1000 * 60 * 30), // 30 minutes after order
          paymentmethod:
            paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
          amount: Math.round(totalAmount),
          status: "Paid",
        },
      });
    } else if (paymentStatus === "Unpaid") {
      await prisma.payment.create({
        data: {
          order_id: order.id,
          payment_date: new Date(),
          paymentmethod:
            paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
          amount: Math.round(totalAmount),
          status: "Unpaid",
        },
      });
    }
  }

  console.log("Orders, order items, and payments created");

  // --------------------------
  // Create Reviews
  // --------------------------

  // Create 15 reviews distributed among products and users
  for (let i = 0; i < 15; i++) {
    const product =
      createdProducts[Math.floor(Math.random() * createdProducts.length)];
    const user = createdUsers[Math.floor(Math.random() * 4) + 1]; // Exclude admin

    const rating = Math.floor(Math.random() * 3) + 3; // Ratings between 3-5
    const comments = [
      "Great product, very comfortable!",
      "Love the design and quality.",
      "Perfect fit, will buy again.",
      "Very stylish and good quality.",
      "Comfortable for all-day wear.",
      "A bit expensive but worth it.",
      "Exactly as described, very happy with purchase.",
      "Fast delivery and excellent product.",
      "The color is slightly different from the picture, but still nice.",
      "Very happy with this purchase, highly recommend!",
    ];

    // Create a review from 1-30 days ago
    const reviewDate = new Date(
      Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
    );

    await prisma.review.create({
      data: {
        product_id: product.id,
        user_id: user.id,
        rating,
        comment: comments[Math.floor(Math.random() * comments.length)],
        review_date: reviewDate,
      },
    });
  }

  console.log("Reviews created");
}

// Helper function to get random elements from an array
function getRandomElements(array, count) {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });