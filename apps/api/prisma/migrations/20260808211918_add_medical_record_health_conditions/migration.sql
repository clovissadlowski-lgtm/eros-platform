-- CreateEnum
CREATE TYPE "HealthConditionStatus" AS ENUM ('ACTIVE', 'CONTROLLED', 'RESOLVED', 'INACTIVE');

-- CreateTable
CREATE TABLE "medical_record_health_conditions" (
    "id" UUID NOT NULL,
    "organizationId" UUID NOT NULL,
    "medicalRecordId" UUID NOT NULL,
    "patientId" UUID NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "status" "HealthConditionStatus" NOT NULL DEFAULT 'ACTIVE',
    "diagnosedAt" DATE,
    "resolvedAt" DATE,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "medical_record_health_conditions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "medical_record_health_conditions_organizationId_idx" ON "medical_record_health_conditions"("organizationId");

-- CreateIndex
CREATE INDEX "medical_record_health_conditions_medicalRecordId_idx" ON "medical_record_health_conditions"("medicalRecordId");

-- CreateIndex
CREATE INDEX "medical_record_health_conditions_patientId_idx" ON "medical_record_health_conditions"("patientId");

-- CreateIndex
CREATE INDEX "medical_record_health_conditions_organizationId_patientId_idx" ON "medical_record_health_conditions"("organizationId", "patientId");

-- CreateIndex
CREATE INDEX "medical_record_health_conditions_status_idx" ON "medical_record_health_conditions"("status");

-- AddForeignKey
ALTER TABLE "medical_record_health_conditions" ADD CONSTRAINT "medical_record_health_conditions_medicalRecordId_fkey" FOREIGN KEY ("medicalRecordId") REFERENCES "medical_records"("id") ON DELETE CASCADE ON UPDATE CASCADE;
