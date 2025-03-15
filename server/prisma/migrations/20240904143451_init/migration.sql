-- CreateTable
CREATE TABLE "StandardMaterial" (
    "id" SERIAL NOT NULL,
    "material" TEXT NOT NULL,
    "rate" DOUBLE PRECISION NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "StandardMaterial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QualityMaterial" (
    "id" SERIAL NOT NULL,
    "material" TEXT NOT NULL,
    "quality" TEXT NOT NULL,
    "rate" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "QualityMaterial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QualityMaterialQuantity" (
    "id" SERIAL NOT NULL,
    "material" TEXT NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "QualityMaterialQuantity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ElectricalCost" (
    "id" SERIAL NOT NULL,
    "item" TEXT NOT NULL,
    "quality" TEXT NOT NULL,
    "rate" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "ElectricalCost_pkey" PRIMARY KEY ("id")
);
