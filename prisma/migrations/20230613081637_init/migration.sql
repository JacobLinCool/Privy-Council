/*
  Warnings:

  - A unique constraint covering the columns `[content]` on the table `Data` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Tag_content_key";

-- CreateIndex
CREATE UNIQUE INDEX "Data_content_key" ON "Data"("content");
