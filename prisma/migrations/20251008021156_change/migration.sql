/*
  Warnings:

  - You are about to alter the column `date_of_birth` on the `babies` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to drop the column `device_id` on the `device_parameters` table. All the data in the column will be lost.
  - You are about to alter the column `assigned_at` on the `patient_rooms` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `discharged_at` on the `patient_rooms` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `date_of_birth` on the `patients` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `date_of_birth` on the `users` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - A unique constraint covering the columns `[device_function]` on the table `device_parameters` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[device_function,parameter]` on the table `device_parameters` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `device_function` to the `device_parameters` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `device_parameters` DROP FOREIGN KEY `device_parameters_device_id_fkey`;

-- DropIndex
DROP INDEX `device_parameters_device_id_parameter_key` ON `device_parameters`;

-- AlterTable
ALTER TABLE `babies` MODIFY `date_of_birth` DATETIME NOT NULL;

-- AlterTable
ALTER TABLE `device_parameters` DROP COLUMN `device_id`,
    ADD COLUMN `device_function` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `patient_rooms` MODIFY `assigned_at` DATETIME NOT NULL,
    MODIFY `discharged_at` DATETIME NULL;

-- AlterTable
ALTER TABLE `patients` MODIFY `date_of_birth` DATETIME NOT NULL;

-- AlterTable
ALTER TABLE `users` MODIFY `date_of_birth` DATETIME NULL;

-- CreateIndex
CREATE UNIQUE INDEX `device_parameters_device_function_key` ON `device_parameters`(`device_function`);

-- CreateIndex
CREATE UNIQUE INDEX `device_parameters_device_function_parameter_key` ON `device_parameters`(`device_function`, `parameter`);

-- AddForeignKey
ALTER TABLE `device_parameters` ADD CONSTRAINT `device_parameters_device_function_fkey` FOREIGN KEY (`device_function`) REFERENCES `devices_connected`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
