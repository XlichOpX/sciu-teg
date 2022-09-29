/*
  Warnings:

  - You are about to alter the column `amount` on the `Charge` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `dolar` on the `Conversion` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `euro` on the `Conversion` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `price` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - Added the required column `conversionId` to the `Charge` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `ProductSale` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Charge" ADD COLUMN     "conversionId" INTEGER NOT NULL,
ALTER COLUMN "amount" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "Conversion" ALTER COLUMN "dolar" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "euro" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "price" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "ProductSale" ADD COLUMN     "price" DOUBLE PRECISION NOT NULL;

-- AddForeignKey
ALTER TABLE "Charge" ADD CONSTRAINT "Charge_conversionId_fkey" FOREIGN KEY ("conversionId") REFERENCES "Conversion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
