/*
  Warnings:

  - The primary key for the `devices_connected` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `mac` on the `devices_connected` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[id]` on the table `devices_connected` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `id` to the `devices_connected` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `devices_connected_mac_key` ON `devices_connected`;

-- AlterTable
ALTER TABLE `devices_connected` DROP PRIMARY KEY,
    DROP COLUMN `mac`,
    ADD COLUMN `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- CreateIndex
CREATE UNIQUE INDEX `devices_connected_id_key` ON `devices_connected`(`id`);
