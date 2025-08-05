/*
  Warnings:

  - The values [MALE,FEMALE,OTHER] on the enum `babies_gender` will be removed. If these variants are still used in the database, this will fail.
  - You are about to alter the column `date_of_birth` on the `babies` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to drop the column `address` on the `doctors` table. All the data in the column will be lost.
  - You are about to drop the column `nid` on the `doctors` table. All the data in the column will be lost.
  - You are about to alter the column `date_of_birth` on the `doctors` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - The values [MALE,FEMALE,OTHER] on the enum `babies_gender` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `address` on the `nurses` table. All the data in the column will be lost.
  - You are about to alter the column `date_of_birth` on the `nurses` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - The values [MALE,FEMALE,OTHER] on the enum `babies_gender` will be removed. If these variants are still used in the database, this will fail.
  - You are about to alter the column `assigned_at` on the `patient_rooms` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `discharged_at` on the `patient_rooms` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - The values [MALE,FEMALE,OTHER] on the enum `babies_gender` will be removed. If these variants are still used in the database, this will fail.
  - You are about to alter the column `date_of_birth` on the `patients` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - A unique constraint covering the columns `[nik]` on the table `doctors` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[ihs_number]` on the table `doctors` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `city` to the `addresses` table without a default value. This is not possible if the table is not empty.
  - Made the column `rt` on table `addresses` required. This step will fail if there are existing NULL values in that column.
  - Made the column `rw` on table `addresses` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `address_id` to the `doctors` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nik` to the `doctors` table without a default value. This is not possible if the table is not empty.
  - Added the required column `address_id` to the `nurses` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `doctors_nid_key` ON `doctors`;

-- AlterTable
ALTER TABLE `addresses` ADD COLUMN `city` VARCHAR(255) NOT NULL,
    MODIFY `rt` VARCHAR(3) NOT NULL,
    MODIFY `rw` VARCHAR(3) NOT NULL;

-- AlterTable
ALTER TABLE `babies` MODIFY `gender` ENUM('male', 'female', 'other') NOT NULL,
    MODIFY `date_of_birth` DATETIME NOT NULL;

-- AlterTable
ALTER TABLE `doctors` DROP COLUMN `address`,
    DROP COLUMN `nid`,
    ADD COLUMN `address_id` VARCHAR(191) NOT NULL,
    ADD COLUMN `ihs_number` VARCHAR(191) NULL,
    ADD COLUMN `nik` VARCHAR(191) NOT NULL,
    MODIFY `date_of_birth` DATETIME NOT NULL,
    MODIFY `gender` ENUM('male', 'female', 'other') NOT NULL,
    MODIFY `last_education` VARCHAR(255) NULL,
    MODIFY `experience_of_years` VARCHAR(10) NULL,
    MODIFY `specialty` VARCHAR(255) NULL;

-- AlterTable
ALTER TABLE `nurses` DROP COLUMN `address`,
    ADD COLUMN `address_id` VARCHAR(191) NOT NULL,
    MODIFY `date_of_birth` DATETIME NOT NULL,
    MODIFY `gender` ENUM('male', 'female', 'other') NOT NULL;

-- AlterTable
ALTER TABLE `patient_rooms` MODIFY `assigned_at` DATETIME NOT NULL,
    MODIFY `discharged_at` DATETIME NULL;

-- AlterTable
ALTER TABLE `patients` MODIFY `gender` ENUM('male', 'female', 'other') NOT NULL,
    MODIFY `date_of_birth` DATETIME NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `doctors_nik_key` ON `doctors`(`nik`);

-- CreateIndex
CREATE UNIQUE INDEX `doctors_ihs_number_key` ON `doctors`(`ihs_number`);

-- AddForeignKey
ALTER TABLE `doctors` ADD CONSTRAINT `doctors_address_id_fkey` FOREIGN KEY (`address_id`) REFERENCES `addresses`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `nurses` ADD CONSTRAINT `nurses_address_id_fkey` FOREIGN KEY (`address_id`) REFERENCES `addresses`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
