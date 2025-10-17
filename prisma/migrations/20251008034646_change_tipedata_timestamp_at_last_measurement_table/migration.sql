/*
  Warnings:

  - You are about to alter the column `date_of_birth` on the `babies` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `timestamp_blood_pressure` on the `last_measurement_patients` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `DateTime(3)`.
  - You are about to alter the column `timestamp_body_height` on the `last_measurement_patients` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `DateTime(3)`.
  - You are about to alter the column `timestamp_body_temperature` on the `last_measurement_patients` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `DateTime(3)`.
  - You are about to alter the column `timestamp_body_weight` on the `last_measurement_patients` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `DateTime(3)`.
  - You are about to alter the column `timestamp_spo2` on the `last_measurement_patients` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `DateTime(3)`.
  - You are about to alter the column `assigned_at` on the `patient_rooms` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `discharged_at` on the `patient_rooms` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `date_of_birth` on the `patients` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `date_of_birth` on the `users` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.

*/
-- AlterTable
ALTER TABLE `babies` MODIFY `date_of_birth` DATETIME NOT NULL;

-- AlterTable
ALTER TABLE `last_measurement_patients` MODIFY `timestamp_blood_pressure` DATETIME(3) NULL,
    MODIFY `timestamp_body_height` DATETIME(3) NULL,
    MODIFY `timestamp_body_temperature` DATETIME(3) NULL,
    MODIFY `timestamp_body_weight` DATETIME(3) NULL,
    MODIFY `timestamp_spo2` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `patient_rooms` MODIFY `assigned_at` DATETIME NOT NULL,
    MODIFY `discharged_at` DATETIME NULL;

-- AlterTable
ALTER TABLE `patients` MODIFY `date_of_birth` DATETIME NOT NULL;

-- AlterTable
ALTER TABLE `users` MODIFY `date_of_birth` DATETIME NULL;
