/*
  Warnings:

  - You are about to alter the column `date_of_birth` on the `babies` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to drop the column `type_id` on the `devices_connected` table. All the data in the column will be lost.
  - You are about to drop the column `device_id` on the `devicetype` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `devicetype` table. All the data in the column will be lost.
  - You are about to alter the column `assigned_at` on the `patient_rooms` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `discharged_at` on the `patient_rooms` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `date_of_birth` on the `patients` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `date_of_birth` on the `users` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - A unique constraint covering the columns `[name]` on the table `DeviceType` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `DeviceType` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `devicetype` DROP FOREIGN KEY `DeviceType_device_id_fkey`;

-- DropIndex
DROP INDEX `DeviceType_device_id_fkey` ON `devicetype`;

-- AlterTable
ALTER TABLE `babies` MODIFY `date_of_birth` DATETIME NOT NULL;

-- AlterTable
ALTER TABLE `devices_connected` DROP COLUMN `type_id`;

-- AlterTable
ALTER TABLE `devicetype` DROP COLUMN `device_id`,
    DROP COLUMN `type`,
    ADD COLUMN `name` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `patient_rooms` MODIFY `assigned_at` DATETIME NOT NULL,
    MODIFY `discharged_at` DATETIME NULL;

-- AlterTable
ALTER TABLE `patients` MODIFY `date_of_birth` DATETIME NOT NULL;

-- AlterTable
ALTER TABLE `users` MODIFY `date_of_birth` DATETIME NULL;

-- CreateTable
CREATE TABLE `DeviceMeasurementType` (
    `device_id` VARCHAR(191) NOT NULL,
    `measurement_id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`device_id`, `measurement_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `DeviceType_name_key` ON `DeviceType`(`name`);

-- AddForeignKey
ALTER TABLE `DeviceMeasurementType` ADD CONSTRAINT `DeviceMeasurementType_device_id_fkey` FOREIGN KEY (`device_id`) REFERENCES `devices_connected`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DeviceMeasurementType` ADD CONSTRAINT `DeviceMeasurementType_measurement_id_fkey` FOREIGN KEY (`measurement_id`) REFERENCES `DeviceType`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
