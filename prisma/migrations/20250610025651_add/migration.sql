-- AlterTable
ALTER TABLE `measurement_histories_digit_pro_baby` ADD COLUMN `baby_id` VARCHAR(191) NOT NULL DEFAULT 'Test001';

-- AddForeignKey
ALTER TABLE `measurement_histories_digit_pro_baby` ADD CONSTRAINT `measurement_histories_digit_pro_baby_baby_id_fkey` FOREIGN KEY (`baby_id`) REFERENCES `babies`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
