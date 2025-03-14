-- AlterTable
ALTER TABLE `payment` ADD COLUMN `status` ENUM('Unpaid', 'Paid', 'Cancel') NOT NULL DEFAULT 'Unpaid';
