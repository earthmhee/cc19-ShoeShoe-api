/*
  Warnings:

  - You are about to drop the column `contry` on the `address` table. All the data in the column will be lost.
  - You are about to drop the column `address_id` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `user` table. All the data in the column will be lost.
  - Added the required column `user_id` to the `address` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `order` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `user` DROP FOREIGN KEY `user_address_id_fkey`;

-- DropIndex
DROP INDEX `user_address_id_fkey` ON `user`;

-- AlterTable
ALTER TABLE `address` DROP COLUMN `contry`,
    ADD COLUMN `country` VARCHAR(191) NOT NULL DEFAULT 'Thailand',
    ADD COLUMN `user_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `order` ADD COLUMN `updated_at` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `address_id`,
    DROP COLUMN `password`;

-- AddForeignKey
ALTER TABLE `address` ADD CONSTRAINT `address_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- RenameIndex
ALTER TABLE `address` RENAME INDEX `Address_homenum_key` TO `address_homenum_key`;
