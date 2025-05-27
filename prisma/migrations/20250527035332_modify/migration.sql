/*
  Warnings:

  - You are about to drop the column `display_name` on the `devices_connected` table. All the data in the column will be lost.
  - You are about to drop the column `device_type_id` on the `measurement_histories` table. All the data in the column will be lost.
  - You are about to drop the `device_types` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[code]` on the table `devices_connected` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `code` to the `devices_connected` table without a default value. This is not possible if the table is not empty.
  - Added the required column `connection` to the `devices_connected` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `devices_connected` table without a default value. This is not possible if the table is not empty.
  - Added the required column `device_code` to the `measurement_histories` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `measurement_histories` DROP FOREIGN KEY `measurement_histories_device_type_id_fkey`;

-- DropIndex
DROP INDEX `measurement_histories_device_type_id_fkey` ON `measurement_histories`;

-- AlterTable
ALTER TABLE `devices_connected` DROP COLUMN `display_name`,
    ADD COLUMN `code` VARCHAR(191) NOT NULL,
    ADD COLUMN `connection` VARCHAR(191) NOT NULL,
    ADD COLUMN `label` VARCHAR(255) NULL,
    ADD COLUMN `type` VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE `measurement_histories` DROP COLUMN `device_type_id`,
    ADD COLUMN `device_code` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `device_types`;

-- CreateIndex
CREATE UNIQUE INDEX `devices_connected_code_key` ON `devices_connected`(`code`);

-- AddForeignKey
ALTER TABLE `measurement_histories` ADD CONSTRAINT `measurement_histories_device_code_fkey` FOREIGN KEY (`device_code`) REFERENCES `devices_connected`(`code`) ON DELETE RESTRICT ON UPDATE CASCADE;
