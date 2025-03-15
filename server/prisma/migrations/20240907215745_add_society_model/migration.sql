-- CreateTable
CREATE TABLE "Society" (
    "id" SERIAL NOT NULL,
    "city" TEXT NOT NULL,
    "society" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Society_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Society_city_society_key" ON "Society"("city", "society");
