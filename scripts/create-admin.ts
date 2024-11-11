import { PrismaClient } from "@prisma/client";
import { hash } from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const email = process.argv[2];
  const password = process.argv[3];

  if (!email || !password) {
    console.error("Please provide email and password");
    process.exit(1);
  }

  try {
    const hashedPassword = await hash(password, 10);

    const admin = await prisma.user.upsert({
      where: { email },
      update: {
        isAdmin: true,
      },
      create: {
        email,
        hashedPassword,
        isAdmin: true,
        name: "Admin User",
      },
    });

    console.log("Admin user created successfully:", admin);
  } catch (error) {
    console.error("Error creating admin user:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
