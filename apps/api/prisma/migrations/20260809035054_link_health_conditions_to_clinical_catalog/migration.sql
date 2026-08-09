-- AlterTable
ALTER TABLE "medical_record_health_conditions" ADD COLUMN     "clinicalConditionId" UUID;

-- CreateIndex
CREATE INDEX "medical_record_health_conditions_clinicalConditionId_idx" ON "medical_record_health_conditions"("clinicalConditionId");

-- AddForeignKey
ALTER TABLE "medical_record_health_conditions" ADD CONSTRAINT "medical_record_health_conditions_clinicalConditionId_fkey" FOREIGN KEY ("clinicalConditionId") REFERENCES "clinical_condition_catalog"("id") ON DELETE SET NULL ON UPDATE CASCADE;
