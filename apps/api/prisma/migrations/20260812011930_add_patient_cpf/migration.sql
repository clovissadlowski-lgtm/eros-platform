/*
  Warnings:

  - A unique constraint covering the columns `[organizationId,cpf]` on the table `patients` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "patients" ADD COLUMN     "cpf" VARCHAR(11);

-- CreateIndex
CREATE UNIQUE INDEX "patients_organizationId_cpf_key" ON "patients"("organizationId", "cpf");
