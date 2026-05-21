import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";

const prisma = new PrismaClient();

async function main() {
  const filePath = path.join(process.cwd(), "src", "data", "site-data.json");
  const raw = fs.readFileSync(filePath, "utf-8");
  const data = JSON.parse(raw);

  await prisma.siteData.upsert({
    where: { id: "default" },
    update: { data },
    create: { id: "default", data },
  });

  console.log("Seeded site data from site-data.json");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
