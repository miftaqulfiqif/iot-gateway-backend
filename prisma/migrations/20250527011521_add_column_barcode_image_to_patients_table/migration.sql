/*
  Warnings:

  - Added the required column `barcode_img` to the `patients` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `patients` ADD COLUMN `barcode_img` VARCHAR(191) NOT NULL;
