-- CreateTable
CREATE TABLE "EmailAccount" (
    "id" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "accountType" TEXT NOT NULL DEFAULT 'customer',
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EmailAccount_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EmailAccount_address_key" ON "EmailAccount"("address");

-- CreateIndex
CREATE INDEX "EmailAccount_address_idx" ON "EmailAccount"("address");

-- CreateIndex
CREATE INDEX "EmailAccount_accountType_idx" ON "EmailAccount"("accountType");

-- CreateIndex
CREATE INDEX "EmailAccount_active_idx" ON "EmailAccount"("active");
