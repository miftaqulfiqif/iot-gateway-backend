/*
  Warnings:

  - Added the required column `name` to the `measurement_histories_digit_pro_bmi` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `measurement_histories_digit_pro_bmi` ADD COLUMN `name` VARCHAR(191) NOT NULL;
