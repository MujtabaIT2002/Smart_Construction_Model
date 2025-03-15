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

  // Function to generate a random review rating (between 1-5)
  const getRandomRating = () => Math.floor(Math.random() * 5) + 1;

  // Step 2: Populate each society with random reviews
  let reviewCount = 0;
  for (const society of societies) {
    // Add between 5 to 15 reviews for each society
    const numberOfReviews = Math.floor(Math.random() * 11) + 5;

    for (let i = 0; i < numberOfReviews; i++) {
      // Select a random user
      const randomUser = getRandomItem(users);

      try {
        // Insert the review into SocietyReview
        await prisma.societyReview.create({
          data: {
            societyId: society.id,
            userId: randomUser.id,
            rating: getRandomRating(),
            comment: `This is a review for ${society.society} by ${randomUser.name}`,
          },
        });

        reviewCount++;
        console.log(
          `Inserted review ${reviewCount}: Society - ${society.society}, User - ${randomUser.name}, Rating - ${getRandomRating()}`
        );
      } catch (error) {
        console.error(`Error inserting review ${reviewCount}:`, error);
      }
    }

    console.log(`Added ${numberOfReviews} reviews for society: ${society.society}`);
  }

  console.log(`Successfully populated SocietyReview with ${reviewCount} records.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
