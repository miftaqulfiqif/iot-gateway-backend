/*
  Warnings:

  - You are about to alter the column `mac` on the `devices` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.
  - A unique constraint covering the columns `[mac]` on the table `devices` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `devices` MODIFY `mac` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `devices_mac_key` ON `devices`(`mac`);
