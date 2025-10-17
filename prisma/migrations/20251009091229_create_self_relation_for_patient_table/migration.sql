/*
  Warnings:

  - You are about to alter the column `date_of_birth` on the `babies` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `assigned_at` on the `patient_rooms` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `discharged_at` on the `patient_rooms` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to drop the column `height` on the `patients` table. All the data in the column will be lost.
  - You are about to alter the column `date_of_birth` on the `patients` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `date_of_birth` on the `users` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.

*/
-- DropForeignKey
ALTER TABLE `babies` DROP FOREIGN KEY `babies_patient_id_fkey`;

-- DropIndex
DROP INDEX `babies_patient_id_fkey` ON `babies`;

-- AlterTable
ALTER TABLE `babies` MODIFY `date_of_birth` DATETIME NOT NULL;

-- AlterTable
ALTER TABLE `patient_rooms` MODIFY `assigned_at` DATETIME NOT NULL,
    MODIFY `discharged_at` DATETIME NULL;

-- AlterTable
ALTER TABLE `patients` DROP COLUMN `height`,
    ADD COLUMN `mother_id` VARCHAR(191) NULL,
    ADD COLUMN `parent_id` VARCHAR(191) NULL,
    MODIFY `date_of_birth` DATETIME NOT NULL;

-- AlterTable
ALTER TABLE `users` MODIFY `date_of_birth` DATETIME NULL;

-- AddForeignKey
ALTER TABLE `patients` ADD CONSTRAINT `patients_mother_id_fkey` FOREIGN KEY (`mother_id`) REFERENCES `patients`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
