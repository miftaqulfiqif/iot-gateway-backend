/*
  Warnings:

  - A unique constraint covering the columns `[nik]` on the table `patients` will be added. If there are existing duplicate values, this will fail.
  - The required column `nik` was added to the `patients` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE `patients` ADD COLUMN `nik` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `patients_nik_key` ON `patients`(`nik`);
