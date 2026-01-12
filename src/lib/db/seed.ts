import 'dotenv/config';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import { faker } from '@faker-js/faker';

const client = postgres(process.env.DATABASE_URL!, { prepare: false });
const db = drizzle(client, { schema });

async function seed() {
  console.log('Seeding database...');

  // 1. PROFILES - Base table, no dependencies
  console.log('Seeding profiles...');
  const profilesData = await db.insert(schema.profiles).values([
    {
      fullName: 'John Doe',
      avatarUrl: faker.image.avatar(),
      whatsappNumber: '+1234567890',
      arcWalletAddress: '0x' + faker.string.alphanumeric(40).toLowerCase(),
    },
    {
      fullName: 'Jane Smith',
      avatarUrl: faker.image.avatar(),
      whatsappNumber: '+1987654321',
      arcWalletAddress: '0x' + faker.string.alphanumeric(40).toLowerCase(),
    },
    {
      fullName: faker.person.fullName(),
      avatarUrl: faker.image.avatar(),
      whatsappNumber: faker.phone.number(),
      arcWalletAddress: '0x' + faker.string.alphanumeric(40).toLowerCase(),
    },
    {
      fullName: faker.person.fullName(),
      avatarUrl: faker.image.avatar(),
      whatsappNumber: faker.phone.number(),
      arcWalletAddress: '0x' + faker.string.alphanumeric(40).toLowerCase(),
    },
  ]).returning();
  console.log(`  ✓ Created ${profilesData.length} profiles`);

  // 2. ARTISTS - Base table, no dependencies
  console.log('Seeding artists...');
  const artistsData = await db.insert(schema.artists).values([
    {
      name: 'Taylor Swift',
      genre: 'Pop',
      imageUrl: '/Taylor-Swift.png',
      description: 'Award-winning pop superstar',
      officialLinks: {
        website: 'https://taylorswift.com',
        spotify: 'https://open.spotify.com/artist/06HL4z0CvFAxyc27GXpf02',
        instagram: 'https://instagram.com/taylorswift',
        twitter: 'https://twitter.com/taylorswift13',
      },
    },
    {
      name: 'Ed Sheeran',
      genre: 'Pop',
      imageUrl: '/EdSheeran.png',
      description: 'British singer-songwriter',
      officialLinks: {
        website: 'https://edsheeran.com',
        spotify: 'https://open.spotify.com/artist/6eUKZXaKkcviH0Ku9w2n3V',
        instagram: 'https://instagram.com/teddysphotos',
      },
    },
    {
      name: 'Coldplay',
      genre: 'Rock',
      imageUrl: '/Coldplay.png',
      description: 'British rock band',
      officialLinks: {
        website: 'https://coldplay.com',
        spotify: 'https://open.spotify.com/artist/4gzpq5DPGxSnKTe4SA8HAU',
        instagram: 'https://instagram.com/coldplay',
      },
    },
    {
      name: 'The Weeknd',
      genre: 'R&B',
      imageUrl: '/TheWeeknd.png',
      description: 'Canadian singer-songwriter',
      officialLinks: {
        website: 'https://theweeknd.com',
        spotify: 'https://open.spotify.com/artist/1Xyo4u8uXC1ZmMpatF05PJ',
        instagram: 'https://instagram.com/theweeknd',
      },
    },
    {
      name: 'Billie Eilish',
      genre: 'Alternative',
      imageUrl: '/BillieEilish.png',
      description: 'Grammy-winning alternative pop artist',
      officialLinks: {
        website: 'https://billieeilish.com',
        spotify: 'https://open.spotify.com/artist/6qqNVTkY8uBg9cP3Jd7DAH',
        instagram: 'https://instagram.com/billieeilish',
      },
    },
    {
      name: 'BTS',
      genre: 'K-Pop',
      imageUrl: '/BTS.png',
      description: 'Korean pop group',
      officialLinks: {
        website: 'https://bts-official.com',
        spotify: 'https://open.spotify.com/artist/3Nrfpe0tUJi4K4DXYWgMUX',
        instagram: 'https://instagram.com/bts.bighitofficial',
      },
    },
  ]).returning();
  console.log(`  ✓ Created ${artistsData.length} artists`);

  // 3. VENUES - Base table, no dependencies
  console.log('Seeding venues...');
  const venuesData = await db.insert(schema.venues).values([
    {
      name: 'Madison Square Garden',
      city: 'New York',
      country: 'USA',
      address: '4 Pennsylvania Plaza, New York, NY 10001',
      timezone: 'America/New_York',
      capacity: 20000,
      coordinates: { lat: 40.7505, lng: -73.9934 },
    },
    {
      name: 'Staples Center',
      city: 'Los Angeles',
      country: 'USA',
      address: '1111 S Figueroa St, Los Angeles, CA 90015',
      timezone: 'America/Los_Angeles',
      capacity: 19000,
      coordinates: { lat: 34.0431, lng: -118.2673 },
    },
    {
      name: 'Wembley Stadium',
      city: 'London',
      country: 'UK',
      address: 'Wembley, London HA9 0WS',
      timezone: 'Europe/London',
      capacity: 90000,
      coordinates: { lat: 51.5560, lng: -0.2795 },
    },
    {
      name: 'O2 Arena',
      city: 'London',
      country: 'UK',
      address: 'Peninsula Square, London SE10 0DX',
      timezone: 'Europe/London',
      capacity: 20000,
      coordinates: { lat: 51.5030, lng: 0.0032 },
    },
    {
      name: 'Mercedes-Benz Stadium',
      city: 'Atlanta',
      country: 'USA',
      address: '1 AMB Drive NW, Atlanta, GA 30313',
      timezone: 'America/New_York',
      capacity: 71000,
      coordinates: { lat: 33.7555, lng: -84.4013 },
    },
    {
      name: 'SoFi Stadium',
      city: 'Los Angeles',
      country: 'USA',
      address: '1001 Stadium Drive, Inglewood, CA 90301',
      timezone: 'America/Los_Angeles',
      capacity: 70000,
      coordinates: { lat: 33.9533, lng: -118.3387 },
    },
  ]).returning();
  console.log(`  ✓ Created ${venuesData.length} venues`);

  // 4. CONCERTS - Depends on artists and venues
  console.log('Seeding concerts...');
  const concertsData = await db.insert(schema.concerts).values([
    {
      artistId: artistsData[0].id, // Taylor Swift
      venueId: venuesData[0].id, // Madison Square Garden
      date: new Date('2024-04-20T19:00:00Z'),
      status: 'on_sale',
    },
    {
      artistId: artistsData[1].id, // Ed Sheeran
      venueId: venuesData[2].id, // Wembley Stadium
      date: new Date('2024-05-10T20:00:00Z'),
      status: 'on_sale',
    },
    {
      artistId: artistsData[2].id, // Coldplay
      venueId: venuesData[2].id, // Wembley Stadium
      date: new Date('2024-06-15T20:00:00Z'),
      status: 'upcoming',
    },
    {
      artistId: artistsData[3].id, // The Weeknd
      venueId: venuesData[4].id, // Mercedes-Benz Stadium
      date: new Date('2024-07-05T21:00:00Z'),
      status: 'upcoming',
    },
    {
      artistId: artistsData[4].id, // Billie Eilish
      venueId: venuesData[3].id, // O2 Arena
      date: new Date('2024-08-12T20:30:00Z'),
      status: 'upcoming',
    },
    {
      artistId: artistsData[5].id, // BTS
      venueId: venuesData[5].id, // SoFi Stadium
      date: new Date('2024-09-20T19:00:00Z'),
      status: 'upcoming',
    },
  ]).returning();
  console.log(`  ✓ Created ${concertsData.length} concerts`);

  // 5. TICKET_TIERS - Depends on concerts
  console.log('Seeding ticket tiers...');
  const ticketTiersData = await db.insert(schema.ticketTiers).values([
    // Taylor Swift - MSG
    {
      concertId: concertsData[0].id,
      name: 'General Admission',
      priceUsdc: '149.99',
      totalCapacity: 5000,
      remainingInventory: 3200,
      metadata: {
        description: 'General admission tickets',
        maxPerOrder: 4,
      },
    },
    {
      concertId: concertsData[0].id,
      name: 'VIP',
      priceUsdc: '349.99',
      totalCapacity: 500,
      remainingInventory: 150,
      metadata: {
        description: 'VIP experience with meet & greet',
        perks: ['Meet & Greet', 'Early Entry', 'VIP Lounge Access'],
        maxPerOrder: 2,
      },
    },
    // Ed Sheeran - Wembley
    {
      concertId: concertsData[1].id,
      name: 'General Admission',
      priceUsdc: '89.99',
      totalCapacity: 30000,
      remainingInventory: 18500,
      metadata: {
        description: 'General admission standing tickets',
        maxPerOrder: 6,
      },
    },
    {
      concertId: concertsData[1].id,
      name: 'Premium',
      priceUsdc: '199.99',
      totalCapacity: 5000,
      remainingInventory: 2100,
      metadata: {
        description: 'Premium seating with better view',
        seatSection: 'Level 1',
        maxPerOrder: 4,
      },
    },
    // Coldplay - Wembley
    {
      concertId: concertsData[2].id,
      name: 'General Admission',
      priceUsdc: '79.99',
      totalCapacity: 25000,
      remainingInventory: 25000,
      metadata: {
        description: 'General admission tickets',
        maxPerOrder: 4,
      },
    },
    {
      concertId: concertsData[2].id,
      name: 'VIP',
      priceUsdc: '249.99',
      totalCapacity: 2000,
      remainingInventory: 2000,
      metadata: {
        description: 'VIP package',
        perks: ['VIP Lounge', 'Commemorative Item'],
        maxPerOrder: 2,
      },
    },
  ]).returning();
  console.log(`  ✓ Created ${ticketTiersData.length} ticket tiers`);

  // 6. USER_CREDENTIALS - Depends on profiles
  console.log('Seeding user credentials...');
  const userCredentialsData = await db.insert(schema.userCredentials).values([
    {
      userId: profilesData[0].id,
      didUri: `did:arc:${faker.string.alphanumeric(64)}`,
      publicKey: faker.string.alphanumeric(128),
      keyType: 'Ed25519',
      isActive: true,
    },
    {
      userId: profilesData[1].id,
      didUri: `did:arc:${faker.string.alphanumeric(64)}`,
      publicKey: faker.string.alphanumeric(128),
      keyType: 'Ed25519',
      isActive: true,
    },
    {
      userId: profilesData[0].id,
      didUri: `did:arc:${faker.string.alphanumeric(64)}`,
      publicKey: faker.string.alphanumeric(128),
      keyType: 'secp256k1',
      isActive: false,
    },
  ]).returning();
  console.log(`  ✓ Created ${userCredentialsData.length} user credentials`);

  // 7. AUTH_NONCES - Depends on profiles
  console.log('Seeding auth nonces...');
  const authNoncesData = await db.insert(schema.authNonces).values([
    {
      userId: profilesData[0].id,
      nonceValue: faker.string.alphanumeric(32),
      expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
      used: false,
    },
    {
      userId: profilesData[1].id,
      nonceValue: faker.string.alphanumeric(32),
      expiresAt: new Date(Date.now() + 15 * 60 * 1000),
      used: false,
    },
    {
      userId: profilesData[0].id,
      nonceValue: faker.string.alphanumeric(32),
      expiresAt: new Date(Date.now() - 60 * 1000), // Expired
      used: true,
    },
  ]).returning();
  console.log(`  ✓ Created ${authNoncesData.length} auth nonces`);

  // 8. AGENTS - Depends on profiles and concerts
  console.log('Seeding agents...');
  const agentsData = await db.insert(schema.agents).values([
    {
      userId: profilesData[0].id,
      concertId: concertsData[0].id, // Taylor Swift
      maxBudgetUsdc: '500.00',
      status: 'active',
      ap2IntentMandate: {
        maxPrice: 350,
        preferredTiers: ['VIP', 'General Admission'],
        quantity: 2,
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        autoApprove: true,
        fallbackBehavior: 'next_best',
      },
    },
    {
      userId: profilesData[1].id,
      concertId: concertsData[1].id, // Ed Sheeran
      maxBudgetUsdc: '300.00',
      status: 'searching',
      ap2IntentMandate: {
        maxPrice: 200,
        preferredTiers: ['Premium', 'General Admission'],
        quantity: 3,
        validUntil: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
        autoApprove: false,
        fallbackBehavior: 'wait',
      },
    },
    {
      userId: profilesData[0].id,
      concertId: concertsData[2].id, // Coldplay
      maxBudgetUsdc: '400.00',
      status: 'idle',
      ap2IntentMandate: {
        maxPrice: 250,
        preferredTiers: ['VIP'],
        quantity: 2,
        validUntil: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
        autoApprove: true,
        fallbackBehavior: 'next_best',
      },
    },
  ]).returning();
  console.log(`  ✓ Created ${agentsData.length} agents`);

  // 9. AGENT_LOGS - Depends on agents
  console.log('Seeding agent logs...');
  const agentLogsData = await db.insert(schema.agentLogs).values([
    {
      agentId: agentsData[0].id,
      eventType: 'started',
      message: 'Agent started monitoring for tickets',
      payload: { timestamp: new Date().toISOString() },
    },
    {
      agentId: agentsData[0].id,
      eventType: 'searching',
      message: 'Searching for available tickets',
      payload: { tier: 'VIP', maxPrice: 350 },
    },
    {
      agentId: agentsData[1].id,
      eventType: 'started',
      message: 'Agent activated',
      payload: { timestamp: new Date().toISOString() },
    },
    {
      agentId: agentsData[1].id,
      eventType: 'price_check',
      message: 'Checked ticket prices',
      payload: { currentPrice: 199.99, targetPrice: 200 },
    },
    {
      agentId: agentsData[0].id,
      eventType: 'found_ticket',
      message: 'Found matching ticket',
      payload: { tier: 'VIP', price: 349.99, quantity: 2 },
    },
  ]).returning();
  console.log(`  ✓ Created ${agentLogsData.length} agent logs`);

  // 10. WATCHLIST - Depends on profiles and concerts
  console.log('Seeding watchlist...');
  const watchlistData = await db.insert(schema.watchlist).values([
    {
      userId: profilesData[0].id,
      concertId: concertsData[3].id, // The Weeknd
      targetPriceUsdc: '150.00',
      notifyOnly: false,
    },
    {
      userId: profilesData[1].id,
      concertId: concertsData[4].id, // Billie Eilish
      targetPriceUsdc: '200.00',
      notifyOnly: true,
    },
    {
      userId: profilesData[0].id,
      concertId: concertsData[5].id, // BTS
      targetPriceUsdc: '180.00',
      notifyOnly: false,
    },
  ]).returning();
  console.log(`  ✓ Created ${watchlistData.length} watchlist items`);

  // 11. ORDERS - Depends on profiles and agents
  console.log('Seeding orders...');
  const ordersData = await db.insert(schema.orders).values([
    {
      userId: profilesData[0].id,
      agentId: agentsData[0].id,
      totalAmountUsdc: '699.98',
      status: 'completed',
    },
    {
      userId: profilesData[1].id,
      agentId: agentsData[1].id,
      totalAmountUsdc: '599.97',
      status: 'processing',
    },
    {
      userId: profilesData[0].id,
      agentId: null,
      totalAmountUsdc: '249.99',
      status: 'pending',
    },
  ]).returning();
  console.log(`  ✓ Created ${ordersData.length} orders`);

  // 12. TRANSACTIONS - Depends on orders
  console.log('Seeding transactions...');
  const transactionsData = await db.insert(schema.transactions).values([
    {
      orderId: ordersData[0].id,
      arcTxHash: '0x' + faker.string.alphanumeric(64).toLowerCase(),
      paymentMethod: 'x402',
      ap2PaymentMandate: {
        amount: 699.98,
        currency: 'USDC',
        recipient: profilesData[0].arcWalletAddress || '',
        memo: `Order ${ordersData[0].id}`,
        signature: faker.string.alphanumeric(128),
        nonce: faker.string.alphanumeric(32),
      },
      confirmedAt: new Date(),
    },
    {
      orderId: ordersData[1].id,
      arcTxHash: null,
      paymentMethod: 'x402',
      ap2PaymentMandate: {
        amount: 599.97,
        currency: 'USDC',
        recipient: profilesData[1].arcWalletAddress || '',
        memo: `Order ${ordersData[1].id}`,
        signature: faker.string.alphanumeric(128),
        nonce: faker.string.alphanumeric(32),
      },
      confirmedAt: null,
    },
  ]).returning();
  console.log(`  ✓ Created ${transactionsData.length} transactions`);

  // 13. ISSUED_TICKETS - Depends on orders and ticket_tiers
  console.log('Seeding issued tickets...');
  const issuedTicketsData = await db.insert(schema.issuedTickets).values([
    {
      orderId: ordersData[0].id,
      ticketTierId: ticketTiersData[1].id, // VIP
      secretCode: faker.string.alphanumeric(32).toUpperCase(),
      qrData: Buffer.from(faker.string.alphanumeric(128)).toString('base64'),
      isTransferred: false,
    },
    {
      orderId: ordersData[0].id,
      ticketTierId: ticketTiersData[1].id, // VIP
      secretCode: faker.string.alphanumeric(32).toUpperCase(),
      qrData: Buffer.from(faker.string.alphanumeric(128)).toString('base64'),
      isTransferred: false,
    },
    {
      orderId: ordersData[1].id,
      ticketTierId: ticketTiersData[3].id, // Premium
      secretCode: faker.string.alphanumeric(32).toUpperCase(),
      qrData: Buffer.from(faker.string.alphanumeric(128)).toString('base64'),
      isTransferred: false,
    },
  ]).returning();
  console.log(`  ✓ Created ${issuedTicketsData.length} issued tickets`);

  // 14. NOTIFICATIONS - Depends on profiles
  console.log('Seeding notifications...');
  const notificationsData = await db.insert(schema.notifications).values([
    {
      userId: profilesData[0].id,
      type: 'agent_update',
      status: 'unread',
      content: {
        title: 'Agent Status Update',
        body: 'Your agent found matching tickets for Taylor Swift concert',
        actionUrl: '/dashboard/agents',
        metadata: { agentId: agentsData[0].id },
      },
    },
    {
      userId: profilesData[0].id,
      type: 'purchase_complete',
      status: 'read',
      content: {
        title: 'Purchase Complete',
        body: 'Your order has been completed successfully',
        actionUrl: '/dashboard/orders',
        metadata: { orderId: ordersData[0].id },
      },
    },
    {
      userId: profilesData[1].id,
      type: 'price_alert',
      status: 'unread',
      content: {
        title: 'Price Alert',
        body: 'Ticket prices for Billie Eilish are now below your target',
        actionUrl: '/dashboard/watchlist',
        metadata: { concertId: concertsData[4].id },
      },
    },
    {
      userId: profilesData[1].id,
      type: 'ticket_available',
      status: 'unread',
      content: {
        title: 'Tickets Available',
        body: 'New tickets available for Ed Sheeran concert',
        actionUrl: '/dashboard/concerts',
        metadata: { concertId: concertsData[1].id },
      },
    },
  ]).returning();
  console.log(`  ✓ Created ${notificationsData.length} notifications`);

  console.log('\n✅ Seeding completed successfully!');
  console.log(`   - ${profilesData.length} profiles`);
  console.log(`   - ${artistsData.length} artists`);
  console.log(`   - ${venuesData.length} venues`);
  console.log(`   - ${concertsData.length} concerts`);
  console.log(`   - ${ticketTiersData.length} ticket tiers`);
  console.log(`   - ${userCredentialsData.length} user credentials`);
  console.log(`   - ${authNoncesData.length} auth nonces`);
  console.log(`   - ${agentsData.length} agents`);
  console.log(`   - ${agentLogsData.length} agent logs`);
  console.log(`   - ${watchlistData.length} watchlist items`);
  console.log(`   - ${ordersData.length} orders`);
  console.log(`   - ${transactionsData.length} transactions`);
  console.log(`   - ${issuedTicketsData.length} issued tickets`);
  console.log(`   - ${notificationsData.length} notifications`);

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
    console.error('   DATABASE_URL=postgresql://postgres.xzykezwpknftueypqajk:[password]@aws-1-us-east-2.pooler.supabase.com:6543/postgres');
    console.error('\n2. Or get the correct connection string from Supabase Dashboard:');
    console.error('   - Go to Project Settings > Database');
    console.error('   - Copy the "Connection string" under "Connection pooling"');
    console.error('   - Use port 6543 for pooled connections or 5432 for direct connections');
  }
  
  process.exit(1);
});