-- CreateEnum
CREATE TYPE "BodyCompositionMethod" AS ENUM ('BIOIMPEDANCE', 'SKINFOLD', 'DEXA', 'OTHER');

-- CreateTable
CREATE TABLE "anthropometric_assessments" (
    "id" UUID NOT NULL,
    "organizationId" UUID NOT NULL,
    "medicalRecordId" UUID NOT NULL,
    "patientId" UUID NOT NULL,
    "measuredAt" DATE NOT NULL,
    "weightKg" DECIMAL(6,2),
    "heightCm" DECIMAL(6,2),
    "bodyFatPercentage" DECIMAL(5,2),
    "fatMassKg" DECIMAL(6,2),
    "leanMassKg" DECIMAL(6,2),
    "muscleMassKg" DECIMAL(6,2),
    "waistCircumferenceCm" DECIMAL(6,2),
    "hipCircumferenceCm" DECIMAL(6,2),
    "abdomenCircumferenceCm" DECIMAL(6,2),
    "chestCircumferenceCm" DECIMAL(6,2),
    "armCircumferenceCm" DECIMAL(6,2),
    "thighCircumferenceCm" DECIMAL(6,2),
    "calfCircumferenceCm" DECIMAL(6,2),
    "bodyCompositionMethod" "BodyCompositionMethod",
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "anthropometric_assessments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "anthropometric_assessments_organizationId_idx" ON "anthropometric_assessments"("organizationId");

-- CreateIndex
CREATE INDEX "anthropometric_assessments_medicalRecordId_idx" ON "anthropometric_assessments"("medicalRecordId");

-- CreateIndex
CREATE INDEX "anthropometric_assessments_patientId_idx" ON "anthropometric_assessments"("patientId");

-- CreateIndex
CREATE INDEX "anthropometric_assessments_organizationId_patientId_idx" ON "anthropometric_assessments"("organizationId", "patientId");

-- CreateIndex
CREATE INDEX "anthropometric_assessments_measuredAt_idx" ON "anthropometric_assessments"("measuredAt");

-- CreateIndex
CREATE INDEX "anthropometric_assessments_organizationId_patientId_measure_idx" ON "anthropometric_assessments"("organizationId", "patientId", "measuredAt");

-- AddForeignKey
ALTER TABLE "anthropometric_assessments" ADD CONSTRAINT "anthropometric_assessments_medicalRecordId_fkey" FOREIGN KEY ("medicalRecordId") REFERENCES "medical_records"("id") ON DELETE CASCADE ON UPDATE CASCADE;
