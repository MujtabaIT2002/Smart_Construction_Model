// populateUserSearch.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Step 1: Fetch all societies and users
  const societies = await prisma.society.findMany();
  const users = await prisma.user.findMany();

  if (societies.length === 0 || users.length === 0) {
    console.error('No societies or users found in the database.');
    process.exit(1);
  }

  // Function to get a random item from an array
  const getRandomItem = (array) => array[Math.floor(Math.random() * array.length)];

  // Step 2: Create 300 random user search records
  for (let i = 0; i < 300; i++) {
    // Select a random user
    const randomUser = getRandomItem(users);
    // Select a random society
    const randomSociety = getRandomItem(societies);

    try {
      // Insert the record into UserSearch
      await prisma.userSearch.create({
        data: {
          userId: randomUser.id,
          userName: randomUser.name,
          societyId: randomSociety.id,
          societyName: randomSociety.society,
        },
      });

      console.log(`Inserted search record ${i + 1}: User - ${randomUser.name}, Society - ${randomSociety.society}`);
    } catch (error) {
      console.error(`Error inserting search record ${i + 1}:`, error);
    }
  }

  console.log('Successfully populated UserSearch with 300 records.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
