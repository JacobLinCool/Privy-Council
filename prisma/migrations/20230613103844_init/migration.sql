/*
  Warnings:

  - You are about to drop the column `updated` on the `Data` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Data" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "content" TEXT NOT NULL,
    "created" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Data" ("content", "created", "id") SELECT "content", "created", "id" FROM "Data";
DROP TABLE "Data";
ALTER TABLE "new_Data" RENAME TO "Data";
CREATE UNIQUE INDEX "Data_content_key" ON "Data"("content");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
