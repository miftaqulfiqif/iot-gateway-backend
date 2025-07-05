/*
  Warnings:

  - You are about to drop the column `bodyAge` on the `measurement_histories_digit_pro_bmi` table. All the data in the column will be lost.
  - You are about to drop the column `bodyFat` on the `measurement_histories_digit_pro_bmi` table. All the data in the column will be lost.
  - You are about to drop the column `boneMass` on the `measurement_histories_digit_pro_bmi` table. All the data in the column will be lost.
  - You are about to drop the column `muscleMass` on the `measurement_histories_digit_pro_bmi` table. All the data in the column will be lost.
  - You are about to drop the column `visceralFat` on the `measurement_histories_digit_pro_bmi` table. All the data in the column will be lost.
  - Added the required column `body_age` to the `measurement_histories_digit_pro_bmi` table without a default value. This is not possible if the table is not empty.
  - Added the required column `body_fat` to the `measurement_histories_digit_pro_bmi` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bone_mass` to the `measurement_histories_digit_pro_bmi` table without a default value. This is not possible if the table is not empty.
  - Added the required column `muscle_mass` to the `measurement_histories_digit_pro_bmi` table without a default value. This is not possible if the table is not empty.
  - Added the required column `visceral_fat` to the `measurement_histories_digit_pro_bmi` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `measurement_histories_digit_pro_bmi` DROP COLUMN `bodyAge`,
    DROP COLUMN `bodyFat`,
    DROP COLUMN `boneMass`,
    DROP COLUMN `muscleMass`,
    DROP COLUMN `visceralFat`,
    ADD COLUMN `body_age` INTEGER NOT NULL,
    ADD COLUMN `body_fat` INTEGER NOT NULL,
    ADD COLUMN `bone_mass` INTEGER NOT NULL,
    ADD COLUMN `muscle_mass` INTEGER NOT NULL,
    ADD COLUMN `visceral_fat` INTEGER NOT NULL;
