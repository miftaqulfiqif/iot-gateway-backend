-- DropForeignKey
ALTER TABLE `patient_handlers` DROP FOREIGN KEY `patient_handlers_patient_id_fkey`;

-- DropIndex
DROP INDEX `patient_handlers_patient_id_fkey` ON `patient_handlers`;

-- AddForeignKey
ALTER TABLE `patient_handlers` ADD CONSTRAINT `patient_handlers_patient_id_fkey` FOREIGN KEY (`patient_id`) REFERENCES `patients`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
