import { defineConfig, env } from "prisma/config";
import "dotenv/config";

export default defineConfig({
  schema: "./src/libs/db/prisma/schema.prisma",
  engine: "classic",
  migrations: {
    path: "./src/libs/db/prisma/migrations/",
    seed: "ts-node --esm ./src/libs/db/prisma/seed.ts",
  },
  datasource: {
    url: env("DATABASE_URL"),
    directUrl: env("DIRECT_URL"),
  },
});
