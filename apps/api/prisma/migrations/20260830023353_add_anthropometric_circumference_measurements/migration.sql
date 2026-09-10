-- CreateEnum
CREATE TYPE "AnthropometricCircumferenceSite" AS ENUM ('NECK', 'SHOULDERS', 'CHEST', 'WAIST', 'ABDOMEN', 'HIP', 'ARM', 'FOREARM', 'THIGH', 'CALF', 'OTHER');

-- CreateEnum
CREATE TYPE "AnthropometricMeasurementSide" AS ENUM ('RIGHT', 'LEFT', 'NOT_APPLICABLE');

-- CreateEnum
CREATE TYPE "AnthropometricCircumferenceState" AS ENUM ('RELAXED', 'CONTRACTED', 'NOT_APPLICABLE');

-- CreateTable
CREATE TABLE "anthropometric_circumference_measurements" (
    "id" UUID NOT NULL,
    "anthropometricAssessmentId" UUID NOT NULL,
    "site" "AnthropometricCircumferenceSite" NOT NULL,
    "side" "AnthropometricMeasurementSide" NOT NULL DEFAULT 'NOT_APPLICABLE',
    "state" "AnthropometricCircumferenceState" NOT NULL DEFAULT 'NOT_APPLICABLE',
    "valueCm" DECIMAL(6,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "anthropometric_circumference_measurements_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "anthropometric_circumference_measurements_anthropometricAss_idx" ON "anthropometric_circumference_measurements"("anthropometricAssessmentId");

-- CreateIndex
CREATE INDEX "anthropometric_circumference_measurements_site_idx" ON "anthropometric_circumference_measurements"("site");

-- CreateIndex
CREATE INDEX "anthropometric_circumference_measurements_side_idx" ON "anthropometric_circumference_measurements"("side");

-- CreateIndex
CREATE UNIQUE INDEX "anthropometric_circumference_measurements_anthropometricAss_key" ON "anthropometric_circumference_measurements"("anthropometricAssessmentId", "site", "side", "state");

-- AddForeignKey
ALTER TABLE "anthropometric_circumference_measurements" ADD CONSTRAINT "anthropometric_circumference_measurements_anthropometricAs_fkey" FOREIGN KEY ("anthropometricAssessmentId") REFERENCES "anthropometric_assessments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
