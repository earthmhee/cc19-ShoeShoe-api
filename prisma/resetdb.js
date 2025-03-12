require("dotenv").config();
const prisma = require("../config/prisma");

async function resetDatabase() {
  // ดึงเฉพาะ Model จริง ๆ จาก Prisma Client
  const tableNames = Object.keys(prisma).filter(
    (key) => typeof prisma[key]?.deleteMany === "function"
  );

  console.log("Resetting tables:", tableNames);

  try {
    // ลบข้อมูลทุกตารางใน Prisma ด้วย Transaction
    await prisma.$transaction(
      tableNames.map((table) => prisma[table].deleteMany())
    );

    // รีเซ็ต Auto Increment (ใช้กับ MySQL)
    for (let table of tableNames) {
      console.log(` Resetting ${table} auto_increment...`);
      await prisma.$executeRawUnsafe(
        `ALTER TABLE \`${table}\` AUTO_INCREMENT = 1`
      );
    }

    console.log("Database reset complete!");
  } catch (error) {
    console.error("Error resetting database:", error);
  } finally {
    await prisma.$disconnect();
  }
}

resetDatabase();
