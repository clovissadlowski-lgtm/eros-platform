/*
  Warnings:

  - A unique constraint covering the columns `[organizationId,id]` on the table `memberships` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "AppointmentType" AS ENUM ('INITIAL', 'FOLLOW_UP', 'REVIEW', 'OTHER');

-- CreateEnum
CREATE TYPE "AppointmentStatus" AS ENUM ('SCHEDULED', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'NO_SHOW');

-- CreateTable
CREATE TABLE "appointments" (
    "id" UUID NOT NULL,
    "organizationId" UUID NOT NULL,
    "patientId" UUID NOT NULL,
    "professionalMembershipId" UUID NOT NULL,
    "type" "AppointmentType" NOT NULL,
    "status" "AppointmentStatus" NOT NULL DEFAULT 'SCHEDULED',
    "scheduledAt" TIMESTAMP(3) NOT NULL,
    "durationMinutes" INTEGER NOT NULL,
    "reason" TEXT,
    "notes" TEXT,
    "completedAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "cancellationReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "appointments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "appointments_organizationId_idx" ON "appointments"("organizationId");

-- CreateIndex
CREATE INDEX "appointments_patientId_idx" ON "appointments"("patientId");

-- CreateIndex
CREATE INDEX "appointments_professionalMembershipId_idx" ON "appointments"("professionalMembershipId");

-- CreateIndex
CREATE INDEX "appointments_organizationId_scheduledAt_idx" ON "appointments"("organizationId", "scheduledAt");

-- CreateIndex
CREATE INDEX "appointments_organizationId_status_idx" ON "appointments"("organizationId", "status");

-- CreateIndex
CREATE INDEX "appointments_organizationId_patientId_idx" ON "appointments"("organizationId", "patientId");

-- CreateIndex
CREATE INDEX "appointments_organizationId_professionalMembershipId_idx" ON "appointments"("organizationId", "professionalMembershipId");

-- CreateIndex
CREATE UNIQUE INDEX "memberships_organizationId_id_key" ON "memberships"("organizationId", "id");

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_organizationId_patientId_fkey" FOREIGN KEY ("organizationId", "patientId") REFERENCES "patients"("organizationId", "id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_organizationId_professionalMembershipId_fkey" FOREIGN KEY ("organizationId", "professionalMembershipId") REFERENCES "memberships"("organizationId", "id") ON DELETE RESTRICT ON UPDATE CASCADE;
