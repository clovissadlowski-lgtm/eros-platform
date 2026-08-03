/*
  Warnings:

  - A unique constraint covering the columns `[organizationId,email]` on the table `patients` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "patients_email_key";

-- CreateIndex
CREATE UNIQUE INDEX "patients_organizationId_email_key" ON "patients"("organizationId", "email");

-- AddForeignKey
ALTER TABLE "patients" ADD CONSTRAINT "patients_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
