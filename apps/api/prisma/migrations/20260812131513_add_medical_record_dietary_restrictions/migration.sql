-- CreateEnum
CREATE TYPE "DietaryRestrictionType" AS ENUM ('PREFERENCE', 'INTOLERANCE', 'MEDICAL_RESTRICTION', 'CULTURAL_RELIGIOUS', 'ETHICAL_LIFESTYLE', 'OTHER');

-- CreateEnum
CREATE TYPE "DietaryRestrictionAction" AS ENUM ('AVOID', 'LIMIT', 'MONITOR', 'KEEP_CONSISTENT', 'BLOCK');

-- CreateEnum
CREATE TYPE "DietaryRestrictionRisk" AS ENUM ('NONE', 'LOW', 'MODERATE', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "DietaryRestrictionSource" AS ENUM ('PATIENT_REPORTED', 'PROFESSIONAL_REPORTED', 'SYSTEM_DERIVED');

-- CreateEnum
CREATE TYPE "DietaryRestrictionStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'RESOLVED');

-- CreateTable
CREATE TABLE "medical_record_dietary_restrictions" (
    "id" UUID NOT NULL,
    "organizationId" UUID NOT NULL,
    "medicalRecordId" UUID NOT NULL,
    "patientId" UUID NOT NULL,
    "item" VARCHAR(200) NOT NULL,
    "type" "DietaryRestrictionType" NOT NULL,
    "action" "DietaryRestrictionAction" NOT NULL,
    "risk" "DietaryRestrictionRisk" NOT NULL DEFAULT 'NONE',
    "source" "DietaryRestrictionSource" NOT NULL DEFAULT 'PATIENT_REPORTED',
    "reason" VARCHAR(500),
    "identifiedAt" DATE,
    "status" "DietaryRestrictionStatus" NOT NULL DEFAULT 'ACTIVE',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "medical_record_dietary_restrictions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "medical_record_dietary_restrictions_organizationId_idx" ON "medical_record_dietary_restrictions"("organizationId");

-- CreateIndex
CREATE INDEX "medical_record_dietary_restrictions_medicalRecordId_idx" ON "medical_record_dietary_restrictions"("medicalRecordId");

-- CreateIndex
CREATE INDEX "medical_record_dietary_restrictions_patientId_idx" ON "medical_record_dietary_restrictions"("patientId");

-- CreateIndex
CREATE INDEX "medical_record_dietary_restrictions_organizationId_patientI_idx" ON "medical_record_dietary_restrictions"("organizationId", "patientId");

-- CreateIndex
CREATE INDEX "medical_record_dietary_restrictions_type_idx" ON "medical_record_dietary_restrictions"("type");

-- CreateIndex
CREATE INDEX "medical_record_dietary_restrictions_action_idx" ON "medical_record_dietary_restrictions"("action");

-- CreateIndex
CREATE INDEX "medical_record_dietary_restrictions_risk_idx" ON "medical_record_dietary_restrictions"("risk");

-- CreateIndex
CREATE INDEX "medical_record_dietary_restrictions_status_idx" ON "medical_record_dietary_restrictions"("status");

-- AddForeignKey
ALTER TABLE "medical_record_dietary_restrictions" ADD CONSTRAINT "medical_record_dietary_restrictions_medicalRecordId_fkey" FOREIGN KEY ("medicalRecordId") REFERENCES "medical_records"("id") ON DELETE CASCADE ON UPDATE CASCADE;
