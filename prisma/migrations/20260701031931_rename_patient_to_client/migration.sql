-- RenameTable
ALTER TABLE "Patient" RENAME TO "Client";

-- RenameForeignKey
ALTER TABLE "Client" RENAME CONSTRAINT "Patient_pkey" TO "Client_pkey";
ALTER TABLE "Client" RENAME CONSTRAINT "Patient_therapistId_fkey" TO "Client_therapistId_fkey";
