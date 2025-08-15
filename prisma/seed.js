import { prismaClient } from "../src/applications/database.js";

async function main() {
  // 1. Create roles
  await prismaClient.role.createMany({
    data: [
      { id: "ADM01", name: "admin", kode: "ADM" },
      { id: "DOC01", name: "doctor", kode: "DOC" },
      { id: "NUR01", name: "nurse", kode: "NUR" },
    ],
    skipDuplicates: true,
  });

  const roleAdmin = await prismaClient.role.findFirst({
    where: { name: "admin" },
  });

  if (!roleAdmin) throw new Error("Role admin not found");

  // 2. Create hospital
  const hospital = await prismaClient.hospital.create({
    data: {
      name: "Unknown Hospital",
      logo_path: "logo.png",
    },
    select: {
      id: true,
    },
  });

  const satuSehat = await prismaClient.satuSehatEnv.findFirst({
    where: {
      hospital_id: hospital.id,
    },
  });
  if (!satuSehat) {
    await prismaClient.satuSehatEnv.create({
      data: {
        hospital_id: hospital.id,
      },
      select: {
        id: true,
      },
    });
  }

  // 3. Cek apakah user admin sudah ada
  const adminFound = await prismaClient.user.findFirst({
    where: { username: "admin" },
  });

  const address = await prismaClient.address.create({
    data: {
      use: "home",
      line: "Jl Mangkunegara No.39",
      city: "Jakarta",
      postal_code: "12345",
      country: "ID",
      rt: "2",
      rw: "3",
      province_id: "35",
      regency_id: "3517",
      district_id: "3517170",
      village_id: "3517170015",
    },
    select: {
      id: true,
    },
  });

  if (!adminFound) {
    await prismaClient.user.createMany({
      data: [
        {
          username: "admin",
          email: "admin@example.com",
          password:
            "$2b$10$iX3N5ObzDumHSAQuAfxYUOgwuJr8z.F3.H3jxaJmTIw0Z/cVisqBm", // password: admin
          phone: "08123456789",
          is_active: true,
          hospital_id: hospital.id,
          role_id: roleAdmin.id,
          name: "Super Admin",
          gender: "male",
          address_id: address.id,
        },
        {
          username: "admin1",
          email: "admin1@example.com",
          password:
            "$2b$10$iX3N5ObzDumHSAQuAfxYUOgwuJr8z.F3.H3jxaJmTIw0Z/cVisqBm", // password: admin
          phone: "08123456789",
          is_active: true,
          hospital_id: hospital.id,
          role_id: roleAdmin.id,
          name: "Super Admin 1",
          gender: "female",
          address_id: address.id,
        },
      ],
      skipDuplicates: true,
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
    await prismaClient.$disconnect();
  });
