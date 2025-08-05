/*
  Warnings:

  - You are about to alter the column `date_of_birth` on the `babies` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - The primary key for the `iot_gateways` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `assigned_at` on the `patient_rooms` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `discharged_at` on the `patient_rooms` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `date_of_birth` on the `patients` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to drop the `admins` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `doctors` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `nurses` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `address_id` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gender` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `admins` DROP FOREIGN KEY `admins_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `devices_connected` DROP FOREIGN KEY `devices_connected_hospital_id_fkey`;

-- DropForeignKey
ALTER TABLE `doctors` DROP FOREIGN KEY `doctors_address_id_fkey`;

-- DropForeignKey
ALTER TABLE `doctors` DROP FOREIGN KEY `doctors_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `nurses` DROP FOREIGN KEY `nurses_address_id_fkey`;

-- DropForeignKey
ALTER TABLE `nurses` DROP FOREIGN KEY `nurses_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `rooms` DROP FOREIGN KEY `rooms_doctor_id_fkey`;

-- DropForeignKey
ALTER TABLE `rooms` DROP FOREIGN KEY `rooms_nurse_manager_fkey`;

-- DropIndex
DROP INDEX `devices_connected_hospital_id_fkey` ON `devices_connected`;

-- DropIndex
DROP INDEX `rooms_doctor_id_fkey` ON `rooms`;

-- DropIndex
DROP INDEX `rooms_nurse_manager_fkey` ON `rooms`;

-- AlterTable
ALTER TABLE `babies` MODIFY `date_of_birth` DATETIME NOT NULL;

-- AlterTable
ALTER TABLE `iot_gateways` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(255) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `patient_rooms` MODIFY `assigned_at` DATETIME NOT NULL,
    MODIFY `discharged_at` DATETIME NULL;

-- AlterTable
ALTER TABLE `patients` MODIFY `date_of_birth` DATETIME NOT NULL;

-- AlterTable
ALTER TABLE `users` ADD COLUMN `address_id` VARCHAR(191) NOT NULL,
    ADD COLUMN `date_of_birth` DATETIME NULL,
    ADD COLUMN `experience` VARCHAR(10) NULL,
    ADD COLUMN `gender` ENUM('male', 'female', 'other') NOT NULL,
    ADD COLUMN `ihs_number` VARCHAR(100) NULL,
    ADD COLUMN `last_education` VARCHAR(255) NULL,
    ADD COLUMN `name` VARCHAR(255) NOT NULL,
    ADD COLUMN `nik` VARCHAR(50) NULL,
    ADD COLUMN `place_of_birth` VARCHAR(255) NULL,
    ADD COLUMN `speciality` VARCHAR(255) NULL;

-- DropTable
DROP TABLE `admins`;

-- DropTable
DROP TABLE `doctors`;

-- DropTable
DROP TABLE `nurses`;

-- CreateTable
CREATE TABLE `satu_sehat_env` (
    `id` VARCHAR(191) NOT NULL,
    `organization_id` LONGTEXT NULL,
    `client_id` LONGTEXT NULL,
    `client_secret` LONGTEXT NULL,
    `token` LONGTEXT NULL,
    `hospital_id` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `satu_sehat_env_hospital_id_key`(`hospital_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `satu_sehat_env` ADD CONSTRAINT `satu_sehat_env_hospital_id_fkey` FOREIGN KEY (`hospital_id`) REFERENCES `hospitals`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_address_id_fkey` FOREIGN KEY (`address_id`) REFERENCES `addresses`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
