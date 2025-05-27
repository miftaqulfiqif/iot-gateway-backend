/*
  Warnings:

  - You are about to drop the column `device_code` on the `measurement_histories` table. All the data in the column will be lost.
  - Added the required column `device` to the `measurement_histories` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `measurement_histories` DROP FOREIGN KEY `measurement_histories_device_code_fkey`;

-- DropIndex
DROP INDEX `measurement_histories_device_code_fkey` ON `measurement_histories`;

-- AlterTable
ALTER TABLE `measurement_histories` DROP COLUMN `device_code`,
    ADD COLUMN `device` VARCHAR(191) NOT NULL;
