-- AlterTable
ALTER TABLE "EmailMessage" ADD COLUMN     "hidden" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Inquiry" ADD COLUMN     "hidden" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "EmailMessage_hidden_idx" ON "EmailMessage"("hidden");

-- CreateIndex
CREATE INDEX "Inquiry_hidden_idx" ON "Inquiry"("hidden");
