/*
  Warnings:

  - You are about to alter the column `date_of_birth` on the `babies` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `assigned_at` on the `patient_rooms` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `discharged_at` on the `patient_rooms` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `date_of_birth` on the `patients` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `date_of_birth` on the `users` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to drop the `historiesmeasurement` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `historiesmeasurement` DROP FOREIGN KEY `HistoriesMeasurement_patient_handler_id_fkey`;

-- AlterTable
ALTER TABLE `babies` MODIFY `date_of_birth` DATETIME NOT NULL;

-- AlterTable
ALTER TABLE `device_parameters` MODIFY `parameter` ENUM('BODY_WEIGHT', 'HEIGHT', 'BMI', 'BODY_TEMPERATURE', 'BLOOD_PRESSURE_SYSTOLIC', 'BLOOD_PRESSURE_DIASTOLIC', 'BLOOD_PRESSURE_MEAN', 'HEART_RATE', 'FETAL_HEART_RATE', 'PULSE_RATE', 'RESPIRATORY_RATE', 'SPO2', 'BODY_FAT_PERCENTAGE', 'MUSCLE_MASS', 'VISCERAL_FAT', 'BONE_MASS', 'BODY_WATER_PERCENTAGE', 'BASAL_METABOLIC_RATE', 'PROTEIN_PERCENTAGE', 'LEAN_BODY_MASS', 'BODY_AGE', 'OBESITY_LEVEL', 'ECG', 'PLETHYSMOGRAM', 'OTHER') NOT NULL;

-- AlterTable
ALTER TABLE `patient_rooms` MODIFY `assigned_at` DATETIME NOT NULL,
    MODIFY `discharged_at` DATETIME NULL;

-- AlterTable
ALTER TABLE `patients` MODIFY `date_of_birth` DATETIME NOT NULL;

-- AlterTable
ALTER TABLE `users` MODIFY `date_of_birth` DATETIME NULL;

-- DropTable
DROP TABLE `historiesmeasurement`;

-- CreateTable
CREATE TABLE `histories_measurement` (
    `id` VARCHAR(191) NOT NULL,
    `patient_handler_id` VARCHAR(191) NOT NULL,
    `parameter` VARCHAR(191) NOT NULL,
    `value` VARCHAR(191) NOT NULL,
    `room` VARCHAR(191) NOT NULL,
    `recorded_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `histories_measurement` ADD CONSTRAINT `histories_measurement_patient_handler_id_fkey` FOREIGN KEY (`patient_handler_id`) REFERENCES `patient_handlers`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
