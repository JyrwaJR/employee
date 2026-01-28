/*
  Warnings:

  - Added the required column `first_name` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `last_name` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "first_name" TEXT NOT NULL,
ADD COLUMN     "last_name" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "User_id_idx" ON "User"("id");

-- CreateIndex
CREATE INDEX "User_auth_id_idx" ON "User"("auth_id");

-- CreateIndex
CREATE INDEX "User_first_name_idx" ON "User"("first_name");

-- CreateIndex
CREATE INDEX "User_last_name_idx" ON "User"("last_name");
