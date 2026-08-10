-- CreateEnum
CREATE TYPE "LaboratoryResultInterpretation" AS ENUM ('LOW', 'NORMAL', 'HIGH', 'CRITICAL_LOW', 'CRITICAL_HIGH', 'ABNORMAL', 'INCONCLUSIVE');

-- CreateTable
CREATE TABLE "biomarker_catalog" (
    "id" UUID NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "code" VARCHAR(100),
    "defaultUnit" VARCHAR(50),
    "description" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "biomarker_catalog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "laboratory_exams" (
    "id" UUID NOT NULL,
    "organizationId" UUID NOT NULL,
    "medicalRecordId" UUID NOT NULL,
    "patientId" UUID NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "laboratoryName" VARCHAR(200),
    "collectedAt" DATE,
    "resultedAt" DATE,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "laboratory_exams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "laboratory_results" (
    "id" UUID NOT NULL,
    "laboratoryExamId" UUID NOT NULL,
    "biomarkerCatalogId" UUID,
    "name" VARCHAR(200) NOT NULL,
    "value" DECIMAL(18,6),
    "textValue" VARCHAR(500),
    "unit" VARCHAR(50),
    "referenceRange" VARCHAR(200),
    "interpretation" "LaboratoryResultInterpretation",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "laboratory_results_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "biomarker_catalog_name_idx" ON "biomarker_catalog"("name");

-- CreateIndex
CREATE INDEX "biomarker_catalog_code_idx" ON "biomarker_catalog"("code");

-- CreateIndex
CREATE INDEX "biomarker_catalog_active_idx" ON "biomarker_catalog"("active");

-- CreateIndex
CREATE INDEX "laboratory_exams_organizationId_idx" ON "laboratory_exams"("organizationId");

-- CreateIndex
CREATE INDEX "laboratory_exams_medicalRecordId_idx" ON "laboratory_exams"("medicalRecordId");

-- CreateIndex
CREATE INDEX "laboratory_exams_patientId_idx" ON "laboratory_exams"("patientId");

-- CreateIndex
CREATE INDEX "laboratory_exams_organizationId_patientId_idx" ON "laboratory_exams"("organizationId", "patientId");

-- CreateIndex
CREATE INDEX "laboratory_exams_collectedAt_idx" ON "laboratory_exams"("collectedAt");

-- CreateIndex
CREATE INDEX "laboratory_results_laboratoryExamId_idx" ON "laboratory_results"("laboratoryExamId");

-- CreateIndex
CREATE INDEX "laboratory_results_biomarkerCatalogId_idx" ON "laboratory_results"("biomarkerCatalogId");

-- CreateIndex
CREATE INDEX "laboratory_results_name_idx" ON "laboratory_results"("name");

-- CreateIndex
CREATE INDEX "laboratory_results_interpretation_idx" ON "laboratory_results"("interpretation");

-- AddForeignKey
ALTER TABLE "laboratory_exams" ADD CONSTRAINT "laboratory_exams_medicalRecordId_fkey" FOREIGN KEY ("medicalRecordId") REFERENCES "medical_records"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "laboratory_results" ADD CONSTRAINT "laboratory_results_laboratoryExamId_fkey" FOREIGN KEY ("laboratoryExamId") REFERENCES "laboratory_exams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "laboratory_results" ADD CONSTRAINT "laboratory_results_biomarkerCatalogId_fkey" FOREIGN KEY ("biomarkerCatalogId") REFERENCES "biomarker_catalog"("id") ON DELETE SET NULL ON UPDATE CASCADE;
