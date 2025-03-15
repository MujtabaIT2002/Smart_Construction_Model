const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function countSearchesPerSociety() {
  const result = await prisma.userSearch.groupBy({
    by: ['societyId'],
    _count: {
      societyId: true,
    },
    orderBy: {
      _count: {
        societyId: 'desc',
      },
    },
  });

  // Fetch society names for each societyId
  const societyData = await Promise.all(
    result.map(async (entry) => {
      const society = await prisma.society.findUnique({
        where: { id: entry.societyId },
        select: { society: true }, // Get the society name
      });
      return { societyName: society?.society, searchCount: entry._count.societyId };
    })
  );

  console.log(societyData); // This will print the society names with their search counts
}

countSearchesPerSociety()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
