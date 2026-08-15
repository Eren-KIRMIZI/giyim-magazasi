-- AlterTable
ALTER TABLE "OrderReservation" ADD COLUMN     "expiresAt" TIMESTAMP(3);

-- Backfill: existing ACTIVE reservations get a 24h expiry from creation time
UPDATE "OrderReservation"
SET "expiresAt" = "createdAt" + INTERVAL '24 hours'
WHERE "status" = 'ACTIVE' AND "expiresAt" IS NULL;

-- CreateIndex
CREATE INDEX "OrderReservation_status_expiresAt_idx" ON "OrderReservation"("status", "expiresAt");
