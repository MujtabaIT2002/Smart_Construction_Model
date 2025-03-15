const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Standard materials data
  const standardMaterialsData = [
    { material: "25 mm o/d Pipe", rate: 19.38, quantity: 0.181 },
    { material: "32 mm o/d Pipe", rate: 6.01, quantity: 0.072 },
    { material: "40 mm o/d Pipe", rate: 4.73, quantity: 0.018 },
    { material: "50 mm o/d Pipe", rate: 8.96, quantity: 0.022 },
    { material: "32 mm o/d Insulation", rate: 5.83, quantity: 0.035 },
    { material: "50 mm o/d Insulation", rate: 13.71, quantity: 0.022 },
    { material: "2\" Dia Pipe", rate: 19.20, quantity: 0.072 },
    { material: "3\" Dia Pipe", rate: 25.72, quantity: 0.072 },
    { material: "4\" Dia Pipe", rate: 18.86, quantity: 0.108 },
    { material: "GI Welded Pipeline 3/4” i/d", rate: 56.04, quantity: 0.135 },
    { material: "Gas Cock 3/4\" i/d", rate: 2.48, quantity: 0.002 },
    { material: "Floor Drains", rate: 9.53, quantity: 0.006 },
    { material: "1\" dia Class \"E\" Pipe", rate: 13.39, quantity: 0.122 },
    { material: "6\" dia Class \"B\" Pipe", rate: 31.84, quantity: 0.045 },
    { material: "Roof Insulation", rate: 246.00, quantity: 0.129 },
    { material: "Termite Proofing", rate: 1600.00, quantity: 0.004 },
    { material: "Water Proofing", rate: 114.00, quantity: 0.129 },
    { material: "Excavation & Backfill + Ghassu", rate: 23.00, quantity: 3.284 },
  ];

  // Insert standard materials data
  for (const data of standardMaterialsData) {
    await prisma.standardMaterial.create({ data });
  }

  // Quality materials data
  const qualityMaterialsData = [
    { material: "Cement", quality: "High", rate: 1510 },
    { material: "Cement", quality: "Medium", rate: 1205 },
    { material: "Cement", quality: "Low", rate: 1095 },
    { material: "Bricks", quality: "High", rate: 22 },
    { material: "Bricks", quality: "Medium", rate: 16 },
    { material: "Bricks", quality: "Low", rate: 12 },
    { material: "Steel", quality: "High", rate: 280 },
    { material: "Steel", quality: "Medium", rate: 276 },
    { material: "Steel", quality: "Low", rate: 272 },
    { material: "Sand", quality: "High", rate: 110 },
    { material: "Sand", quality: "Medium", rate: 60 },
    { material: "Sand", quality: "Low", rate: 44 },
    { material: "Aggregate", quality: "High", rate: 150 },
    { material: "Aggregate", quality: "Medium", rate: 120 },
    { material: "Aggregate", quality: "Low", rate: 80 },
  ];

  // Insert quality materials data
  for (const data of qualityMaterialsData) {
    await prisma.qualityMaterial.create({ data });
  }

  // Quality material quantities
  const qualityMaterialQuantities = [
    { material: "Bricks", quantity: 50.01 },
    { material: "Cement", quantity: 0.54 },
    { material: "Sand", quantity: 2.69 },
    { material: "Aggregate", quantity: 1.53 },
    { material: "Steel", quantity: 2.96 },
  ];

  // Insert quality material quantities
  for (const data of qualityMaterialQuantities) {
    await prisma.qualityMaterialQuantity.create({ data });
  }

  // Electrical cost data
  const electricalCostData = [
    { item: "Switch Boards", quality: "High", rate: 1500 },
    { item: "3/4” dia. Electrical PVC Conduit", quality: "High", rate: 35 },
    { item: "1” dia. Electrical PVC Conduit", quality: "High", rate: 38 },
    { item: "1.5” dia. Electrical PVC Conduit", quality: "High", rate: 45 },
    { item: "2” dia. Electrical PVC Conduit", quality: "High", rate: 55 },
    { item: "PVC Ceiling Fan Hook", quality: "High", rate: 600 },
    { item: "Switch Boards", quality: "Medium", rate: 1390 },
    { item: "3/4” dia. Electrical PVC Conduit", quality: "Medium", rate: 30 },
    { item: "1” dia. Electrical PVC Conduit", quality: "Medium", rate: 32 },
    { item: "1.5” dia. Electrical PVC Conduit", quality: "Medium", rate: 41 },
    { item: "2” dia. Electrical PVC Conduit", quality: "Medium", rate: 50 },
    { item: "PVC Ceiling Fan Hook", quality: "Medium", rate: 547 },
    { item: "Switch Boards", quality: "Low", rate: 1200 },
    { item: "3/4” dia. Electrical PVC Conduit", quality: "Low", rate: 25 },
    { item: "1” dia. Electrical PVC Conduit", quality: "Low", rate: 28 },
    { item: "1.5” dia. Electrical PVC Conduit", quality: "Low", rate: 37 },
    { item: "2” dia. Electrical PVC Conduit", quality: "Low", rate: 45 },
    { item: "PVC Ceiling Fan Hook", quality: "Low", rate: 500 },
  ];

  // Insert electrical cost data
  for (const data of electricalCostData) {
    await prisma.electricalCost.create({ data });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
