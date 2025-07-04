/*
  Warnings:

  - You are about to alter the column `timestamp` on the `measurement_histories_digit_pro_bmi` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `DateTime(3)`.

*/
-- AlterTable
ALTER TABLE `measurement_histories_digit_pro_bmi` MODIFY `timestamp` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);
