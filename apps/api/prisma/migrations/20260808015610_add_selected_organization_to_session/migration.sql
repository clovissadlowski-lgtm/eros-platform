-- AlterTable
ALTER TABLE "sessions" ADD COLUMN     "selectedOrganizationId" UUID;

-- CreateIndex
CREATE INDEX "sessions_selectedOrganizationId_idx" ON "sessions"("selectedOrganizationId");
