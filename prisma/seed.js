import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // 1. Create roles
  const roles = await prisma.role.createMany({
    data: [
      { name: "admin", kode: "ADM" },
      { name: "doctor", kode: "DOC" },
      { name: "nurse", kode: "NUR" },
    ],
    skipDuplicates: true,
  });

  const roleAdmin = await prisma.role.findFirst({
    where: {
      name: "admin",
    },
  });

  // 2. Create hospital
  const hospital = await prisma.hospital.create({
    data: {
      name: "Unknown Hospital",
      logo_path: "logo.png",
    },
  });

  const adminFound = await prisma.user.findFirst({
    where: {
      username: "admin",
    },
  });

  if (!adminFound) {
    // Create Admin User
    const adminUser = await prisma.user.create({
      data: {
        username: "admin",
        email: "admin@example.com",
        password:
          "$2b$10$iX3N5ObzDumHSAQuAfxYUOgwuJr8z.F3.H3jxaJmTIw0Z/cVisqBm", // password: 123456
        phone: "08123456789",
        is_active: true,
        hospital_id: hospital.id,
        role_id: roleAdmin.id,
        admin: {
          create: {
            name: "Super Admin",
          },
        },
      },
    });
  }

  console.log("Seeder selesai!");
}

main()
  .catch((e) => {
    console.error("Error saat seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
