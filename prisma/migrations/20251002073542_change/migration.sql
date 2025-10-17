/*
  Warnings:

  - You are about to alter the column `date_of_birth` on the `babies` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to drop the column `hospital_id` on the `iot_gateways` table. All the data in the column will be lost.
  - You are about to alter the column `assigned_at` on the `patient_rooms` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `discharged_at` on the `patient_rooms` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `date_of_birth` on the `patients` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `date_of_birth` on the `users` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.

*/
-- DropForeignKey
ALTER TABLE `iot_gateways` DROP FOREIGN KEY `iot_gateways_hospital_id_fkey`;

-- DropIndex
DROP INDEX `iot_gateways_hospital_id_fkey` ON `iot_gateways`;

-- AlterTable
ALTER TABLE `babies` MODIFY `date_of_birth` DATETIME NOT NULL;

-- AlterTable
ALTER TABLE `iot_gateways` DROP COLUMN `hospital_id`,
    ADD COLUMN `firmware` VARCHAR(50) NULL,
    ADD COLUMN `room_id` VARCHAR(191) NULL,
    ADD COLUMN `status` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `uptime` VARCHAR(255) NULL;

-- AlterTable
ALTER TABLE `patient_rooms` MODIFY `assigned_at` DATETIME NOT NULL,
    MODIFY `discharged_at` DATETIME NULL;

-- AlterTable
ALTER TABLE `patients` MODIFY `date_of_birth` DATETIME NOT NULL;

-- AlterTable
ALTER TABLE `users` MODIFY `date_of_birth` DATETIME NULL;

-- AddForeignKey
ALTER TABLE `iot_gateways` ADD CONSTRAINT `iot_gateways_room_id_fkey` FOREIGN KEY (`room_id`) REFERENCES `rooms`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
