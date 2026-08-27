-- CreateEnum
CREATE TYPE "BiomarkerReferenceSex" AS ENUM ('ANY', 'MALE', 'FEMALE');

-- CreateTable
CREATE TABLE "biomarker_reference_ranges" (
    "id" UUID NOT NULL,
    "biomarkerCatalogId" UUID NOT NULL,
    "unit" VARCHAR(50) NOT NULL,
    "minAgeYears" INTEGER,
    "maxAgeYears" INTEGER,
    "lowerBound" DECIMAL(18,6),
    "upperBound" DECIMAL(18,6),
    "sex" "BiomarkerReferenceSex" NOT NULL DEFAULT 'ANY',
    "description" VARCHAR(500),
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "biomarker_reference_ranges_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "biomarker_reference_ranges_biomarkerCatalogId_idx" ON "biomarker_reference_ranges"("biomarkerCatalogId");

-- CreateIndex
CREATE INDEX "biomarker_reference_ranges_biomarkerCatalogId_unit_idx" ON "biomarker_reference_ranges"("biomarkerCatalogId", "unit");

-- CreateIndex
CREATE INDEX "biomarker_reference_ranges_active_idx" ON "biomarker_reference_ranges"("active");

-- AddForeignKey
ALTER TABLE "biomarker_reference_ranges" ADD CONSTRAINT "biomarker_reference_ranges_biomarkerCatalogId_fkey" FOREIGN KEY ("biomarkerCatalogId") REFERENCES "biomarker_catalog"("id") ON DELETE CASCADE ON UPDATE CASCADE;
