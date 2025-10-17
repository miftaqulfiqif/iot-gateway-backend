/*
  Warnings:

  - You are about to alter the column `date_of_birth` on the `babies` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `assigned_at` on the `patient_rooms` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `discharged_at` on the `patient_rooms` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `date_of_birth` on the `patients` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `date_of_birth` on the `users` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to drop the `devicemeasurementtype` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `devicetype` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `devicemeasurementtype` DROP FOREIGN KEY `DeviceMeasurementType_device_id_fkey`;

-- DropForeignKey
ALTER TABLE `devicemeasurementtype` DROP FOREIGN KEY `DeviceMeasurementType_type_id_fkey`;

-- AlterTable
ALTER TABLE `babies` MODIFY `date_of_birth` DATETIME NOT NULL;

-- AlterTable
ALTER TABLE `patient_rooms` MODIFY `assigned_at` DATETIME NOT NULL,
    MODIFY `discharged_at` DATETIME NULL;

-- AlterTable
ALTER TABLE `patients` MODIFY `date_of_birth` DATETIME NOT NULL;

-- AlterTable
ALTER TABLE `users` MODIFY `date_of_birth` DATETIME NULL;

-- DropTable
DROP TABLE `devicemeasurementtype`;

-- DropTable
DROP TABLE `devicetype`;

-- CreateTable
CREATE TABLE `device_parameters` (
    `id` VARCHAR(191) NOT NULL,
    `device_id` VARCHAR(191) NOT NULL,
    `parameter` ENUM('BODY_WEIGHT', 'BODY_TEMPERATURE', 'BLOOD_PRESSURE_SYSTOLIC', 'BLOOD_PRESSURE_DIASTOLIC', 'BLOOD_PRESSURE_MEAN', 'HEART_RATE', 'SPO2', 'RESPIRATORY_RATE', 'HEIGHT', 'BMI') NOT NULL,

    UNIQUE INDEX `device_parameters_device_id_parameter_key`(`device_id`, `parameter`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `device_parameters` ADD CONSTRAINT `device_parameters_device_id_fkey` FOREIGN KEY (`device_id`) REFERENCES `devices_connected`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
