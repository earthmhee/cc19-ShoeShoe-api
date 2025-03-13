/*
  Warnings:

  - You are about to drop the column `address` on the `user` table. All the data in the column will be lost.
  - Added the required column `addressId` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `user` DROP COLUMN `address`,
    ADD COLUMN `addressId` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `Address` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `homenum` VARCHAR(191) NOT NULL,
    `subdistrict` VARCHAR(191) NULL,
    `district` VARCHAR(191) NULL,
    `province` VARCHAR(191) NOT NULL,
    `contry` VARCHAR(191) NOT NULL,
    `postcode` INTEGER NOT NULL,

    UNIQUE INDEX `Address_homenum_key`(`homenum`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `user` ADD CONSTRAINT `user_addressId_fkey` FOREIGN KEY (`addressId`) REFERENCES `Address`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
