-- CreateEnum
CREATE TYPE "AllergyType" AS ENUM ('MEDICATION', 'FOOD', 'ENVIRONMENTAL', 'CONTACT', 'OTHER');

-- CreateEnum
CREATE TYPE "AllergySeverity" AS ENUM ('MILD', 'MODERATE', 'SEVERE', 'LIFE_THREATENING');

-- CreateEnum
CREATE TYPE "AllergyStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'RESOLVED');

-- CreateTable
CREATE TABLE "medical_record_allergies" (
    "id" UUID NOT NULL,
    "organizationId" UUID NOT NULL,
    "medicalRecordId" UUID NOT NULL,
    "patientId" UUID NOT NULL,
    "substance" VARCHAR(200) NOT NULL,
    "type" "AllergyType" NOT NULL,
    "reaction" VARCHAR(500),
    "severity" "AllergySeverity",
    "status" "AllergyStatus" NOT NULL DEFAULT 'ACTIVE',
    "identifiedAt" DATE,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "medical_record_allergies_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "medical_record_allergies_organizationId_idx" ON "medical_record_allergies"("organizationId");

-- CreateIndex
CREATE INDEX "medical_record_allergies_medicalRecordId_idx" ON "medical_record_allergies"("medicalRecordId");

-- CreateIndex
CREATE INDEX "medical_record_allergies_patientId_idx" ON "medical_record_allergies"("patientId");

-- CreateIndex
CREATE INDEX "medical_record_allergies_organizationId_patientId_idx" ON "medical_record_allergies"("organizationId", "patientId");

-- CreateIndex
CREATE INDEX "medical_record_allergies_type_idx" ON "medical_record_allergies"("type");

-- CreateIndex
CREATE INDEX "medical_record_allergies_severity_idx" ON "medical_record_allergies"("severity");

-- CreateIndex
CREATE INDEX "medical_record_allergies_status_idx" ON "medical_record_allergies"("status");

-- AddForeignKey
ALTER TABLE "medical_record_allergies" ADD CONSTRAINT "medical_record_allergies_medicalRecordId_fkey" FOREIGN KEY ("medicalRecordId") REFERENCES "medical_records"("id") ON DELETE CASCADE ON UPDATE CASCADE;
