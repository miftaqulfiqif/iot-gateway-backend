/*
  Warnings:

  - You are about to drop the column `device_name` on the `devices` table. All the data in the column will be lost.
  - Added the required column `name` to the `devices` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `devices` DROP COLUMN `device_name`,
    ADD COLUMN `name` VARCHAR(255) NOT NULL;
