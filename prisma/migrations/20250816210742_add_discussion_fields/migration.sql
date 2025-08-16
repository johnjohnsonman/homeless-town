-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Post" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "author" TEXT,
    "type" TEXT NOT NULL DEFAULT 'post',
    "marketTrend" TEXT,
    "isHot" BOOLEAN NOT NULL DEFAULT false,
    "isNew" BOOLEAN NOT NULL DEFAULT true,
    "isPopular" BOOLEAN NOT NULL DEFAULT false,
    "urgent" BOOLEAN NOT NULL DEFAULT false,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "upvotes" INTEGER NOT NULL DEFAULT 0,
    "downvotes" INTEGER NOT NULL DEFAULT 0,
    "views" INTEGER NOT NULL DEFAULT 0,
    "comments" INTEGER NOT NULL DEFAULT 0,
    "adminPick" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_Post" ("adminPick", "content", "createdAt", "id", "slug", "title", "updatedAt", "upvotes", "views") SELECT "adminPick", "content", "createdAt", "id", "slug", "title", "updatedAt", "upvotes", "views" FROM "Post";
DROP TABLE "Post";
ALTER TABLE "new_Post" RENAME TO "Post";
CREATE UNIQUE INDEX "Post_slug_key" ON "Post"("slug");
CREATE INDEX "Post_createdAt_idx" ON "Post"("createdAt");
CREATE INDEX "Post_upvotes_idx" ON "Post"("upvotes");
CREATE INDEX "Post_adminPick_idx" ON "Post"("adminPick");
CREATE INDEX "Post_type_idx" ON "Post"("type");
CREATE INDEX "Post_marketTrend_idx" ON "Post"("marketTrend");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
