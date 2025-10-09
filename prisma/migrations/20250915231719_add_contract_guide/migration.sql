-- CreateTable
CREATE TABLE "ContractGuide" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "difficulty" TEXT NOT NULL,
    "readTime" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "downloads" INTEGER NOT NULL DEFAULT 0,
    "rating" REAL NOT NULL DEFAULT 0,
    "isNew" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "ContractGuideTag" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "guideId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    CONSTRAINT "ContractGuideTag_guideId_fkey" FOREIGN KEY ("guideId") REFERENCES "ContractGuide" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "ContractGuide_category_idx" ON "ContractGuide"("category");

-- CreateIndex
CREATE INDEX "ContractGuide_createdAt_idx" ON "ContractGuide"("createdAt");

-- CreateIndex
CREATE INDEX "ContractGuide_isNew_idx" ON "ContractGuide"("isNew");

-- CreateIndex
CREATE INDEX "ContractGuideTag_guideId_idx" ON "ContractGuideTag"("guideId");

-- CreateIndex
CREATE INDEX "ContractGuideTag_name_idx" ON "ContractGuideTag"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ContractGuideTag_guideId_name_key" ON "ContractGuideTag"("guideId", "name");
