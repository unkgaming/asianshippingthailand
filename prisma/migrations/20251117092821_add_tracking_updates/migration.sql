-- CreateTable
CREATE TABLE "TrackingUpdate" (
    "id" TEXT NOT NULL,
    "shipmentId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "location" TEXT,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT,

    CONSTRAINT "TrackingUpdate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TrackingUpdate_shipmentId_idx" ON "TrackingUpdate"("shipmentId");

-- CreateIndex
CREATE INDEX "TrackingUpdate_createdAt_idx" ON "TrackingUpdate"("createdAt");
