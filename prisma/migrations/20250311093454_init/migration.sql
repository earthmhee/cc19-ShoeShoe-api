/*
  Warnings:

  - Made the column `image_urls` on table `product` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `product` MODIFY `image_urls` VARCHAR(999) NOT NULL;
