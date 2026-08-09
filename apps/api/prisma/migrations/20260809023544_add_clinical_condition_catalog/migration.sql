-- CreateTable
CREATE TABLE "clinical_condition_catalog" (
    "id" UUID NOT NULL,
    "code" VARCHAR(50),
    "name" VARCHAR(200) NOT NULL,
    "normalizedName" VARCHAR(200) NOT NULL,
    "category" VARCHAR(100),
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "clinical_condition_catalog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clinical_condition_synonyms" (
    "id" UUID NOT NULL,
    "clinicalConditionId" UUID NOT NULL,
    "term" VARCHAR(200) NOT NULL,
    "normalizedTerm" VARCHAR(200) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "clinical_condition_synonyms_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "clinical_condition_catalog_code_key" ON "clinical_condition_catalog"("code");

-- CreateIndex
CREATE UNIQUE INDEX "clinical_condition_catalog_normalizedName_key" ON "clinical_condition_catalog"("normalizedName");

-- CreateIndex
CREATE INDEX "clinical_condition_catalog_name_idx" ON "clinical_condition_catalog"("name");

-- CreateIndex
CREATE INDEX "clinical_condition_catalog_category_idx" ON "clinical_condition_catalog"("category");

-- CreateIndex
CREATE INDEX "clinical_condition_catalog_isActive_idx" ON "clinical_condition_catalog"("isActive");

-- CreateIndex
CREATE INDEX "clinical_condition_synonyms_normalizedTerm_idx" ON "clinical_condition_synonyms"("normalizedTerm");

-- CreateIndex
CREATE INDEX "clinical_condition_synonyms_clinicalConditionId_idx" ON "clinical_condition_synonyms"("clinicalConditionId");

-- CreateIndex
CREATE UNIQUE INDEX "clinical_condition_synonyms_clinicalConditionId_normalizedT_key" ON "clinical_condition_synonyms"("clinicalConditionId", "normalizedTerm");

-- AddForeignKey
ALTER TABLE "clinical_condition_synonyms" ADD CONSTRAINT "clinical_condition_synonyms_clinicalConditionId_fkey" FOREIGN KEY ("clinicalConditionId") REFERENCES "clinical_condition_catalog"("id") ON DELETE CASCADE ON UPDATE CASCADE;
