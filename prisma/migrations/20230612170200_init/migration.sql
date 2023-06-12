/*
  Warnings:

  - You are about to drop the `_in_library` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_in_library";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Slot" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "created" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" DATETIME NOT NULL,
    "library_id" INTEGER NOT NULL,
    "councilor_id" INTEGER NOT NULL,
    "committee_id" INTEGER NOT NULL,
    CONSTRAINT "Slot_library_id_fkey" FOREIGN KEY ("library_id") REFERENCES "Library" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Slot_councilor_id_fkey" FOREIGN KEY ("councilor_id") REFERENCES "Councilor" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Slot_committee_id_fkey" FOREIGN KEY ("committee_id") REFERENCES "Committee" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
