/*
  Warnings:

  - You are about to drop the column `name` on the `devices` table. All the data in the column will be lost.
  - Added the required column `device_name` to the `devices` table without a default value. This is not possible if the table is not empty.
  - Added the required column `display_name` to the `devices` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `devices` DROP COLUMN `name`,
    ADD COLUMN `device_name` VARCHAR(255) NOT NULL,
    ADD COLUMN `display_name` VARCHAR(255) NOT NULL;
