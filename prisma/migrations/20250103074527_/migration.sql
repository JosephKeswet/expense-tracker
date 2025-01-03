/*
  Warnings:

  - A unique constraint covering the columns `[description]` on the table `Expenses` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Expenses_description_key" ON "Expenses"("description");
