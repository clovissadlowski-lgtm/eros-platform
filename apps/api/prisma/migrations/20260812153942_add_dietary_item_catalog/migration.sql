-- CreateEnum
CREATE TYPE "DietaryItemCatalogType" AS ENUM ('FOOD', 'NUTRIENT', 'COMPONENT', 'INGREDIENT', 'OTHER');

-- AlterTable
ALTER TABLE "medical_record_dietary_restrictions" ADD COLUMN     "dietaryItemCatalogId" UUID;

-- CreateTable
CREATE TABLE "dietary_item_catalog" (
    "id" UUID NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "normalizedName" VARCHAR(200) NOT NULL,
    "type" "DietaryItemCatalogType" NOT NULL,
    "category" VARCHAR(100),
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "dietary_item_catalog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dietary_item_synonyms" (
    "id" UUID NOT NULL,
    "dietaryItemCatalogId" UUID NOT NULL,
    "term" VARCHAR(200) NOT NULL,
    "normalizedTerm" VARCHAR(200) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "dietary_item_synonyms_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "dietary_item_catalog_normalizedName_key" ON "dietary_item_catalog"("normalizedName");

-- CreateIndex
CREATE INDEX "dietary_item_catalog_name_idx" ON "dietary_item_catalog"("name");

-- CreateIndex
CREATE INDEX "dietary_item_catalog_normalizedName_idx" ON "dietary_item_catalog"("normalizedName");

-- CreateIndex
CREATE INDEX "dietary_item_catalog_type_idx" ON "dietary_item_catalog"("type");

-- CreateIndex
CREATE INDEX "dietary_item_catalog_category_idx" ON "dietary_item_catalog"("category");

-- CreateIndex
CREATE INDEX "dietary_item_catalog_isActive_idx" ON "dietary_item_catalog"("isActive");

-- CreateIndex
CREATE INDEX "dietary_item_synonyms_normalizedTerm_idx" ON "dietary_item_synonyms"("normalizedTerm");

-- CreateIndex
CREATE INDEX "dietary_item_synonyms_dietaryItemCatalogId_idx" ON "dietary_item_synonyms"("dietaryItemCatalogId");

-- CreateIndex
CREATE UNIQUE INDEX "dietary_item_synonyms_dietaryItemCatalogId_normalizedTerm_key" ON "dietary_item_synonyms"("dietaryItemCatalogId", "normalizedTerm");

-- CreateIndex
CREATE INDEX "medical_record_dietary_restrictions_dietaryItemCatalogId_idx" ON "medical_record_dietary_restrictions"("dietaryItemCatalogId");

-- AddForeignKey
ALTER TABLE "medical_record_dietary_restrictions" ADD CONSTRAINT "medical_record_dietary_restrictions_dietaryItemCatalogId_fkey" FOREIGN KEY ("dietaryItemCatalogId") REFERENCES "dietary_item_catalog"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dietary_item_synonyms" ADD CONSTRAINT "dietary_item_synonyms_dietaryItemCatalogId_fkey" FOREIGN KEY ("dietaryItemCatalogId") REFERENCES "dietary_item_catalog"("id") ON DELETE CASCADE ON UPDATE CASCADE;
