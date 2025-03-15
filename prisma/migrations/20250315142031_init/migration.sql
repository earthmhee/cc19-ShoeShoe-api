/*
  Warnings:

  - You are about to drop the column `address_id` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `user` table. All the data in the column will be lost.
  - Added the required column `user_id` to the `Address` table without a default value. This is not possible if the table is not empty.
  - Made the column `discount` on table `product` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `user` DROP FOREIGN KEY `user_address_id_fkey`;

-- DropIndex
DROP INDEX `user_address_id_fkey` ON `user`;

-- AlterTable
ALTER TABLE `address` ADD COLUMN `user_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `product` MODIFY `discount` DECIMAL(10, 2) NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `address_id`,
    DROP COLUMN `password`;

-- AddForeignKey
ALTER TABLE `Address` ADD CONSTRAINT `Address_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;
