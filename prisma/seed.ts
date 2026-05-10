import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { config as loadEnv } from "dotenv";

loadEnv({ path: ".env.local" });
loadEnv({ path: ".env" });

const DEV_USER_EMAIL = "dev@example.com";
const DEV_USER_PASSWORD = "devpassword123";

const prisma = new PrismaClient();

const main = async (): Promise<void> => {
  const hash = await bcrypt.hash(DEV_USER_PASSWORD, 12);
  await prisma.user.upsert({
    where: { email: DEV_USER_EMAIL },
    create: {
      email: DEV_USER_EMAIL,
      name: "Dev User",
      passwordHash: hash,
    },
    update: {
      name: "Dev User",
      passwordHash: hash,
    },
  });

  console.log(`Seeded dev user: ${DEV_USER_EMAIL} / ${DEV_USER_PASSWORD}`);
};

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error: unknown) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
