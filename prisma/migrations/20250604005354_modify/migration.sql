/*
  Warnings:

  - You are about to drop the column `code` on the `devices_connected` table. All the data in the column will be lost.
  - You are about to drop the column `label` on the `devices_connected` table. All the data in the column will be lost.
  - Added the required column `device` to the `devices_connected` table without a default value. This is not possible if the table is not empty.
  - Added the required column `device_function` to the `devices_connected` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `devices_connected` DROP COLUMN `code`,
    DROP COLUMN `label`,
    ADD COLUMN `device` VARCHAR(255) NOT NULL,
    ADD COLUMN `device_function` VARCHAR(191) NOT NULL,
    MODIFY `name` VARCHAR(255) NULL;
