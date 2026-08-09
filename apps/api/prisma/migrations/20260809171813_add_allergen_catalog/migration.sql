-- CreateEnum
CREATE TYPE "AllergenCatalogType" AS ENUM ('MEDICATION', 'ACTIVE_INGREDIENT', 'FOOD', 'ENVIRONMENTAL', 'CONTACT', 'BIOLOGICAL', 'CHEMICAL', 'OTHER');

-- CreateEnum
CREATE TYPE "AllergenTerminologySystem" AS ENUM ('SNOMED_CT', 'RXNORM', 'UNII', 'OTHER');

-- AlterTable
ALTER TABLE "medical_record_allergies" ADD COLUMN     "allergenCatalogId" UUID;

-- CreateTable
CREATE TABLE "allergen_catalog" (
    "id" UUID NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "normalizedName" VARCHAR(200) NOT NULL,
    "type" "AllergenCatalogType" NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "allergen_catalog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "allergen_synonyms" (
    "id" UUID NOT NULL,
    "allergenCatalogId" UUID NOT NULL,
    "term" VARCHAR(200) NOT NULL,
    "normalizedTerm" VARCHAR(200) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "allergen_synonyms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "allergen_external_codes" (
    "id" UUID NOT NULL,
    "allergenCatalogId" UUID NOT NULL,
    "system" "AllergenTerminologySystem" NOT NULL,
    "code" VARCHAR(100) NOT NULL,
    "display" VARCHAR(250),
    "version" VARCHAR(50),
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "allergen_external_codes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "allergen_catalog_normalizedName_key" ON "allergen_catalog"("normalizedName");

-- CreateIndex
CREATE INDEX "allergen_catalog_name_idx" ON "allergen_catalog"("name");

-- CreateIndex
CREATE INDEX "allergen_catalog_normalizedName_idx" ON "allergen_catalog"("normalizedName");

-- CreateIndex
CREATE INDEX "allergen_catalog_type_idx" ON "allergen_catalog"("type");

-- CreateIndex
CREATE INDEX "allergen_catalog_isActive_idx" ON "allergen_catalog"("isActive");

-- CreateIndex
CREATE INDEX "allergen_synonyms_normalizedTerm_idx" ON "allergen_synonyms"("normalizedTerm");

-- CreateIndex
CREATE INDEX "allergen_synonyms_allergenCatalogId_idx" ON "allergen_synonyms"("allergenCatalogId");

-- CreateIndex
CREATE UNIQUE INDEX "allergen_synonyms_allergenCatalogId_normalizedTerm_key" ON "allergen_synonyms"("allergenCatalogId", "normalizedTerm");

-- CreateIndex
CREATE INDEX "allergen_external_codes_allergenCatalogId_idx" ON "allergen_external_codes"("allergenCatalogId");

-- CreateIndex
CREATE INDEX "allergen_external_codes_system_idx" ON "allergen_external_codes"("system");

-- CreateIndex
CREATE INDEX "allergen_external_codes_code_idx" ON "allergen_external_codes"("code");

-- CreateIndex
CREATE INDEX "allergen_external_codes_system_code_idx" ON "allergen_external_codes"("system", "code");

-- CreateIndex
CREATE UNIQUE INDEX "allergen_external_codes_system_code_key" ON "allergen_external_codes"("system", "code");

-- CreateIndex
CREATE INDEX "medical_record_allergies_allergenCatalogId_idx" ON "medical_record_allergies"("allergenCatalogId");

-- AddForeignKey
ALTER TABLE "medical_record_allergies" ADD CONSTRAINT "medical_record_allergies_allergenCatalogId_fkey" FOREIGN KEY ("allergenCatalogId") REFERENCES "allergen_catalog"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "allergen_synonyms" ADD CONSTRAINT "allergen_synonyms_allergenCatalogId_fkey" FOREIGN KEY ("allergenCatalogId") REFERENCES "allergen_catalog"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "allergen_external_codes" ADD CONSTRAINT "allergen_external_codes_allergenCatalogId_fkey" FOREIGN KEY ("allergenCatalogId") REFERENCES "allergen_catalog"("id") ON DELETE CASCADE ON UPDATE CASCADE;
