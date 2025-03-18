/*
  Warnings:

  - Added the required column `phone` to the `address` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sizeId` to the `cart_item` table without a default value. This is not possible if the table is not empty.
  - Made the column `discount` on table `product` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `address` ADD COLUMN `firstname` VARCHAR(191) NULL,
    ADD COLUMN `lastname` VARCHAR(191) NULL,
    ADD COLUMN `phone` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `cart_item` ADD COLUMN `sizeId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `product` MODIFY `discount` DECIMAL(10, 2) NOT NULL DEFAULT 0;

-- AddForeignKey
ALTER TABLE `cart_item` ADD CONSTRAINT `cart_item_sizeId_fkey` FOREIGN KEY (`sizeId`) REFERENCES `size`(`size_id`) ON DELETE CASCADE ON UPDATE CASCADE;
