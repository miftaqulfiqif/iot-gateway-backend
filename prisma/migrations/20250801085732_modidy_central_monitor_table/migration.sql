/*
  Warnings:

  - You are about to alter the column `date_of_birth` on the `babies` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `date_of_birth` on the `doctors` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `date_of_birth` on the `nurses` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `assigned_at` on the `patient_rooms` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `discharged_at` on the `patient_rooms` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `date_of_birth` on the `patients` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to drop the `measurement_histories_ds001_nibp` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `measurement_histories_pm9000_nibp` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `measurement_histories_ds001_nibp` DROP FOREIGN KEY `measurement_histories_ds001_nibp_ds001_id_fkey`;

-- DropForeignKey
ALTER TABLE `measurement_histories_ds001_nibp` DROP FOREIGN KEY `measurement_histories_ds001_nibp_patient_handler_id_fkey`;

-- DropForeignKey
ALTER TABLE `measurement_histories_pm9000_nibp` DROP FOREIGN KEY `measurement_histories_pm9000_nibp_patient_handler_id_fkey`;

-- DropForeignKey
ALTER TABLE `measurement_histories_pm9000_nibp` DROP FOREIGN KEY `measurement_histories_pm9000_nibp_pm9000_id_fkey`;

-- AlterTable
ALTER TABLE `babies` MODIFY `date_of_birth` DATETIME NOT NULL;

-- AlterTable
ALTER TABLE `doctors` MODIFY `date_of_birth` DATETIME NOT NULL;

-- AlterTable
ALTER TABLE `measurement_histories_ds001` ADD COLUMN `diastolic` FLOAT NULL,
    ADD COLUMN `map` FLOAT NULL,
    ADD COLUMN `pulse_rate` FLOAT NULL,
    ADD COLUMN `systolic` FLOAT NULL;

-- AlterTable
ALTER TABLE `measurement_histories_pm9000` ADD COLUMN `diastolic` FLOAT NULL,
    ADD COLUMN `mean` FLOAT NULL,
    ADD COLUMN `systolic` FLOAT NULL;

-- AlterTable
ALTER TABLE `nurses` MODIFY `date_of_birth` DATETIME NOT NULL;

-- AlterTable
ALTER TABLE `patient_rooms` MODIFY `assigned_at` DATETIME NOT NULL,
    MODIFY `discharged_at` DATETIME NULL;

-- AlterTable
ALTER TABLE `patients` MODIFY `date_of_birth` DATETIME NOT NULL;

-- DropTable
DROP TABLE `measurement_histories_ds001_nibp`;

-- DropTable
DROP TABLE `measurement_histories_pm9000_nibp`;
