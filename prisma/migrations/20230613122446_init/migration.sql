-- CreateTable
CREATE TABLE "User" (
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

-- CreateTable
CREATE TABLE "Team" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "bio" TEXT NOT NULL,
    "created" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" DATETIME NOT NULL,
    "namespace_name" TEXT NOT NULL,
    CONSTRAINT "Team_namespace_name_fkey" FOREIGN KEY ("namespace_name") REFERENCES "Namespace" ("name") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Membership" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "created" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" DATETIME NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'member',
    "team_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    CONSTRAINT "Membership_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "Team" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Membership_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Log" (
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

-- CreateTable
CREATE TABLE "Namespace" (
    "name" TEXT NOT NULL PRIMARY KEY,
    "created" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Councilor" (
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

-- CreateTable
CREATE TABLE "Committee" (
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

-- CreateTable
CREATE TABLE "Conversation" (
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

-- CreateTable
CREATE TABLE "Library" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "visibility" BOOLEAN NOT NULL,
    "created" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" DATETIME NOT NULL,
    "namespace_name" TEXT NOT NULL,
    CONSTRAINT "Library_namespace_name_fkey" FOREIGN KEY ("namespace_name") REFERENCES "Namespace" ("name") ON DELETE CASCADE ON UPDATE CASCADE
);

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

-- CreateTable
CREATE TABLE "Data" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "content" TEXT NOT NULL,
    "created" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "content" TEXT NOT NULL,
    "created" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "_in_committee" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_in_committee_A_fkey" FOREIGN KEY ("A") REFERENCES "Committee" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_in_committee_B_fkey" FOREIGN KEY ("B") REFERENCES "Councilor" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_tagged" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_tagged_A_fkey" FOREIGN KEY ("A") REFERENCES "Conversation" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_tagged_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_contains" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_contains_A_fkey" FOREIGN KEY ("A") REFERENCES "Data" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_contains_B_fkey" FOREIGN KEY ("B") REFERENCES "Library" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_namespace_name_key" ON "User"("namespace_name");

-- CreateIndex
CREATE UNIQUE INDEX "Team_namespace_name_key" ON "Team"("namespace_name");

-- CreateIndex
CREATE UNIQUE INDEX "Data_content_key" ON "Data"("content");

-- CreateIndex
CREATE UNIQUE INDEX "_in_committee_AB_unique" ON "_in_committee"("A", "B");

-- CreateIndex
CREATE INDEX "_in_committee_B_index" ON "_in_committee"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_tagged_AB_unique" ON "_tagged"("A", "B");

-- CreateIndex
CREATE INDEX "_tagged_B_index" ON "_tagged"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_contains_AB_unique" ON "_contains"("A", "B");

-- CreateIndex
CREATE INDEX "_contains_B_index" ON "_contains"("B");
