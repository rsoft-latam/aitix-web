# AItix - Agentic Commerce Platform

<div align="center">
  <h3>Autonomous Ticket Purchasing on the ARC Network</h3>
  <p>Powered by AI agents using the AP2 protocol</p>
</div>

---

## Overview

AItix is a next-generation ticket purchasing platform that leverages autonomous AI agents to secure tickets on your behalf. Set your preferences, define your budget with cryptographic guardrails, and let intelligent agents monitor and purchase tickets automatically.

### Key Features

- **Autonomous Agents**: Deploy AI-powered agents that monitor ticket availability 24/7
- **Secure Mandates**: Define budget limits and preferences with AP2 Intent Mandates
- **Real-time Updates**: Live activity feed with Supabase Realtime
- **ARC Network Integration**: Built on the ARC blockchain for secure transactions
- **x402 Payment Protocol**: Seamless USDC payments

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 15+ (App Router) |
| Language | TypeScript |
| Database | PostgreSQL (Supabase) |
| ORM | Drizzle ORM |
| Auth | Supabase Auth (Email/Google) |
| Styling | Tailwind CSS + Shadcn/ui |
| Animations | Framer Motion |
| Real-time | Supabase Realtime |

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/rsoft-latam/aitix.git
   cd aitix
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.local.example .env.local
   ```

   Edit `.env.local` with your credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   DATABASE_URL=postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres
   AGENT_WEBHOOK_SECRET=your-webhook-secret
   ```

4. **Push database schema**
   ```bash
   npm run db:push
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/
│   ├── (auth)/
│   │   └── login/              # Authentication pages
│   ├── (dashboard)/
│   │   └── dashboard/
│   │       ├── agents/         # Agent management
│   │       ├── concerts/       # Concert catalog
│   │       ├── orders/         # Order history
│   │       └── watchlist/      # Price tracking
│   └── api/
│       └── agent/
│           └── callback/       # External agent webhook
├── components/
│   ├── auth/                   # Login components
│   ├── dashboard/              # Dashboard UI
│   ├── agents/                 # Agent configurator
│   └── ui/                     # Shadcn components
├── lib/
│   ├── db/
│   │   ├── schema.ts          # Drizzle schema (14 tables)
│   │   └── index.ts           # DB client
│   ├── supabase/              # Auth clients
│   └── actions/               # Server Actions
├── hooks/                      # React hooks
└── types/                      # TypeScript types
```

## Database Schema

The platform uses 14 interconnected tables:

| Table | Description |
|-------|-------------|
| `profiles` | Extended user profiles |
| `user_credentials` | DID credentials for signing |
| `auth_nonces` | Authentication nonces |
| `artists` | Artist catalog |
| `venues` | Event venues |
| `concerts` | Concert events |
| `ticket_tiers` | Ticket pricing tiers |
| `agents` | Autonomous purchasing agents |
| `agent_logs` | Agent activity logs |
| `watchlist` | User's watched concerts |
| `orders` | Purchase orders |
| `transactions` | Blockchain transactions |
| `issued_tickets` | Purchased tickets |
| `notifications` | User notifications |

## API Reference

### Agent Callback Endpoint

```
POST /api/agent/callback
```

Receives updates from external agents (Project C).

**Headers:**
- `x-webhook-signature`: HMAC-SHA256 signature

**Body:**
```json
{
  "agentId": "uuid",
  "eventType": "searching | found_ticket | purchase_success | ...",
  "message": "Human readable message",
  "data": { ... },
  "timestamp": "ISO-8601"
}
```

**Event Types:**
- `searching` - Agent is scanning for tickets
- `found_ticket` - Ticket matching criteria found
- `price_check` - Price validation
- `purchase_attempt` - Attempting purchase
- `purchase_success` - Purchase completed
- `purchase_failed` - Purchase failed
- `mandate_expired` - Mandate time window expired
- `error` - Error occurred

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run db:generate` | Generate Drizzle migrations |
| `npm run db:migrate` | Run migrations |
| `npm run db:push` | Push schema to database |
| `npm run db:studio` | Open Drizzle Studio |

## Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)

2. Enable Email and Google authentication in Authentication > Providers

3. Configure Google OAuth:
   - Create OAuth credentials in Google Cloud Console
   - Add redirect URL: `https://[project-ref].supabase.co/auth/v1/callback`

4. Enable Realtime for the `agent_logs` table:
   - Go to Database > Replication
   - Enable realtime for `agent_logs`

## Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Dashboard     │────▶│   Supabase      │◀────│  Agent Service  │
│   (Project A)   │     │   (Database)    │     │   (Project C)   │
└─────────────────┘     └─────────────────┘     └─────────────────┘
        │                        │                       │
        │                        │                       │
        ▼                        ▼                       ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   User Auth     │     │   Real-time     │     │   ARC Network   │
│   (Supabase)    │     │   Subscriptions │     │   (Blockchain)  │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is proprietary software owned by RSoft Latam.

---

<div align="center">
  <p>Built with ❤️ by <strong>RSoft Latam</strong></p>
  <p>© 2024 RSoft Latam. All rights reserved.</p>
</div>
