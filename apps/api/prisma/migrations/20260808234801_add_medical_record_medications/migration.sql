-- CreateEnum
CREATE TYPE "MedicationStatus" AS ENUM ('ACTIVE', 'SUSPENDED', 'COMPLETED', 'DISCONTINUED');

-- CreateEnum
CREATE TYPE "MedicationRoute" AS ENUM ('ORAL', 'SUBCUTANEOUS', 'INTRAMUSCULAR', 'INTRAVENOUS', 'TOPICAL', 'INHALATION', 'SUBLINGUAL', 'RECTAL', 'VAGINAL', 'OPHTHALMIC', 'OTIC', 'NASAL', 'OTHER');

-- CreateTable
CREATE TABLE "medical_record_medications" (
    "id" UUID NOT NULL,
    "organizationId" UUID NOT NULL,
    "medicalRecordId" UUID NOT NULL,
    "patientId" UUID NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "dosage" VARCHAR(100),
    "frequency" VARCHAR(100),
    "route" "MedicationRoute",
    "indication" VARCHAR(500),
    "startedAt" DATE,
    "endedAt" DATE,
    "status" "MedicationStatus" NOT NULL DEFAULT 'ACTIVE',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "medical_record_medications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "medical_record_medications_organizationId_idx" ON "medical_record_medications"("organizationId");

-- CreateIndex
CREATE INDEX "medical_record_medications_medicalRecordId_idx" ON "medical_record_medications"("medicalRecordId");

-- CreateIndex
CREATE INDEX "medical_record_medications_patientId_idx" ON "medical_record_medications"("patientId");

-- CreateIndex
CREATE INDEX "medical_record_medications_organizationId_patientId_idx" ON "medical_record_medications"("organizationId", "patientId");

-- CreateIndex
CREATE INDEX "medical_record_medications_status_idx" ON "medical_record_medications"("status");

-- AddForeignKey
ALTER TABLE "medical_record_medications" ADD CONSTRAINT "medical_record_medications_medicalRecordId_fkey" FOREIGN KEY ("medicalRecordId") REFERENCES "medical_records"("id") ON DELETE CASCADE ON UPDATE CASCADE;
