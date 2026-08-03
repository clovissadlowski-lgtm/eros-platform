/*
  Warnings:

  - A unique constraint covering the columns `[organizationId,id]` on the table `patients` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "MedicalRecordStatus" AS ENUM ('ACTIVE', 'ARCHIVED');

-- CreateTable
CREATE TABLE "medical_records" (
    "id" UUID NOT NULL,
    "organizationId" UUID NOT NULL,
    "patientId" UUID NOT NULL,
    "chiefComplaint" TEXT,
    "clinicalHistory" TEXT,
    "familyHistory" TEXT,
    "allergies" TEXT,
    "currentMedications" TEXT,
    "healthConditions" TEXT,
    "clinicalNotes" TEXT,
    "treatmentGoals" TEXT,
    "status" "MedicalRecordStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "medical_records_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "medical_records_organizationId_idx" ON "medical_records"("organizationId");

-- CreateIndex
CREATE INDEX "medical_records_patientId_idx" ON "medical_records"("patientId");

-- CreateIndex
CREATE INDEX "medical_records_status_idx" ON "medical_records"("status");

-- CreateIndex
CREATE UNIQUE INDEX "medical_records_organizationId_patientId_key" ON "medical_records"("organizationId", "patientId");

-- CreateIndex
CREATE UNIQUE INDEX "patients_organizationId_id_key" ON "patients"("organizationId", "id");

-- AddForeignKey
ALTER TABLE "medical_records" ADD CONSTRAINT "medical_records_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medical_records" ADD CONSTRAINT "medical_records_organizationId_patientId_fkey" FOREIGN KEY ("organizationId", "patientId") REFERENCES "patients"("organizationId", "id") ON DELETE RESTRICT ON UPDATE CASCADE;
