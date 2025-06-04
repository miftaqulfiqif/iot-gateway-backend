/*
  Warnings:

  - Added the required column `device_id` to the `measurement_histories` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `measurement_histories` ADD COLUMN `device_id` VARCHAR(191) NOT NULL;
