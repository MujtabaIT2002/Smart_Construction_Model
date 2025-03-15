-- CreateTable
CREATE TABLE "SocietyReview" (
    "id" SERIAL NOT NULL,
    "societyId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SocietyReview_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SocietyReview_societyId_idx" ON "SocietyReview"("societyId");

-- CreateIndex
CREATE INDEX "SocietyReview_userId_idx" ON "SocietyReview"("userId");

-- AddForeignKey
ALTER TABLE "SocietyReview" ADD CONSTRAINT "SocietyReview_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SocietyReview" ADD CONSTRAINT "SocietyReview_societyId_fkey" FOREIGN KEY ("societyId") REFERENCES "Society"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
