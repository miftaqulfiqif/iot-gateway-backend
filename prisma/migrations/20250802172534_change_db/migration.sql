/*
  Warnings:

  - You are about to alter the column `date_of_birth` on the `babies` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `regency_id` on the `districts` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Char(4)`.
  - You are about to alter the column `date_of_birth` on the `doctors` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `date_of_birth` on the `nurses` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `assigned_at` on the `patient_rooms` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `discharged_at` on the `patient_rooms` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `date_of_birth` on the `patients` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `province_id` on the `regencies` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Char(2)`.
  - You are about to alter the column `district_id` on the `villages` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Char(7)`.

*/
-- DropForeignKey
ALTER TABLE `districts` DROP FOREIGN KEY `districts_regency_id_fkey`;

-- DropForeignKey
ALTER TABLE `regencies` DROP FOREIGN KEY `regencies_province_id_fkey`;

-- DropForeignKey
ALTER TABLE `villages` DROP FOREIGN KEY `villages_district_id_fkey`;

-- DropIndex
DROP INDEX `districts_regency_id_fkey` ON `districts`;

-- DropIndex
DROP INDEX `regencies_province_id_fkey` ON `regencies`;

-- DropIndex
DROP INDEX `villages_district_id_fkey` ON `villages`;

-- AlterTable
ALTER TABLE `babies` MODIFY `date_of_birth` DATETIME NOT NULL;

-- AlterTable
ALTER TABLE `districts` MODIFY `name` VARCHAR(255) NOT NULL,
    MODIFY `regency_id` CHAR(4) NOT NULL;

-- AlterTable
ALTER TABLE `doctors` MODIFY `date_of_birth` DATETIME NOT NULL;

-- AlterTable
ALTER TABLE `nurses` MODIFY `date_of_birth` DATETIME NOT NULL;

-- AlterTable
ALTER TABLE `patient_rooms` MODIFY `assigned_at` DATETIME NOT NULL,
    MODIFY `discharged_at` DATETIME NULL;

-- AlterTable
ALTER TABLE `patients` MODIFY `date_of_birth` DATETIME NOT NULL;

-- AlterTable
ALTER TABLE `provinces` MODIFY `name` VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE `regencies` MODIFY `name` VARCHAR(255) NOT NULL,
    MODIFY `province_id` CHAR(2) NOT NULL;

-- AlterTable
ALTER TABLE `villages` MODIFY `name` VARCHAR(255) NOT NULL,
    MODIFY `district_id` CHAR(7) NOT NULL;

-- AddForeignKey
ALTER TABLE `regencies` ADD CONSTRAINT `regencies_province_id_fkey` FOREIGN KEY (`province_id`) REFERENCES `provinces`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `districts` ADD CONSTRAINT `districts_regency_id_fkey` FOREIGN KEY (`regency_id`) REFERENCES `regencies`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `villages` ADD CONSTRAINT `villages_district_id_fkey` FOREIGN KEY (`district_id`) REFERENCES `districts`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
