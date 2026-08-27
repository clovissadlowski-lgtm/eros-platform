-- CreateEnum
CREATE TYPE "BiomarkerReferenceContext" AS ENUM ('GENERAL', 'FASTING', 'NON_FASTING');

-- AlterTable
ALTER TABLE "biomarker_reference_ranges" ADD COLUMN     "context" "BiomarkerReferenceContext" NOT NULL DEFAULT 'GENERAL',
ADD COLUMN     "sourceName" VARCHAR(200),
ADD COLUMN     "sourceNote" VARCHAR(500),
ADD COLUMN     "sourceUrl" VARCHAR(500);
