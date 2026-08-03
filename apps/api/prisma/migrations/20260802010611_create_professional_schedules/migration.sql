-- CreateEnum
CREATE TYPE "ProfessionalScheduleStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "Weekday" AS ENUM ('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY');

-- CreateTable
CREATE TABLE "professional_schedules" (
    "id" UUID NOT NULL,
    "organizationId" UUID NOT NULL,
    "professionalMembershipId" UUID NOT NULL,
    "timeZone" VARCHAR(100) NOT NULL,
    "slotIntervalMinutes" INTEGER NOT NULL DEFAULT 30,
    "status" "ProfessionalScheduleStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "professional_schedules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "professional_availability_windows" (
    "id" UUID NOT NULL,
    "organizationId" UUID NOT NULL,
    "professionalScheduleId" UUID NOT NULL,
    "weekday" "Weekday" NOT NULL,
    "startMinute" INTEGER NOT NULL,
    "endMinute" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "professional_availability_windows_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "professional_schedules_organizationId_idx" ON "professional_schedules"("organizationId");

-- CreateIndex
CREATE INDEX "professional_schedules_professionalMembershipId_idx" ON "professional_schedules"("professionalMembershipId");

-- CreateIndex
CREATE INDEX "professional_schedules_organizationId_status_idx" ON "professional_schedules"("organizationId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "professional_schedules_organizationId_professionalMembershi_key" ON "professional_schedules"("organizationId", "professionalMembershipId");

-- CreateIndex
CREATE UNIQUE INDEX "professional_schedules_organizationId_id_key" ON "professional_schedules"("organizationId", "id");

-- CreateIndex
CREATE INDEX "professional_availability_windows_organizationId_idx" ON "professional_availability_windows"("organizationId");

-- CreateIndex
CREATE INDEX "professional_availability_windows_professionalScheduleId_idx" ON "professional_availability_windows"("professionalScheduleId");

-- CreateIndex
CREATE INDEX "professional_availability_windows_professionalScheduleId_we_idx" ON "professional_availability_windows"("professionalScheduleId", "weekday");

-- CreateIndex
CREATE UNIQUE INDEX "professional_availability_windows_professionalScheduleId_we_key" ON "professional_availability_windows"("professionalScheduleId", "weekday", "startMinute", "endMinute");

-- AddForeignKey
ALTER TABLE "professional_schedules" ADD CONSTRAINT "professional_schedules_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "professional_schedules" ADD CONSTRAINT "professional_schedules_organizationId_professionalMembersh_fkey" FOREIGN KEY ("organizationId", "professionalMembershipId") REFERENCES "memberships"("organizationId", "id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "professional_availability_windows" ADD CONSTRAINT "professional_availability_windows_organizationId_professio_fkey" FOREIGN KEY ("organizationId", "professionalScheduleId") REFERENCES "professional_schedules"("organizationId", "id") ON DELETE CASCADE ON UPDATE CASCADE;
