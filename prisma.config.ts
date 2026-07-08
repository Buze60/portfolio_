import "dotenv/config";
import { defineConfig } from "prisma/config";

const isPostgres = process.env["DATABASE_URL"]?.startsWith("postgresql")

export default defineConfig({
  schema: isPostgres ? "prisma/schema.postgres.prisma" : "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: isPostgres ? process.env["DATABASE_URL"] : "file:./prisma/dev.db",
  },
});
