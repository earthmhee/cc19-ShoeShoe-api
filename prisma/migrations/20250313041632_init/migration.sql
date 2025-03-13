/*
  Warnings:

  - You are about to drop the column `addressId` on the `user` table. All the data in the column will be lost.
  - Added the required column `address_id` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `user` DROP FOREIGN KEY `user_addressId_fkey`;

-- DropIndex
DROP INDEX `user_addressId_fkey` ON `user`;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `addressId`,
    ADD COLUMN `address_id` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `user` ADD CONSTRAINT `user_address_id_fkey` FOREIGN KEY (`address_id`) REFERENCES `Address`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
