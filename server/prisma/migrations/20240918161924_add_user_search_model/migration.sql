-- CreateTable
CREATE TABLE "UserSearch" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "societyId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserSearch_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "UserSearch_userId_idx" ON "UserSearch"("userId");

-- CreateIndex
CREATE INDEX "UserSearch_societyId_idx" ON "UserSearch"("societyId");

-- AddForeignKey
ALTER TABLE "UserSearch" ADD CONSTRAINT "UserSearch_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSearch" ADD CONSTRAINT "UserSearch_societyId_fkey" FOREIGN KEY ("societyId") REFERENCES "Society"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
