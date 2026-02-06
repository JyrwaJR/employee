/*
  Warnings:

  - A unique constraint covering the columns `[auth_id]` on the table `ExpoToken` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id]` on the table `ExpoToken` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ExpoToken_auth_id_key" ON "ExpoToken"("auth_id");

-- CreateIndex
CREATE UNIQUE INDEX "ExpoToken_user_id_key" ON "ExpoToken"("user_id");
