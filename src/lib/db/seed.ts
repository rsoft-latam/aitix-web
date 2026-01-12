import 'dotenv/config';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import { faker } from '@faker-js/faker';

const client = postgres(process.env.DATABASE_URL!, { prepare: false });
const db = drizzle(client, { schema });

async function seed() {
  console.log('Seeding...');

  await db.insert(schema.profiles).values([
    {
      fullName: faker.person.fullName(),
      avatarUrl: faker.image.avatar(),
      whatsappNumber: faker.phone.number(),
      arcWalletAddress: faker.string.alphanumeric(42),
    },
    {
      fullName: faker.person.fullName(),
      avatarUrl: faker.image.avatar(),
      whatsappNumber: faker.phone.number(),
      arcWalletAddress: faker.string.alphanumeric(42),
    },
  ]);

  console.log('Done!');
  await client.end();
  process.exit(0);
}

seed().catch((error) => {
  console.error('Error seeding database:', error);
  
  if (error.code === 'ENOTFOUND') {
    console.error('\n❌ DNS Resolution Error: Cannot connect to database hostname.');
    console.error('\n💡 Solution:');
    console.error('1. Use the Connection Pooler URL (recommended):');
    console.error('   Update your .env file to use the pooler URL:');
    console.error('   DATABASE_URL=postgresql://postgres.xzykezwpknftueypqajk:aitix_db_postgres@aws-1-us-east-2.pooler.supabase.com:6543/postgres');
    console.error('\n2. Or get the correct connection string from Supabase Dashboard:');
    console.error('   - Go to Project Settings > Database');
    console.error('   - Copy the "Connection string" under "Connection pooling"');
    console.error('   - Use port 6543 for pooled connections or 5432 for direct connections');
  }
  
  process.exit(1);
});