-- CreateEnum
CREATE TYPE "SkinfoldMeasurementSide" AS ENUM ('RIGHT', 'LEFT');

-- CreateEnum
CREATE TYPE "SkinfoldSite" AS ENUM ('CHEST', 'MIDAXILLARY', 'TRICEPS', 'SUBSCAPULAR', 'ABDOMEN', 'SUPRAILIAC', 'THIGH', 'BICEPS', 'SUPRASPINALE', 'CALF', 'OTHER');

-- CreateEnum
CREATE TYPE "SkinfoldProtocol" AS ENUM ('JACKSON_POLLOCK_3', 'JACKSON_POLLOCK_7', 'OTHER');

-- AlterTable
ALTER TABLE "anthropometric_assessments" ADD COLUMN     "skinfoldProtocol" "SkinfoldProtocol";

-- CreateTable
CREATE TABLE "anthropometric_skinfold_measurements" (
    "id" UUID NOT NULL,
    "anthropometricAssessmentId" UUID NOT NULL,
    "site" "SkinfoldSite" NOT NULL,
    "side" "SkinfoldMeasurementSide" NOT NULL DEFAULT 'RIGHT',
    "readingNumber" INTEGER NOT NULL,
    "valueMm" DECIMAL(6,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "anthropometric_skinfold_measurements_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "anthropometric_skinfold_measurements_anthropometricAssessme_idx" ON "anthropometric_skinfold_measurements"("anthropometricAssessmentId");

-- CreateIndex
CREATE INDEX "anthropometric_skinfold_measurements_site_idx" ON "anthropometric_skinfold_measurements"("site");

-- CreateIndex
CREATE INDEX "anthropometric_skinfold_measurements_side_idx" ON "anthropometric_skinfold_measurements"("side");

-- CreateIndex
CREATE UNIQUE INDEX "anthropometric_skinfold_measurements_anthropometricAssessme_key" ON "anthropometric_skinfold_measurements"("anthropometricAssessmentId", "site", "side", "readingNumber");

-- AddForeignKey
ALTER TABLE "anthropometric_skinfold_measurements" ADD CONSTRAINT "anthropometric_skinfold_measurements_anthropometricAssessm_fkey" FOREIGN KEY ("anthropometricAssessmentId") REFERENCES "anthropometric_assessments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
