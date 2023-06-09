/*
  Warnings:

  - You are about to drop the `Rule` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `team_id` on the `Namespace` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `Namespace` table. All the data in the column will be lost.
  - Added the required column `speaker_id` to the `Committee` table without a default value. This is not possible if the table is not empty.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Rule";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Committee" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "visibility" BOOLEAN NOT NULL,
    "created" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" DATETIME NOT NULL,
    "namespace_name" TEXT NOT NULL,
    "speaker_id" INTEGER NOT NULL,
    CONSTRAINT "Committee_namespace_name_fkey" FOREIGN KEY ("namespace_name") REFERENCES "Namespace" ("name") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Committee_speaker_id_fkey" FOREIGN KEY ("speaker_id") REFERENCES "Councilor" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Committee" ("created", "id", "name", "namespace_name", "updated", "visibility") SELECT "created", "id", "name", "namespace_name", "updated", "visibility" FROM "Committee";
DROP TABLE "Committee";
ALTER TABLE "new_Committee" RENAME TO "Committee";
CREATE TABLE "new_Namespace" (
    "name" TEXT NOT NULL PRIMARY KEY,
    "created" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" DATETIME NOT NULL
);
INSERT INTO "new_Namespace" ("created", "name", "updated") SELECT "created", "name", "updated" FROM "Namespace";
DROP TABLE "Namespace";
ALTER TABLE "new_Namespace" RENAME TO "Namespace";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
