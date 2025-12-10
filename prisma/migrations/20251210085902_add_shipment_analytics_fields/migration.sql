/*
  Warnings:

  - Added the required column `paymentStatus` to the `Shipment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `serviceType` to the `Shipment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `Shipment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Shipment" ADD COLUMN     "paymentStatus" TEXT NOT NULL,
ADD COLUMN     "serviceType" TEXT NOT NULL,
ADD COLUMN     "status" TEXT NOT NULL;
