/*
  Warnings:

  - A unique constraint covering the columns `[phone_no]` on the table `Auth` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `phone_no` to the `Auth` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Auth" ADD COLUMN     "phone_no" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "otp" (
    "id" TEXT NOT NULL,
    "otp" TEXT NOT NULL,
    "auth_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "otp_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "otp_auth_id_key" ON "otp"("auth_id");

-- CreateIndex
CREATE UNIQUE INDEX "Auth_phone_no_key" ON "Auth"("phone_no");

-- AddForeignKey
ALTER TABLE "otp" ADD CONSTRAINT "otp_auth_id_fkey" FOREIGN KEY ("auth_id") REFERENCES "Auth"("id") ON DELETE SET NULL ON UPDATE CASCADE;
