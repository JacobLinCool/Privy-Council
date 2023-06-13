/*
  Warnings:

  - You are about to drop the column `library_id` on the `Data` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "_contains" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_contains_A_fkey" FOREIGN KEY ("A") REFERENCES "Data" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_contains_B_fkey" FOREIGN KEY ("B") REFERENCES "Library" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Data" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "content" TEXT NOT NULL,
    "created" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" DATETIME NOT NULL
);
INSERT INTO "new_Data" ("content", "created", "id", "updated") SELECT "content", "created", "id", "updated" FROM "Data";
DROP TABLE "Data";
ALTER TABLE "new_Data" RENAME TO "Data";
CREATE UNIQUE INDEX "Data_content_key" ON "Data"("content");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "_contains_AB_unique" ON "_contains"("A", "B");

-- CreateIndex
CREATE INDEX "_contains_B_index" ON "_contains"("B");
