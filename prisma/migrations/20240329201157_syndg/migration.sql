-- CreateTable
CREATE TABLE "SavedRoadmap" (
    "id" TEXT NOT NULL,
    "roadmapId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "SavedRoadmap_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SavedRoadmap" ADD CONSTRAINT "SavedRoadmap_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
