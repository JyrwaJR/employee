-- CreateTable
CREATE TABLE "ExpoToken" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "auth_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "ExpoToken_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ExpoToken" ADD CONSTRAINT "ExpoToken_auth_id_fkey" FOREIGN KEY ("auth_id") REFERENCES "Auth"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExpoToken" ADD CONSTRAINT "ExpoToken_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
