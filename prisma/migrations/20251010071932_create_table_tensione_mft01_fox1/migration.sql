/*
  Warnings:

  - You are about to alter the column `date_of_birth` on the `babies` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `assigned_at` on the `patient_rooms` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `discharged_at` on the `patient_rooms` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `date_of_birth` on the `patients` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `date_of_birth` on the `users` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.

*/
-- AlterTable
ALTER TABLE `babies` MODIFY `date_of_birth` DATETIME NOT NULL;

-- AlterTable
ALTER TABLE `patient_rooms` MODIFY `assigned_at` DATETIME NOT NULL,
    MODIFY `discharged_at` DATETIME NULL;

-- AlterTable
ALTER TABLE `patients` MODIFY `date_of_birth` DATETIME NOT NULL;

-- AlterTable
ALTER TABLE `users` MODIFY `date_of_birth` DATETIME NULL;

-- CreateTable
CREATE TABLE `measurement_histories_mft01` (
    `id` VARCHAR(191) NOT NULL,
    `temperature` FLOAT NOT NULL,
    `recorded_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `patient_handler_id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `measurement_histories_tensione` (
    `id` VARCHAR(191) NOT NULL,
    `systolic` FLOAT NOT NULL,
    `diastolic` FLOAT NOT NULL,
    `map` FLOAT NOT NULL,
    `pulse_rate` FLOAT NOT NULL,
    `spo2` FLOAT NOT NULL,
    `patient_handler_id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `measurement_histories_pulse_oximeter_fox_1` (
    `id` VARCHAR(191) NOT NULL,
    `spo2` FLOAT NOT NULL,
    `recorded_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `patient_handler_id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `measurement_histories_mft01` ADD CONSTRAINT `measurement_histories_mft01_patient_handler_id_fkey` FOREIGN KEY (`patient_handler_id`) REFERENCES `patient_handlers`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `measurement_histories_tensione` ADD CONSTRAINT `measurement_histories_tensione_patient_handler_id_fkey` FOREIGN KEY (`patient_handler_id`) REFERENCES `patient_handlers`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `measurement_histories_pulse_oximeter_fox_1` ADD CONSTRAINT `measurement_histories_pulse_oximeter_fox_1_patient_handler__fkey` FOREIGN KEY (`patient_handler_id`) REFERENCES `patient_handlers`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
