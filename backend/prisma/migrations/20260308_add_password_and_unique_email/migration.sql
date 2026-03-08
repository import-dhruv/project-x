-- AlterTable
ALTER TABLE "users" ADD COLUMN "password" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
