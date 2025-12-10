/*
  Warnings:

  - You are about to drop the column `bookingDate` on the `Shipment` table. All the data in the column will be lost.
  - You are about to drop the column `containerContents` on the `Shipment` table. All the data in the column will be lost.
  - You are about to drop the column `estimatedDelivery` on the `Shipment` table. All the data in the column will be lost.
  - You are about to drop the column `packageType` on the `Shipment` table. All the data in the column will be lost.
  - You are about to drop the column `paymentStatus` on the `Shipment` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `Shipment` table. All the data in the column will be lost.
  - You are about to drop the column `serviceType` on the `Shipment` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Shipment` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Shipment` table. All the data in the column will be lost.
  - You are about to drop the column `version` on the `Shipment` table. All the data in the column will be lost.
  - You are about to drop the column `weight` on the `Shipment` table. All the data in the column will be lost.
  - You are about to drop the column `emailVerified` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `verificationToken` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `EmailAccount` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `EmailMessage` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Inquiry` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ShipmentDocument` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TrackingUpdate` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ShipmentDocument" DROP CONSTRAINT "ShipmentDocument_shipmentId_fkey";

-- DropIndex
DROP INDEX "Shipment_createdAt_idx";

-- DropIndex
DROP INDEX "Shipment_customerEmail_idx";

-- DropIndex
DROP INDEX "Shipment_status_idx";

-- AlterTable
ALTER TABLE "Shipment" DROP COLUMN "bookingDate",
DROP COLUMN "containerContents",
DROP COLUMN "estimatedDelivery",
DROP COLUMN "packageType",
DROP COLUMN "paymentStatus",
DROP COLUMN "price",
DROP COLUMN "serviceType",
DROP COLUMN "status",
DROP COLUMN "updatedAt",
DROP COLUMN "version",
DROP COLUMN "weight";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "emailVerified",
DROP COLUMN "image",
DROP COLUMN "verificationToken",
ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- DropTable
DROP TABLE "EmailAccount";

-- DropTable
DROP TABLE "EmailMessage";

-- DropTable
DROP TABLE "Inquiry";

-- DropTable
DROP TABLE "ShipmentDocument";

-- DropTable
DROP TABLE "TrackingUpdate";
