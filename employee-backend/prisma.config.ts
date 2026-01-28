import { defineConfig, env } from "prisma/config";
import "dotenv/config";

export default defineConfig({
  schema: "./src/libs/db/prisma/schema.prisma",
  migrations: {
    path: "./src/libs/db/prisma/migrations/",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});
