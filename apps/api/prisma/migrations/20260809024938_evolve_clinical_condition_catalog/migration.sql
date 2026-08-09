/*
  Warnings:

  - You are about to drop the column `code` on the `clinical_condition_catalog` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "ClinicalConceptType" AS ENUM ('CONDITION', 'DISEASE', 'DISORDER', 'SYNDROME', 'CLINICAL_FINDING', 'OTHER');

-- CreateEnum
CREATE TYPE "TerminologySystem" AS ENUM ('SNOMED_CT', 'ICD_10', 'ICD_11', 'OTHER');

-- DropIndex
DROP INDEX "clinical_condition_catalog_code_key";

-- AlterTable
ALTER TABLE "clinical_condition_catalog" DROP COLUMN "code",
ADD COLUMN     "conceptType" "ClinicalConceptType" NOT NULL DEFAULT 'CONDITION';

-- CreateTable
CREATE TABLE "clinical_condition_external_codes" (
    "id" UUID NOT NULL,
    "clinicalConditionId" UUID NOT NULL,
    "system" "TerminologySystem" NOT NULL,
    "code" VARCHAR(100) NOT NULL,
    "display" VARCHAR(250),
    "version" VARCHAR(50),
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "clinical_condition_external_codes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "clinical_condition_external_codes_clinicalConditionId_idx" ON "clinical_condition_external_codes"("clinicalConditionId");

-- CreateIndex
CREATE INDEX "clinical_condition_external_codes_system_idx" ON "clinical_condition_external_codes"("system");

-- CreateIndex
CREATE INDEX "clinical_condition_external_codes_code_idx" ON "clinical_condition_external_codes"("code");

-- CreateIndex
CREATE INDEX "clinical_condition_external_codes_system_code_idx" ON "clinical_condition_external_codes"("system", "code");

-- CreateIndex
CREATE UNIQUE INDEX "clinical_condition_external_codes_system_code_key" ON "clinical_condition_external_codes"("system", "code");

-- CreateIndex
CREATE INDEX "clinical_condition_catalog_normalizedName_idx" ON "clinical_condition_catalog"("normalizedName");

-- CreateIndex
CREATE INDEX "clinical_condition_catalog_conceptType_idx" ON "clinical_condition_catalog"("conceptType");

-- AddForeignKey
ALTER TABLE "clinical_condition_external_codes" ADD CONSTRAINT "clinical_condition_external_codes_clinicalConditionId_fkey" FOREIGN KEY ("clinicalConditionId") REFERENCES "clinical_condition_catalog"("id") ON DELETE CASCADE ON UPDATE CASCADE;
