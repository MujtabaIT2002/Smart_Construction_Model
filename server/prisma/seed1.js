const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'postgresql://postgres:Mujju2024!@localhost:8000/FYP',
    },
  },
  log: ['query', 'info', 'warn', 'error'],
});

const fs = require('fs');
const csv = require('csv-parser');

const csvFilePath = 'Flask_app/Datasets/Unique_Societies_Table_with_Continuous_IDs.csv';
const batchSize = 50;
const maxRetries = 3; // Number of retry attempts

async function upsertSocieties(batch) {
  for (let retries = 0; retries < maxRetries; retries++) {
    try {
      const insertedRecords = await prisma.$transaction(
        batch.map((data) =>
          prisma.society.upsert({
            where: {
              city_society: {
                city: data.city,
                society: data.society,
              },
            },
            update: {},
            create: data,
          })
        )
      );

      insertedRecords.forEach((record) => {
        console.log(`Inserted Society with ID: ${record.id}, City: ${record.city}, Society: ${record.society}`);
      });
      return;
    } catch (error) {
      if (error.code === 'P2002') {
        console.warn('Duplicate entry found, skipping...');
        return;
      } else if (error.code === 'P2024' && retries < maxRetries - 1) {
        console.warn(`Retrying due to timeout, attempt: ${retries + 1}`);
      } else {
        console.error('Error inserting batch:', error);
        throw error;
      }
    }
  }
}

async function main() {
  let batch = [];
  console.log('Starting to insert new records...');

  fs.createReadStream(csvFilePath)
    .pipe(csv())
    .on('data', async (row) => {
      const { city, location: society, latitude, longitude } = row;
      
      batch.push({
        city,
        society,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
      });

      if (batch.length === batchSize) {
        await upsertSocieties(batch);
        batch = [];
      }
    })
    .on('end', async () => {
      if (batch.length > 0) {
        await upsertSocieties(batch);
      }
      console.log('CSV file successfully processed. All records inserted.');
    });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
