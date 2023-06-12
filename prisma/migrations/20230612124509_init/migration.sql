-- CreateTable
CREATE TABLE "_in_library" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_in_library_A_fkey" FOREIGN KEY ("A") REFERENCES "Committee" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_in_library_B_fkey" FOREIGN KEY ("B") REFERENCES "Library" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "_in_library_AB_unique" ON "_in_library"("A", "B");

-- CreateIndex
CREATE INDEX "_in_library_B_index" ON "_in_library"("B");
