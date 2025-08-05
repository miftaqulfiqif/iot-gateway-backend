/*
  Warnings:

  - You are about to alter the column `date_of_birth` on the `babies` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - The values [tcp_ip] on the enum `devices_connected_connection` will be removed. If these variants are still used in the database, this will fail.
  - You are about to alter the column `assigned_at` on the `patient_rooms` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `discharged_at` on the `patient_rooms` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `date_of_birth` on the `patients` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `date_of_birth` on the `users` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to drop the `devices_connection_detail` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[mac_address]` on the table `devices_connected` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[ip_address]` on the table `devices_connected` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[serial_number]` on the table `devices_connected` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `devices_connection_detail` DROP FOREIGN KEY `devices_connection_detail_device_id_fkey`;

-- AlterTable
ALTER TABLE `babies` MODIFY `date_of_birth` DATETIME NOT NULL;

-- AlterTable
ALTER TABLE `devices_connected` ADD COLUMN `ip_address` VARCHAR(191) NULL,
    ADD COLUMN `mac_address` VARCHAR(191) NULL,
    ADD COLUMN `serial_number` VARCHAR(191) NULL,
    MODIFY `connection` ENUM('bluetooth', 'tcpip', 'serial', 'other') NOT NULL;

-- AlterTable
ALTER TABLE `patient_rooms` MODIFY `assigned_at` DATETIME NOT NULL,
    MODIFY `discharged_at` DATETIME NULL;

-- AlterTable
ALTER TABLE `patients` MODIFY `date_of_birth` DATETIME NOT NULL;

-- AlterTable
ALTER TABLE `users` MODIFY `date_of_birth` DATETIME NULL;

-- DropTable
DROP TABLE `devices_connection_detail`;

-- CreateIndex
CREATE UNIQUE INDEX `devices_connected_mac_address_key` ON `devices_connected`(`mac_address`);

-- CreateIndex
CREATE UNIQUE INDEX `devices_connected_ip_address_key` ON `devices_connected`(`ip_address`);

-- CreateIndex
CREATE UNIQUE INDEX `devices_connected_serial_number_key` ON `devices_connected`(`serial_number`);
