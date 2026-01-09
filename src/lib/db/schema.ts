import {
  pgTable,
  uuid,
  text,
  timestamp,
  boolean,
  numeric,
  integer,
  jsonb,
  varchar,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// =============================================================================
// 1. PROFILES - Extended user profiles (linked to Supabase auth.users)
// =============================================================================
export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey().defaultRandom(),
  fullName: text("full_name"),
  avatarUrl: text("avatar_url"),
  whatsappNumber: text("whatsapp_number"),
  arcWalletAddress: text("arc_wallet_address"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// =============================================================================
// 2. USER_CREDENTIALS - DID credentials for signing
// =============================================================================
export const userCredentials = pgTable("user_credentials", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .references(() => profiles.id, { onDelete: "cascade" })
    .notNull(),
  didUri: text("did_uri").notNull(),
  publicKey: text("public_key").notNull(),
  keyType: varchar("key_type", { length: 50 }).notNull(), // e.g., "Ed25519", "secp256k1"
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// =============================================================================
// 3. AUTH_NONCES - Nonces for authentication challenges
// =============================================================================
export const authNonces = pgTable("auth_nonces", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .references(() => profiles.id, { onDelete: "cascade" })
    .notNull(),
  nonceValue: text("nonce_value").notNull().unique(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  used: boolean("used").default(false).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// =============================================================================
// 4. ARTISTS - Artist catalog
// =============================================================================
export const artists = pgTable("artists", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  genre: text("genre"),
  imageUrl: text("image_url"),
  description: text("description"),
  officialLinks: jsonb("official_links").$type<{
    website?: string;
    spotify?: string;
    instagram?: string;
    twitter?: string;
    youtube?: string;
  }>(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// =============================================================================
// 5. VENUES - Event venues/locations
// =============================================================================
export const venues = pgTable("venues", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  city: text("city").notNull(),
  country: text("country").notNull(),
  address: text("address"),
  timezone: varchar("timezone", { length: 50 }).notNull(),
  capacity: integer("capacity"),
  coordinates: jsonb("coordinates").$type<{
    lat: number;
    lng: number;
  }>(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// =============================================================================
// 6. CONCERTS - Events/concerts
// =============================================================================
export const concerts = pgTable("concerts", {
  id: uuid("id").primaryKey().defaultRandom(),
  artistId: uuid("artist_id")
    .references(() => artists.id, { onDelete: "cascade" })
    .notNull(),
  venueId: uuid("venue_id")
    .references(() => venues.id, { onDelete: "cascade" })
    .notNull(),
  date: timestamp("date", { withTimezone: true }).notNull(),
  status: varchar("status", { length: 50 }).default("upcoming").notNull(), // upcoming, on_sale, sold_out, cancelled, completed
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// =============================================================================
// 7. TICKET_TIERS - Ticket levels and pricing
// =============================================================================
export const ticketTiers = pgTable("ticket_tiers", {
  id: uuid("id").primaryKey().defaultRandom(),
  concertId: uuid("concert_id")
    .references(() => concerts.id, { onDelete: "cascade" })
    .notNull(),
  name: text("name").notNull(), // e.g., "General", "VIP", "Platinum"
  priceUsdc: numeric("price_usdc", { precision: 10, scale: 2 }).notNull(),
  totalCapacity: integer("total_capacity").notNull(),
  remainingInventory: integer("remaining_inventory").notNull(),
  metadata: jsonb("metadata").$type<{
    description?: string;
    perks?: string[];
    seatSection?: string;
    maxPerOrder?: number;
  }>(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// =============================================================================
// 8. AGENTS - Autonomous purchasing agents
// =============================================================================
export const agents = pgTable("agents", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .references(() => profiles.id, { onDelete: "cascade" })
    .notNull(),
  concertId: uuid("concert_id")
    .references(() => concerts.id, { onDelete: "cascade" })
    .notNull(),
  maxBudgetUsdc: numeric("max_budget_usdc", { precision: 10, scale: 2 }).notNull(),
  status: varchar("status", { length: 50 }).default("idle").notNull(), // idle, active, searching, purchasing, completed, failed, cancelled
  ap2IntentMandate: jsonb("ap2_intent_mandate").$type<{
    maxPrice: number;
    preferredTiers: string[];
    quantity: number;
    validUntil: string; // ISO timestamp
    autoApprove: boolean;
    fallbackBehavior: "wait" | "next_best" | "cancel";
    signature?: string;
  }>(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// =============================================================================
// 9. AGENT_LOGS - Agent activity logs
// =============================================================================
export const agentLogs = pgTable("agent_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  agentId: uuid("agent_id")
    .references(() => agents.id, { onDelete: "cascade" })
    .notNull(),
  eventType: varchar("event_type", { length: 100 }).notNull(), // started, searching, found_ticket, price_check, purchase_attempt, success, error, etc.
  message: text("message").notNull(),
  payload: jsonb("payload").$type<Record<string, unknown>>(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// =============================================================================
// 10. WATCHLIST - User's watched concerts
// =============================================================================
export const watchlist = pgTable("watchlist", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .references(() => profiles.id, { onDelete: "cascade" })
    .notNull(),
  concertId: uuid("concert_id")
    .references(() => concerts.id, { onDelete: "cascade" })
    .notNull(),
  targetPriceUsdc: numeric("target_price_usdc", { precision: 10, scale: 2 }),
  notifyOnly: boolean("notify_only").default(false).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// =============================================================================
// 11. ORDERS - Purchase orders
// =============================================================================
export const orders = pgTable("orders", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .references(() => profiles.id, { onDelete: "cascade" })
    .notNull(),
  agentId: uuid("agent_id").references(() => agents.id, { onDelete: "set null" }),
  totalAmountUsdc: numeric("total_amount_usdc", { precision: 10, scale: 2 }).notNull(),
  status: varchar("status", { length: 50 }).default("pending").notNull(), // pending, processing, completed, failed, refunded
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// =============================================================================
// 12. TRANSACTIONS - Blockchain transactions
// =============================================================================
export const transactions = pgTable("transactions", {
  id: uuid("id").primaryKey().defaultRandom(),
  orderId: uuid("order_id")
    .references(() => orders.id, { onDelete: "cascade" })
    .notNull(),
  arcTxHash: text("arc_tx_hash").unique(),
  paymentMethod: varchar("payment_method", { length: 50 }).default("x402").notNull(), // x402, direct, etc.
  ap2PaymentMandate: jsonb("ap2_payment_mandate").$type<{
    amount: number;
    currency: string;
    recipient: string;
    memo?: string;
    signature: string;
    nonce: string;
  }>(),
  confirmedAt: timestamp("confirmed_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// =============================================================================
// 13. ISSUED_TICKETS - Tickets issued after purchase
// =============================================================================
export const issuedTickets = pgTable("issued_tickets", {
  id: uuid("id").primaryKey().defaultRandom(),
  orderId: uuid("order_id")
    .references(() => orders.id, { onDelete: "cascade" })
    .notNull(),
  ticketTierId: uuid("ticket_tier_id")
    .references(() => ticketTiers.id, { onDelete: "cascade" })
    .notNull(),
  secretCode: text("secret_code").notNull().unique(),
  qrData: text("qr_data").notNull(),
  isTransferred: boolean("is_transferred").default(false).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// =============================================================================
// 14. NOTIFICATIONS - User notifications
// =============================================================================
export const notifications = pgTable("notifications", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .references(() => profiles.id, { onDelete: "cascade" })
    .notNull(),
  type: varchar("type", { length: 100 }).notNull(), // agent_update, ticket_available, purchase_complete, price_alert, etc.
  status: varchar("status", { length: 50 }).default("unread").notNull(), // unread, read, dismissed
  content: jsonb("content").$type<{
    title: string;
    body: string;
    actionUrl?: string;
    metadata?: Record<string, unknown>;
  }>().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// =============================================================================
// RELATIONS
// =============================================================================

export const profilesRelations = relations(profiles, ({ many }) => ({
  credentials: many(userCredentials),
  nonces: many(authNonces),
  agents: many(agents),
  watchlist: many(watchlist),
  orders: many(orders),
  notifications: many(notifications),
}));

export const userCredentialsRelations = relations(userCredentials, ({ one }) => ({
  user: one(profiles, {
    fields: [userCredentials.userId],
    references: [profiles.id],
  }),
}));

export const authNoncesRelations = relations(authNonces, ({ one }) => ({
  user: one(profiles, {
    fields: [authNonces.userId],
    references: [profiles.id],
  }),
}));

export const artistsRelations = relations(artists, ({ many }) => ({
  concerts: many(concerts),
}));

export const venuesRelations = relations(venues, ({ many }) => ({
  concerts: many(concerts),
}));

export const concertsRelations = relations(concerts, ({ one, many }) => ({
  artist: one(artists, {
    fields: [concerts.artistId],
    references: [artists.id],
  }),
  venue: one(venues, {
    fields: [concerts.venueId],
    references: [venues.id],
  }),
  ticketTiers: many(ticketTiers),
  agents: many(agents),
  watchlist: many(watchlist),
}));

export const ticketTiersRelations = relations(ticketTiers, ({ one, many }) => ({
  concert: one(concerts, {
    fields: [ticketTiers.concertId],
    references: [concerts.id],
  }),
  issuedTickets: many(issuedTickets),
}));

export const agentsRelations = relations(agents, ({ one, many }) => ({
  user: one(profiles, {
    fields: [agents.userId],
    references: [profiles.id],
  }),
  concert: one(concerts, {
    fields: [agents.concertId],
    references: [concerts.id],
  }),
  logs: many(agentLogs),
  orders: many(orders),
}));

export const agentLogsRelations = relations(agentLogs, ({ one }) => ({
  agent: one(agents, {
    fields: [agentLogs.agentId],
    references: [agents.id],
  }),
}));

export const watchlistRelations = relations(watchlist, ({ one }) => ({
  user: one(profiles, {
    fields: [watchlist.userId],
    references: [profiles.id],
  }),
  concert: one(concerts, {
    fields: [watchlist.concertId],
    references: [concerts.id],
  }),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(profiles, {
    fields: [orders.userId],
    references: [profiles.id],
  }),
  agent: one(agents, {
    fields: [orders.agentId],
    references: [agents.id],
  }),
  transactions: many(transactions),
  issuedTickets: many(issuedTickets),
}));

export const transactionsRelations = relations(transactions, ({ one }) => ({
  order: one(orders, {
    fields: [transactions.orderId],
    references: [orders.id],
  }),
}));

export const issuedTicketsRelations = relations(issuedTickets, ({ one }) => ({
  order: one(orders, {
    fields: [issuedTickets.orderId],
    references: [orders.id],
  }),
  ticketTier: one(ticketTiers, {
    fields: [issuedTickets.ticketTierId],
    references: [ticketTiers.id],
  }),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(profiles, {
    fields: [notifications.userId],
    references: [profiles.id],
  }),
}));

// =============================================================================
// TYPE EXPORTS
// =============================================================================
export type Profile = typeof profiles.$inferSelect;
export type NewProfile = typeof profiles.$inferInsert;

export type UserCredential = typeof userCredentials.$inferSelect;
export type NewUserCredential = typeof userCredentials.$inferInsert;

export type AuthNonce = typeof authNonces.$inferSelect;
export type NewAuthNonce = typeof authNonces.$inferInsert;

export type Artist = typeof artists.$inferSelect;
export type NewArtist = typeof artists.$inferInsert;

export type Venue = typeof venues.$inferSelect;
export type NewVenue = typeof venues.$inferInsert;

export type Concert = typeof concerts.$inferSelect;
export type NewConcert = typeof concerts.$inferInsert;

export type TicketTier = typeof ticketTiers.$inferSelect;
export type NewTicketTier = typeof ticketTiers.$inferInsert;

export type Agent = typeof agents.$inferSelect;
export type NewAgent = typeof agents.$inferInsert;

export type AgentLog = typeof agentLogs.$inferSelect;
export type NewAgentLog = typeof agentLogs.$inferInsert;

export type WatchlistItem = typeof watchlist.$inferSelect;
export type NewWatchlistItem = typeof watchlist.$inferInsert;

export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;

export type Transaction = typeof transactions.$inferSelect;
export type NewTransaction = typeof transactions.$inferInsert;

export type IssuedTicket = typeof issuedTickets.$inferSelect;
export type NewIssuedTicket = typeof issuedTickets.$inferInsert;

export type Notification = typeof notifications.$inferSelect;
export type NewNotification = typeof notifications.$inferInsert;
