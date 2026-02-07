-- CreateTable
CREATE TABLE "UsePassword" (
    "id" TEXT NOT NULL,
    "hash_password" TEXT NOT NULL,
    "is_primary" BOOLEAN NOT NULL DEFAULT false,
    "auth_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UsePassword_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UsePassword_auth_id_key" ON "UsePassword"("auth_id");

-- CreateIndex
CREATE UNIQUE INDEX "UsePassword_auth_id_hash_password_key" ON "UsePassword"("auth_id", "hash_password");

-- AddForeignKey
ALTER TABLE "UsePassword" ADD CONSTRAINT "UsePassword_auth_id_fkey" FOREIGN KEY ("auth_id") REFERENCES "Auth"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
