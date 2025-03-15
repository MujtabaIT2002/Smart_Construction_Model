-- CreateTable
CREATE TABLE "Amenity" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "societyId" INTEGER NOT NULL,

    CONSTRAINT "Amenity_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Amenity_type_societyId_key" ON "Amenity"("type", "societyId");

-- AddForeignKey
ALTER TABLE "Amenity" ADD CONSTRAINT "Amenity_societyId_fkey" FOREIGN KEY ("societyId") REFERENCES "Society"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
