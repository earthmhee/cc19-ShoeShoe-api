const prisma = require("../config/prisma");

exports.createAddress = async (req, res, next) => {
  try {
    const { homenum, subdistrict, district, province, country, postcode } = req.body;
    const { clerkID } = req.user; // ใช้ clerkID จาก Clerk Authentication

    if (!clerkID) {
      return res.status(401).json({ msg: "Unauthorized: กรุณาเข้าสู่ระบบ" });
    }

    console.log("Request received at /create-address with Clerk ID:", clerkID);

    // ค้นหา user จาก clerkID
    const user = await prisma.user.findUnique({
      where: { clerkID },
    });

    if (!user) {
      return res.status(404).json({ msg: "ไม่พบบัญชีผู้ใช้" });
    }

    const newAddress = await prisma.address.create({
      data: {
        homenum,
        subdistrict,
        district,
        province,
        country,
        postcode,
        userId: user.id,
      },
    });

    res.status(201).json({
      msg: "Address successfully created",
      address: newAddress,
    });
  } catch (error) {
    console.error("Error:", error);
    next(error);
  }
};

// ดึงข้อมูลที่อยู่ของผู้ใช้
exports.getAddress = async (req, res, next) => {
  try {
    const { clerkID } = req.user;

    if (!clerkID) {
      return res.status(401).json({ msg: "Unauthorized: กรุณาเข้าสู่ระบบ" });
    }

    console.log("Request received at /get-address with Clerk ID:", clerkID);

    // ค้นหา user
    const user = await prisma.user.findUnique({
      where: { clerkID },
      include: { address: true },
    });

    if (!user || !user.address.length) {
      return res.status(404).json({ msg: "ไม่พบที่อยู่ของผู้ใช้" });
    }

    res.status(200).json({
      msg: "Addresses retrieved successfully",
      addresses: user.address,
    });
  } catch (error) {
    console.error("Error:", error);
    next(error);
  }
};

// อัปเดตที่อยู่
exports.updateAddress = async (req, res, next) => {
  try {
    const { clerkID } = req.user;
    const { id } = req.params;
    const updateData = req.body;

    if (!clerkID) {
      return res.status(401).json({ msg: "Unauthorized: กรุณาเข้าสู่ระบบ" });
    }

    console.log("Request received at /update-address with Clerk ID:", clerkID);

    const user = await prisma.user.findUnique({ where: { clerkID } });
    if (!user) return res.status(404).json({ msg: "ไม่พบบัญชีผู้ใช้" });

    // ค้นหาที่อยู่
    const address = await prisma.address.findUnique({
      where: { id: parseInt(id) },
    });

    if (!address) {
      return res.status(404).json({ msg: "ไม่พบที่อยู่" });
    }

    if (address.userId !== user.id) {
      return res.status(403).json({ msg: "ไม่มีสิทธิ์แก้ไขที่อยู่นี้" });
    }

    const updatedAddress = await prisma.address.update({
      where: { id: address.id },
      data: updateData,
    });

    res.status(200).json({
      msg: "Address successfully updated",
      address: updatedAddress,
    });
  } catch (error) {
    console.error("Error:", error);
    next(error);
  }
};

// ลบที่อยู่
exports.deleteAddress = async (req, res, next) => {
  try {
    const { clerkID } = req.user;
    const { id } = req.params;

    if (!clerkID) {
      return res.status(401).json({ msg: "Unauthorized: กรุณาเข้าสู่ระบบ" });
    }

    console.log("Request received at /delete-address with Clerk ID:", clerkID);

    const user = await prisma.user.findUnique({ where: { clerkID } });
    if (!user) return res.status(404).json({ msg: "ไม่พบบัญชีผู้ใช้" });

    // ค้นหาที่อยู่
    const address = await prisma.address.findUnique({
      where: { id: parseInt(id) },
    });

    if (!address) {
      return res.status(404).json({ msg: "ไม่พบที่อยู่" });
    }

    if (address.userId !== user.id) {
      return res.status(403).json({ msg: "ไม่มีสิทธิ์ลบที่อยู่นี้" });
    }

    await prisma.address.delete({
      where: { id: address.id },
    });

    res.status(200).json({ msg: "Address successfully deleted" });
  } catch (error) {
    console.error("Error:", error);
    next(error);
  }
};
