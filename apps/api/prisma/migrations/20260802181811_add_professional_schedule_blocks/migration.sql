-- CreateEnum
CREATE TYPE "ProfessionalScheduleBlockType" AS ENUM ('PERSONAL', 'MEETING', 'VACATION', 'HOLIDAY', 'OTHER');

-- CreateTable
CREATE TABLE "professional_schedule_blocks" (
    "id" UUID NOT NULL,
    "organizationId" UUID NOT NULL,
    "professionalScheduleId" UUID NOT NULL,
    "type" "ProfessionalScheduleBlockType" NOT NULL,
    "startsAt" TIMESTAMP(3) NOT NULL,
    "endsAt" TIMESTAMP(3) NOT NULL,
    "reason" VARCHAR(500),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "professional_schedule_blocks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ps_blocks_organization_idx" ON "professional_schedule_blocks"("organizationId");

-- CreateIndex
CREATE INDEX "ps_blocks_schedule_idx" ON "professional_schedule_blocks"("professionalScheduleId");

-- CreateIndex
CREATE INDEX "ps_blocks_org_schedule_idx" ON "professional_schedule_blocks"("organizationId", "professionalScheduleId");

-- CreateIndex
CREATE INDEX "ps_blocks_org_schedule_start_idx" ON "professional_schedule_blocks"("organizationId", "professionalScheduleId", "startsAt");

-- CreateIndex
CREATE INDEX "ps_blocks_org_schedule_end_idx" ON "professional_schedule_blocks"("organizationId", "professionalScheduleId", "endsAt");

-- AddForeignKey
ALTER TABLE "professional_schedule_blocks" ADD CONSTRAINT "professional_schedule_blocks_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "professional_schedule_blocks" ADD CONSTRAINT "professional_schedule_blocks_organizationId_professionalSc_fkey" FOREIGN KEY ("organizationId", "professionalScheduleId") REFERENCES "professional_schedules"("organizationId", "id") ON DELETE CASCADE ON UPDATE CASCADE;
