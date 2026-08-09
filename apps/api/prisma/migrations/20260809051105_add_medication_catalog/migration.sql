-- CreateEnum
CREATE TYPE "MedicationSynonymType" AS ENUM ('BRAND_NAME', 'ABBREVIATION', 'ALTERNATIVE_NAME', 'OTHER');

-- CreateEnum
CREATE TYPE "MedicationTerminologySystem" AS ENUM ('ATC', 'RXNORM', 'SNOMED_CT', 'ANVISA', 'OTHER');

-- AlterTable
ALTER TABLE "medical_record_medications" ADD COLUMN     "medicationCatalogId" UUID;

-- CreateTable
CREATE TABLE "medication_catalog" (
    "id" UUID NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "normalizedName" VARCHAR(200) NOT NULL,
    "activeIngredient" VARCHAR(200) NOT NULL,
    "normalizedActiveIngredient" VARCHAR(200) NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "medication_catalog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "medication_synonyms" (
    "id" UUID NOT NULL,
    "medicationCatalogId" UUID NOT NULL,
    "term" VARCHAR(200) NOT NULL,
    "normalizedTerm" VARCHAR(200) NOT NULL,
    "type" "MedicationSynonymType" NOT NULL DEFAULT 'OTHER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "medication_synonyms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "medication_external_codes" (
    "id" UUID NOT NULL,
    "medicationCatalogId" UUID NOT NULL,
    "system" "MedicationTerminologySystem" NOT NULL,
    "code" VARCHAR(100) NOT NULL,
    "display" VARCHAR(250),
    "version" VARCHAR(50),
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "medication_external_codes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "medication_catalog_normalizedName_key" ON "medication_catalog"("normalizedName");

-- CreateIndex
CREATE INDEX "medication_catalog_name_idx" ON "medication_catalog"("name");

-- CreateIndex
CREATE INDEX "medication_catalog_normalizedName_idx" ON "medication_catalog"("normalizedName");

-- CreateIndex
CREATE INDEX "medication_catalog_activeIngredient_idx" ON "medication_catalog"("activeIngredient");

-- CreateIndex
CREATE INDEX "medication_catalog_normalizedActiveIngredient_idx" ON "medication_catalog"("normalizedActiveIngredient");

-- CreateIndex
CREATE INDEX "medication_catalog_isActive_idx" ON "medication_catalog"("isActive");

-- CreateIndex
CREATE INDEX "medication_synonyms_normalizedTerm_idx" ON "medication_synonyms"("normalizedTerm");

-- CreateIndex
CREATE INDEX "medication_synonyms_medicationCatalogId_idx" ON "medication_synonyms"("medicationCatalogId");

-- CreateIndex
CREATE INDEX "medication_synonyms_type_idx" ON "medication_synonyms"("type");

-- CreateIndex
CREATE UNIQUE INDEX "medication_synonyms_medicationCatalogId_normalizedTerm_key" ON "medication_synonyms"("medicationCatalogId", "normalizedTerm");

-- CreateIndex
CREATE INDEX "medication_external_codes_medicationCatalogId_idx" ON "medication_external_codes"("medicationCatalogId");

-- CreateIndex
CREATE INDEX "medication_external_codes_system_idx" ON "medication_external_codes"("system");

-- CreateIndex
CREATE INDEX "medication_external_codes_code_idx" ON "medication_external_codes"("code");

-- CreateIndex
CREATE INDEX "medication_external_codes_system_code_idx" ON "medication_external_codes"("system", "code");

-- CreateIndex
CREATE UNIQUE INDEX "medication_external_codes_system_code_key" ON "medication_external_codes"("system", "code");

-- CreateIndex
CREATE INDEX "medical_record_medications_medicationCatalogId_idx" ON "medical_record_medications"("medicationCatalogId");

-- AddForeignKey
ALTER TABLE "medical_record_medications" ADD CONSTRAINT "medical_record_medications_medicationCatalogId_fkey" FOREIGN KEY ("medicationCatalogId") REFERENCES "medication_catalog"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medication_synonyms" ADD CONSTRAINT "medication_synonyms_medicationCatalogId_fkey" FOREIGN KEY ("medicationCatalogId") REFERENCES "medication_catalog"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medication_external_codes" ADD CONSTRAINT "medication_external_codes_medicationCatalogId_fkey" FOREIGN KEY ("medicationCatalogId") REFERENCES "medication_catalog"("id") ON DELETE CASCADE ON UPDATE CASCADE;
