/*
  Warnings:

  - You are about to alter the column `date_of_birth` on the `babies` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `date_of_birth` on the `doctors` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `date_of_birth` on the `nurses` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `assigned_at` on the `patient_rooms` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `discharged_at` on the `patient_rooms` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `date_of_birth` on the `patients` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to drop the `districts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `provinces` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `regencies` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `villages` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `addresses` DROP FOREIGN KEY `addresses_district_id_fkey`;

-- DropForeignKey
ALTER TABLE `addresses` DROP FOREIGN KEY `addresses_regency_id_fkey`;

-- DropForeignKey
ALTER TABLE `addresses` DROP FOREIGN KEY `addresses_village_id_fkey`;

-- DropForeignKey
ALTER TABLE `districts` DROP FOREIGN KEY `districts_regency_id_fkey`;

-- DropForeignKey
ALTER TABLE `regencies` DROP FOREIGN KEY `regencies_province_id_fkey`;

-- DropForeignKey
ALTER TABLE `villages` DROP FOREIGN KEY `villages_district_id_fkey`;

-- DropIndex
DROP INDEX `addresses_district_id_fkey` ON `addresses`;

-- DropIndex
DROP INDEX `addresses_regency_id_fkey` ON `addresses`;

-- DropIndex
DROP INDEX `addresses_village_id_fkey` ON `addresses`;

-- AlterTable
ALTER TABLE `babies` MODIFY `date_of_birth` DATETIME NOT NULL;

-- AlterTable
ALTER TABLE `doctors` MODIFY `date_of_birth` DATETIME NOT NULL;

-- AlterTable
ALTER TABLE `nurses` MODIFY `date_of_birth` DATETIME NOT NULL;

-- AlterTable
ALTER TABLE `patient_rooms` MODIFY `assigned_at` DATETIME NOT NULL,
    MODIFY `discharged_at` DATETIME NULL;

-- AlterTable
ALTER TABLE `patients` MODIFY `date_of_birth` DATETIME NOT NULL;

-- DropTable
DROP TABLE `districts`;

-- DropTable
DROP TABLE `provinces`;

-- DropTable
DROP TABLE `regencies`;

-- DropTable
DROP TABLE `villages`;
