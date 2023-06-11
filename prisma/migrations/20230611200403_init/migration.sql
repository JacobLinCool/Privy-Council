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
    CONSTRAINT "Committee_namespace_name_fkey" FOREIGN KEY ("namespace_name") REFERENCES "Namespace" ("name") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Committee_speaker_id_fkey" FOREIGN KEY ("speaker_id") REFERENCES "Councilor" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Committee" ("created", "id", "name", "namespace_name", "speaker_id", "updated", "visibility") SELECT "created", "id", "name", "namespace_name", "speaker_id", "updated", "visibility" FROM "Committee";
DROP TABLE "Committee";
ALTER TABLE "new_Committee" RENAME TO "Committee";
CREATE TABLE "new_Team" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "bio" TEXT NOT NULL,
    "created" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" DATETIME NOT NULL,
    "namespace_name" TEXT NOT NULL,
    CONSTRAINT "Team_namespace_name_fkey" FOREIGN KEY ("namespace_name") REFERENCES "Namespace" ("name") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Team" ("bio", "created", "id", "name", "namespace_name", "updated") SELECT "bio", "created", "id", "name", "namespace_name", "updated" FROM "Team";
DROP TABLE "Team";
ALTER TABLE "new_Team" RENAME TO "Team";
CREATE UNIQUE INDEX "Team_namespace_name_key" ON "Team"("namespace_name");
CREATE TABLE "new_Library" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "visibility" BOOLEAN NOT NULL,
    "created" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" DATETIME NOT NULL,
    "namespace_name" TEXT NOT NULL,
    CONSTRAINT "Library_namespace_name_fkey" FOREIGN KEY ("namespace_name") REFERENCES "Namespace" ("name") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Library" ("created", "id", "name", "namespace_name", "updated", "visibility") SELECT "created", "id", "name", "namespace_name", "updated", "visibility" FROM "Library";
DROP TABLE "Library";
ALTER TABLE "new_Library" RENAME TO "Library";
CREATE TABLE "new_Data" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "content" TEXT NOT NULL,
    "created" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" DATETIME NOT NULL,
    "library_id" INTEGER NOT NULL,
    CONSTRAINT "Data_library_id_fkey" FOREIGN KEY ("library_id") REFERENCES "Library" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Data" ("content", "created", "id", "library_id", "updated") SELECT "content", "created", "id", "library_id", "updated" FROM "Data";
DROP TABLE "Data";
ALTER TABLE "new_Data" RENAME TO "Data";
CREATE TABLE "new_TeamMember" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "created" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" DATETIME NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'member',
    "team_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    CONSTRAINT "TeamMember_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "Team" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "TeamMember_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_TeamMember" ("created", "id", "role", "team_id", "updated", "user_id") SELECT "created", "id", "role", "team_id", "updated", "user_id" FROM "TeamMember";
DROP TABLE "TeamMember";
ALTER TABLE "new_TeamMember" RENAME TO "TeamMember";
CREATE TABLE "new_Conversation" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "input" TEXT NOT NULL,
    "immediate" TEXT NOT NULL,
    "final" TEXT NOT NULL,
    "created" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" DATETIME NOT NULL,
    "namespace_name" TEXT NOT NULL,
    "committee_id" INTEGER NOT NULL,
    CONSTRAINT "Conversation_namespace_name_fkey" FOREIGN KEY ("namespace_name") REFERENCES "Namespace" ("name") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Conversation_committee_id_fkey" FOREIGN KEY ("committee_id") REFERENCES "Committee" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Conversation" ("committee_id", "created", "final", "id", "immediate", "input", "namespace_name", "updated") SELECT "committee_id", "created", "final", "id", "immediate", "input", "namespace_name", "updated" FROM "Conversation";
DROP TABLE "Conversation";
ALTER TABLE "new_Conversation" RENAME TO "Conversation";
CREATE TABLE "new_Log" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "content" TEXT NOT NULL,
    "time" DATETIME NOT NULL,
    "created" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" DATETIME NOT NULL,
    "team_id" INTEGER,
    "user_id" INTEGER,
    CONSTRAINT "Log_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "Team" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Log_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Log" ("content", "created", "id", "team_id", "time", "updated", "user_id") SELECT "content", "created", "id", "team_id", "time", "updated", "user_id" FROM "Log";
DROP TABLE "Log";
ALTER TABLE "new_Log" RENAME TO "Log";
CREATE TABLE "new_Councilor" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "visibility" BOOLEAN NOT NULL,
    "model" TEXT NOT NULL,
    "trait" TEXT NOT NULL,
    "created" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" DATETIME NOT NULL,
    "namespace_name" TEXT NOT NULL,
    CONSTRAINT "Councilor_namespace_name_fkey" FOREIGN KEY ("namespace_name") REFERENCES "Namespace" ("name") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Councilor" ("created", "id", "model", "name", "namespace_name", "trait", "updated", "visibility") SELECT "created", "id", "model", "name", "namespace_name", "trait", "updated", "visibility" FROM "Councilor";
DROP TABLE "Councilor";
ALTER TABLE "new_Councilor" RENAME TO "Councilor";
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "bio" TEXT NOT NULL,
    "admin" BOOLEAN NOT NULL DEFAULT false,
    "created" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" DATETIME NOT NULL,
    "namespace_name" TEXT NOT NULL,
    CONSTRAINT "User_namespace_name_fkey" FOREIGN KEY ("namespace_name") REFERENCES "Namespace" ("name") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_User" ("admin", "bio", "created", "email", "id", "name", "namespace_name", "updated") SELECT "admin", "bio", "created", "email", "id", "name", "namespace_name", "updated" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "User_namespace_name_key" ON "User"("namespace_name");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
