import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // 1. Create roles
  const roles = await prisma.role.createMany({
    data: [
      { id: 1, name: "Admin", kode: "ADM" },
      { id: 2, name: "Doctor", kode: "DOC" },
      { id: 3, name: "Nurse", kode: "NRS" },
    ],
    skipDuplicates: true,
  });

  // 2. Create hospital
  const hospital = await prisma.hospital.create({
    data: {
      name: "Unknown Hospital",
      logo_path: "logo.png",
    },
  });

  const adminFound = await prisma.user.findUnique({
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
          "$2b$10$iX3N5ObzDumHSAQuAfxYUOgwuJr8z.F3.H3jxaJmTIw0Z/cVisqBm",
        phone: "08123456789",
        is_active: true,
        hospital_id: hospital.id,
        role_id: 1,
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
