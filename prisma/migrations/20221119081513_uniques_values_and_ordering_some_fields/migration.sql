/*
  Warnings:

  - You are about to drop the column `createAt` on the `Billing` table. All the data in the column will be lost.
  - You are about to drop the column `conversionId` on the `Charge` table. All the data in the column will be lost.
  - You are about to drop the column `dolar` on the `Conversion` table. All the data in the column will be lost.
  - You are about to drop the column `euro` on the `Conversion` table. All the data in the column will be lost.
  - You are about to drop the column `ocupation` on the `Occupation` table. All the data in the column will be lost.
  - You are about to drop the column `currencyId` on the `PaymentMethod` table. All the data in the column will be lost.
  - You are about to drop the column `level` on the `Role` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[shortAddress]` on the table `Address` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[career]` on the table `Career` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `Category` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `Currency` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[type]` on the table `DocType` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[occupation]` on the table `Occupation` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[permission]` on the table `Permission` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[docNumber,docTypeId]` on the table `Person` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `Role` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[question]` on the table `SecretQuestion` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[semester]` on the table `Semester` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[status]` on the table `UserStatus` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `currencyId` to the `Charge` table without a default value. This is not possible if the table is not empty.
  - Added the required column `currencyId` to the `Conversion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `value` to the `Conversion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `occupation` to the `Occupation` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Charge" DROP CONSTRAINT "Charge_conversionId_fkey";

-- DropForeignKey
ALTER TABLE "PaymentMethod" DROP CONSTRAINT "PaymentMethod_currencyId_fkey";

-- DropIndex
DROP INDEX "Person_docNumber_key";

-- AlterTable
ALTER TABLE "Billing" DROP COLUMN "createAt";

-- AlterTable
ALTER TABLE "Charge" DROP COLUMN "conversionId",
ADD COLUMN     "currencyId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Conversion" DROP COLUMN "dolar",
DROP COLUMN "euro",
ADD COLUMN     "currencyId" INTEGER NOT NULL,
ADD COLUMN     "value" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "Occupation" DROP COLUMN "ocupation",
ADD COLUMN     "occupation" VARCHAR(40) NOT NULL;

-- AlterTable
ALTER TABLE "PaymentMethod" DROP COLUMN "currencyId";

-- AlterTable
ALTER TABLE "Role" DROP COLUMN "level";

-- CreateTable
CREATE TABLE "_CurrencyToPaymentMethod" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_CurrencyToPaymentMethod_AB_unique" ON "_CurrencyToPaymentMethod"("A", "B");

-- CreateIndex
CREATE INDEX "_CurrencyToPaymentMethod_B_index" ON "_CurrencyToPaymentMethod"("B");

-- CreateIndex
CREATE UNIQUE INDEX "Address_shortAddress_key" ON "Address"("shortAddress");

-- CreateIndex
CREATE UNIQUE INDEX "Career_career_key" ON "Career"("career");

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Currency_name_key" ON "Currency"("name");

-- CreateIndex
CREATE UNIQUE INDEX "DocType_type_key" ON "DocType"("type");

-- CreateIndex
CREATE UNIQUE INDEX "Occupation_occupation_key" ON "Occupation"("occupation");

-- CreateIndex
CREATE UNIQUE INDEX "Permission_permission_key" ON "Permission"("permission");

-- CreateIndex
CREATE UNIQUE INDEX "Person_docNumber_docTypeId_key" ON "Person"("docNumber", "docTypeId");

-- CreateIndex
CREATE UNIQUE INDEX "Role_name_key" ON "Role"("name");

-- CreateIndex
CREATE UNIQUE INDEX "SecretQuestion_question_key" ON "SecretQuestion"("question");

-- CreateIndex
CREATE UNIQUE INDEX "Semester_semester_key" ON "Semester"("semester");

-- CreateIndex
CREATE UNIQUE INDEX "UserStatus_status_key" ON "UserStatus"("status");

-- AddForeignKey
ALTER TABLE "Charge" ADD CONSTRAINT "Charge_currencyId_fkey" FOREIGN KEY ("currencyId") REFERENCES "Currency"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Conversion" ADD CONSTRAINT "Conversion_currencyId_fkey" FOREIGN KEY ("currencyId") REFERENCES "Currency"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CurrencyToPaymentMethod" ADD CONSTRAINT "_CurrencyToPaymentMethod_A_fkey" FOREIGN KEY ("A") REFERENCES "Currency"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CurrencyToPaymentMethod" ADD CONSTRAINT "_CurrencyToPaymentMethod_B_fkey" FOREIGN KEY ("B") REFERENCES "PaymentMethod"("id") ON DELETE CASCADE ON UPDATE CASCADE;
