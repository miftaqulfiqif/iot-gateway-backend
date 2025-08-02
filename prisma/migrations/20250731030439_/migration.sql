/*
  Warnings:

  - You are about to alter the column `gender` on the `babies` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(3))`.
  - You are about to alter the column `date_of_birth` on the `babies` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `DateTime`.
  - You are about to alter the column `place_of_birth` on the `babies` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(50)`.
  - You are about to drop the column `device` on the `devices_connected` table. All the data in the column will be lost.
  - You are about to alter the column `connection` on the `devices_connected` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(2))`.
  - You are about to alter the column `device_function` on the `devices_connected` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(100)`.
  - The primary key for the `measurement-histories_doppler` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `device_id` on the `measurement-histories_doppler` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `measurement-histories_doppler` table. All the data in the column will be lost.
  - You are about to drop the column `timestamp` on the `measurement-histories_doppler` table. All the data in the column will be lost.
  - You are about to alter the column `heart_rate` on the `measurement-histories_doppler` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Float`.
  - The primary key for the `measurement_histories_digit_pro_baby` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `device_id` on the `measurement_histories_digit_pro_baby` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `measurement_histories_digit_pro_baby` table. All the data in the column will be lost.
  - You are about to drop the column `timestamp` on the `measurement_histories_digit_pro_baby` table. All the data in the column will be lost.
  - The primary key for the `measurement_histories_digit_pro_bmi` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `device_id` on the `measurement_histories_digit_pro_bmi` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `measurement_histories_digit_pro_bmi` table. All the data in the column will be lost.
  - You are about to drop the column `timestamp` on the `measurement_histories_digit_pro_bmi` table. All the data in the column will be lost.
  - You are about to alter the column `weight` on the `measurement_histories_digit_pro_bmi` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Float`.
  - You are about to alter the column `age` on the `measurement_histories_digit_pro_bmi` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Float`.
  - You are about to alter the column `bmi` on the `measurement_histories_digit_pro_bmi` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Float`.
  - You are about to alter the column `water` on the `measurement_histories_digit_pro_bmi` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Float`.
  - You are about to alter the column `metabolism` on the `measurement_histories_digit_pro_bmi` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Float`.
  - You are about to alter the column `protein` on the `measurement_histories_digit_pro_bmi` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Float`.
  - You are about to alter the column `obesity` on the `measurement_histories_digit_pro_bmi` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Float`.
  - You are about to alter the column `lbm` on the `measurement_histories_digit_pro_bmi` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Float`.
  - You are about to alter the column `body_age` on the `measurement_histories_digit_pro_bmi` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Float`.
  - You are about to alter the column `body_fat` on the `measurement_histories_digit_pro_bmi` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Float`.
  - You are about to alter the column `bone_mass` on the `measurement_histories_digit_pro_bmi` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Float`.
  - You are about to alter the column `muscle_mass` on the `measurement_histories_digit_pro_bmi` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Float`.
  - You are about to alter the column `visceral_fat` on the `measurement_histories_digit_pro_bmi` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Float`.
  - The primary key for the `measurement_histories_digit_pro_ida` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `device_id` on the `measurement_histories_digit_pro_ida` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `measurement_histories_digit_pro_ida` table. All the data in the column will be lost.
  - You are about to drop the column `timestamp` on the `measurement_histories_digit_pro_ida` table. All the data in the column will be lost.
  - You are about to drop the column `hospital_id` on the `patient_handlers` table. All the data in the column will be lost.
  - You are about to drop the column `age` on the `patients` table. All the data in the column will be lost.
  - You are about to drop the column `last_education` on the `patients` table. All the data in the column will be lost.
  - You are about to drop the column `religion` on the `patients` table. All the data in the column will be lost.
  - You are about to drop the column `work` on the `patients` table. All the data in the column will be lost.
  - You are about to alter the column `place_of_birth` on the `patients` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(50)`.
  - You are about to alter the column `date_of_birth` on the `patients` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `DateTime`.
  - You are about to alter the column `phone` on the `patients` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(16)`.
  - The primary key for the `roles` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `email` on the `users` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(50)`.
  - You are about to alter the column `phone` on the `users` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(16)`.
  - You are about to drop the `measurement_histories` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[nid]` on the table `doctors` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nira]` on the table `nurses` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[kode]` on the table `roles` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updated_at` to the `babies` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gateway_id` to the `devices_connected` table without a default value. This is not possible if the table is not empty.
  - Added the required column `is_connected` to the `devices_connected` table without a default value. This is not possible if the table is not empty.
  - Added the required column `model` to the `devices_connected` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `devices_connected` table without a default value. This is not possible if the table is not empty.
  - Made the column `name` on table `devices_connected` required. This step will fail if there are existing NULL values in that column.
  - Made the column `type` on table `devices_connected` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `address` to the `doctors` table without a default value. This is not possible if the table is not empty.
  - Added the required column `date_of_birth` to the `doctors` table without a default value. This is not possible if the table is not empty.
  - Added the required column `experience_of_years` to the `doctors` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gender` to the `doctors` table without a default value. This is not possible if the table is not empty.
  - Added the required column `last_education` to the `doctors` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nid` to the `doctors` table without a default value. This is not possible if the table is not empty.
  - Added the required column `place_of_birth` to the `doctors` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `iot_gateways` table without a default value. This is not possible if the table is not empty.
  - Added the required column `address` to the `nurses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `date_of_birth` to the `nurses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `experience_of_years` to the `nurses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gender` to the `nurses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `last_education` to the `nurses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nira` to the `nurses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `place_of_birth` to the `nurses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `device_id` to the `patient_handlers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `patients` table without a default value. This is not possible if the table is not empty.
  - Made the column `created_at` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `doctors` DROP FOREIGN KEY `doctors_admin_id_fkey`;

-- DropForeignKey
ALTER TABLE `iot_gateways` DROP FOREIGN KEY `iot_gateways_hospital_id_fkey`;

-- DropForeignKey
ALTER TABLE `measurement_histories` DROP FOREIGN KEY `measurement_histories_patient_handler_id_fkey`;

-- DropForeignKey
ALTER TABLE `nurses` DROP FOREIGN KEY `nurses_admin_id_fkey`;

-- DropForeignKey
ALTER TABLE `patient_handlers` DROP FOREIGN KEY `patient_handlers_hospital_id_fkey`;

-- DropForeignKey
ALTER TABLE `users` DROP FOREIGN KEY `users_role_id_fkey`;

-- DropIndex
DROP INDEX `devices_connected_id_key` ON `devices_connected`;

-- DropIndex
DROP INDEX `doctors_admin_id_fkey` ON `doctors`;

-- DropIndex
DROP INDEX `iot_gateways_hospital_id_fkey` ON `iot_gateways`;

-- DropIndex
DROP INDEX `nurses_admin_id_fkey` ON `nurses`;

-- DropIndex
DROP INDEX `patient_handlers_hospital_id_fkey` ON `patient_handlers`;

-- DropIndex
DROP INDEX `users_role_id_fkey` ON `users`;

-- AlterTable
ALTER TABLE `babies` ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL,
    MODIFY `name` VARCHAR(255) NOT NULL,
    MODIFY `gender` ENUM('MALE', 'FEMALE', 'OTHER') NOT NULL,
    MODIFY `date_of_birth` DATETIME NOT NULL,
    MODIFY `place_of_birth` VARCHAR(50) NULL;

-- AlterTable
ALTER TABLE `devices_connected` DROP COLUMN `device`,
    ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `gateway_id` VARCHAR(191) NOT NULL,
    ADD COLUMN `is_connected` BOOLEAN NOT NULL,
    ADD COLUMN `model` VARCHAR(100) NOT NULL,
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL,
    MODIFY `name` VARCHAR(255) NOT NULL,
    MODIFY `connection` ENUM('bluetooth', 'tcp_ip', 'serial', 'other') NOT NULL,
    MODIFY `type` VARCHAR(100) NOT NULL,
    MODIFY `device_function` VARCHAR(100) NOT NULL;

-- AlterTable
ALTER TABLE `doctors` ADD COLUMN `address` LONGTEXT NOT NULL,
    ADD COLUMN `date_of_birth` DATETIME NOT NULL,
    ADD COLUMN `experience_of_years` VARCHAR(10) NOT NULL,
    ADD COLUMN `gender` ENUM('MALE', 'FEMALE', 'OTHER') NOT NULL,
    ADD COLUMN `last_education` VARCHAR(255) NOT NULL,
    ADD COLUMN `nid` VARCHAR(191) NOT NULL,
    ADD COLUMN `place_of_birth` VARCHAR(255) NOT NULL,
    MODIFY `specialty` VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE `iot_gateways` ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `description` VARCHAR(255) NULL,
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL,
    MODIFY `name` VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE `measurement-histories_doppler` DROP PRIMARY KEY,
    DROP COLUMN `device_id`,
    DROP COLUMN `name`,
    DROP COLUMN `timestamp`,
    ADD COLUMN `recorded_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `id` VARCHAR(191) NOT NULL,
    MODIFY `heart_rate` FLOAT NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `measurement_histories_digit_pro_baby` DROP PRIMARY KEY,
    DROP COLUMN `device_id`,
    DROP COLUMN `name`,
    DROP COLUMN `timestamp`,
    ADD COLUMN `recorded_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `id` VARCHAR(191) NOT NULL,
    MODIFY `weight` FLOAT NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `measurement_histories_digit_pro_bmi` DROP PRIMARY KEY,
    DROP COLUMN `device_id`,
    DROP COLUMN `name`,
    DROP COLUMN `timestamp`,
    ADD COLUMN `recorded_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `id` VARCHAR(191) NOT NULL,
    MODIFY `weight` FLOAT NOT NULL,
    MODIFY `age` FLOAT NOT NULL,
    MODIFY `bmi` FLOAT NOT NULL,
    MODIFY `water` FLOAT NOT NULL,
    MODIFY `metabolism` FLOAT NOT NULL,
    MODIFY `protein` FLOAT NOT NULL,
    MODIFY `obesity` FLOAT NOT NULL,
    MODIFY `lbm` FLOAT NOT NULL,
    MODIFY `body_age` FLOAT NOT NULL,
    MODIFY `body_fat` FLOAT NOT NULL,
    MODIFY `bone_mass` FLOAT NOT NULL,
    MODIFY `muscle_mass` FLOAT NOT NULL,
    MODIFY `visceral_fat` FLOAT NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `measurement_histories_digit_pro_ida` DROP PRIMARY KEY,
    DROP COLUMN `device_id`,
    DROP COLUMN `name`,
    DROP COLUMN `timestamp`,
    ADD COLUMN `recorded_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `id` VARCHAR(191) NOT NULL,
    MODIFY `weight_mother` FLOAT NOT NULL,
    MODIFY `weight_child` FLOAT NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `nurses` ADD COLUMN `address` LONGTEXT NOT NULL,
    ADD COLUMN `date_of_birth` DATETIME NOT NULL,
    ADD COLUMN `experience_of_years` VARCHAR(10) NOT NULL,
    ADD COLUMN `gender` ENUM('MALE', 'FEMALE', 'OTHER') NOT NULL,
    ADD COLUMN `last_education` VARCHAR(50) NOT NULL,
    ADD COLUMN `nira` VARCHAR(191) NOT NULL,
    ADD COLUMN `place_of_birth` VARCHAR(50) NOT NULL,
    MODIFY `name` VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE `patient_handlers` DROP COLUMN `hospital_id`,
    ADD COLUMN `device_id` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `patients` DROP COLUMN `age`,
    DROP COLUMN `last_education`,
    DROP COLUMN `religion`,
    DROP COLUMN `work`,
    ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL,
    MODIFY `place_of_birth` VARCHAR(50) NULL,
    MODIFY `date_of_birth` DATETIME NOT NULL,
    MODIFY `phone` VARCHAR(16) NULL;

-- AlterTable
ALTER TABLE `roles` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `users` MODIFY `password` VARCHAR(255) NOT NULL,
    MODIFY `role_id` VARCHAR(191) NOT NULL,
    MODIFY `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `email` VARCHAR(50) NULL,
    MODIFY `phone` VARCHAR(16) NULL,
    ALTER COLUMN `updated_at` DROP DEFAULT;

-- DropTable
DROP TABLE `measurement_histories`;

-- CreateTable
CREATE TABLE `devices_connection_detail` (
    `device_id` VARCHAR(191) NOT NULL,
    `mac_address` VARCHAR(191) NULL,
    `ip_address` VARCHAR(191) NULL,
    `serial_number` VARCHAR(191) NULL,

    UNIQUE INDEX `devices_connection_detail_mac_address_key`(`mac_address`),
    UNIQUE INDEX `devices_connection_detail_ip_address_key`(`ip_address`),
    UNIQUE INDEX `devices_connection_detail_serial_number_key`(`serial_number`),
    PRIMARY KEY (`device_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `patient_rooms` (
    `id` VARCHAR(191) NOT NULL,
    `bed_id` VARCHAR(191) NOT NULL,
    `room_id` VARCHAR(191) NOT NULL,
    `patient_id` VARCHAR(191) NOT NULL,
    `assigned_at` DATETIME NOT NULL,
    `discharged_at` DATETIME NULL,

    UNIQUE INDEX `patient_rooms_bed_id_key`(`bed_id`),
    UNIQUE INDEX `patient_rooms_patient_id_key`(`patient_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `activity_room_logs` (
    `id` VARCHAR(191) NOT NULL,
    `patient_room_id` VARCHAR(191) NOT NULL,
    `activity` LONGTEXT NOT NULL,
    `timestamp` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `rooms` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `number` VARCHAR(6) NOT NULL,
    `type` VARCHAR(255) NOT NULL,
    `capacity` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `nurse_manager` VARCHAR(191) NULL,
    `doctor_id` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `beds` (
    `id` VARCHAR(191) NOT NULL,
    `bed_number` VARCHAR(10) NOT NULL,
    `status` VARCHAR(30) NOT NULL,
    `type` VARCHAR(30) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `room_id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CentralMonitor` (
    `id` VARCHAR(191) NOT NULL,
    `patient_handler_id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `measurement_histories_pm9000` (
    `id` VARCHAR(191) NOT NULL,
    `ecg` FLOAT NOT NULL,
    `spo2` FLOAT NOT NULL,
    `resp` FLOAT NOT NULL,
    `temp1` FLOAT NOT NULL,
    `temp2` FLOAT NOT NULL,
    `delta_temp` FLOAT NOT NULL,
    `recorded_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `patient_handler_id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `measurement_histories_pm9000_nibp` (
    `id` VARCHAR(191) NOT NULL,
    `systolic` FLOAT NOT NULL,
    `diastolic` FLOAT NOT NULL,
    `mean` FLOAT NOT NULL,
    `recorded_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `pm9000_id` VARCHAR(191) NULL,
    `patient_handler_id` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `measurement_histories_pm9000_nibp_pm9000_id_key`(`pm9000_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `measurement_histories_ds001` (
    `id` VARCHAR(191) NOT NULL,
    `temp` FLOAT NOT NULL,
    `spo2` FLOAT NOT NULL,
    `pulse_rate_spo2` FLOAT NOT NULL,
    `respiratory_rate` FLOAT NOT NULL,
    `recorded_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `patient_handler_id` VARCHAR(191) NOT NULL,
    `measurement_histories_ds001_nibp` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `measurement_histories_ds001_nibp` (
    `id` VARCHAR(191) NOT NULL,
    `systolic` FLOAT NOT NULL,
    `diastolic` FLOAT NOT NULL,
    `map` FLOAT NOT NULL,
    `pulse_rate` FLOAT NOT NULL,
    `recorded_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `ds001_id` VARCHAR(191) NULL,
    `patient_handler_id` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `measurement_histories_ds001_nibp_ds001_id_key`(`ds001_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ecg_1200g` (
    `id` VARCHAR(191) NOT NULL,
    `file_path` VARCHAR(191) NULL,
    `image_path` VARCHAR(191) NULL,
    `patient_handler_id` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `ecg_1200g_patient_handler_id_key`(`patient_handler_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `doctors_nid_key` ON `doctors`(`nid`);

-- CreateIndex
CREATE UNIQUE INDEX `nurses_nira_key` ON `nurses`(`nira`);

-- CreateIndex
CREATE UNIQUE INDEX `roles_kode_key` ON `roles`(`kode`);

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_role_id_fkey` FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `iot_gateways` ADD CONSTRAINT `iot_gateways_hospital_id_fkey` FOREIGN KEY (`hospital_id`) REFERENCES `hospitals`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `devices_connected` ADD CONSTRAINT `devices_connected_gateway_id_fkey` FOREIGN KEY (`gateway_id`) REFERENCES `iot_gateways`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `devices_connection_detail` ADD CONSTRAINT `devices_connection_detail_device_id_fkey` FOREIGN KEY (`device_id`) REFERENCES `devices_connected`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `patient_rooms` ADD CONSTRAINT `patient_rooms_patient_id_fkey` FOREIGN KEY (`patient_id`) REFERENCES `patients`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `patient_rooms` ADD CONSTRAINT `patient_rooms_room_id_fkey` FOREIGN KEY (`room_id`) REFERENCES `rooms`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `patient_rooms` ADD CONSTRAINT `patient_rooms_bed_id_fkey` FOREIGN KEY (`bed_id`) REFERENCES `beds`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `activity_room_logs` ADD CONSTRAINT `activity_room_logs_patient_room_id_fkey` FOREIGN KEY (`patient_room_id`) REFERENCES `patient_rooms`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `rooms` ADD CONSTRAINT `rooms_nurse_manager_fkey` FOREIGN KEY (`nurse_manager`) REFERENCES `nurses`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `rooms` ADD CONSTRAINT `rooms_doctor_id_fkey` FOREIGN KEY (`doctor_id`) REFERENCES `doctors`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `beds` ADD CONSTRAINT `beds_room_id_fkey` FOREIGN KEY (`room_id`) REFERENCES `rooms`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CentralMonitor` ADD CONSTRAINT `CentralMonitor_patient_handler_id_fkey` FOREIGN KEY (`patient_handler_id`) REFERENCES `patient_handlers`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `measurement_histories_pm9000` ADD CONSTRAINT `measurement_histories_pm9000_patient_handler_id_fkey` FOREIGN KEY (`patient_handler_id`) REFERENCES `patient_handlers`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `measurement_histories_pm9000_nibp` ADD CONSTRAINT `measurement_histories_pm9000_nibp_patient_handler_id_fkey` FOREIGN KEY (`patient_handler_id`) REFERENCES `patient_handlers`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `measurement_histories_pm9000_nibp` ADD CONSTRAINT `measurement_histories_pm9000_nibp_pm9000_id_fkey` FOREIGN KEY (`pm9000_id`) REFERENCES `measurement_histories_pm9000`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `measurement_histories_ds001` ADD CONSTRAINT `measurement_histories_ds001_patient_handler_id_fkey` FOREIGN KEY (`patient_handler_id`) REFERENCES `patient_handlers`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `measurement_histories_ds001_nibp` ADD CONSTRAINT `measurement_histories_ds001_nibp_patient_handler_id_fkey` FOREIGN KEY (`patient_handler_id`) REFERENCES `patient_handlers`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `measurement_histories_ds001_nibp` ADD CONSTRAINT `measurement_histories_ds001_nibp_ds001_id_fkey` FOREIGN KEY (`ds001_id`) REFERENCES `measurement_histories_ds001`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ecg_1200g` ADD CONSTRAINT `ecg_1200g_patient_handler_id_fkey` FOREIGN KEY (`patient_handler_id`) REFERENCES `patient_handlers`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
