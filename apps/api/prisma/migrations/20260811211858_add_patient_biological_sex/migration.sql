-- CreateEnum
CREATE TYPE "PatientBiologicalSex" AS ENUM ('MALE', 'FEMALE');

-- AlterTable
ALTER TABLE "patients" ADD COLUMN     "biologicalSex" "PatientBiologicalSex";
