-- DropForeignKey
ALTER TABLE "ExpoToken" DROP CONSTRAINT "ExpoToken_auth_id_fkey";

-- DropForeignKey
ALTER TABLE "ExpoToken" DROP CONSTRAINT "ExpoToken_user_id_fkey";

-- AlterTable
ALTER TABLE "ExpoToken" ALTER COLUMN "auth_id" DROP NOT NULL,
ALTER COLUMN "user_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "ExpoToken" ADD CONSTRAINT "ExpoToken_auth_id_fkey" FOREIGN KEY ("auth_id") REFERENCES "Auth"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExpoToken" ADD CONSTRAINT "ExpoToken_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
