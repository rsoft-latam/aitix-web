// Re-export schema types
export type {
  Profile,
  NewProfile,
  UserCredential,
  NewUserCredential,
  AuthNonce,
  NewAuthNonce,
  Artist,
  NewArtist,
  Venue,
  NewVenue,
  Concert,
  NewConcert,
  TicketTier,
  NewTicketTier,
  Agent,
  NewAgent,
  AgentLog,
  NewAgentLog,
  WatchlistItem,
  NewWatchlistItem,
  Order,
  NewOrder,
  Transaction,
  NewTransaction,
  IssuedTicket,
  NewIssuedTicket,
  Notification,
  NewNotification,
} from "@/lib/db/schema";

// UI Types
export interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

export interface WalletInfo {
  address: string;
  balance: number;
  currency: string;
}

export interface AgentStatus {
  id: string;
  status: "idle" | "active" | "searching" | "purchasing" | "completed" | "failed" | "cancelled";
  lastUpdate: Date;
}

// API Types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface AgentCallbackPayload {
  agentId: string;
  eventType: string;
  message: string;
  data?: Record<string, unknown>;
  timestamp: string;
}

// Mandate Types
export interface AP2IntentMandate {
  maxPrice: number;
  preferredTiers: string[];
  quantity: number;
  validUntil: string;
  autoApprove: boolean;
  fallbackBehavior: "wait" | "next_best" | "cancel";
  signature?: string;
}

export interface AP2PaymentMandate {
  amount: number;
  currency: string;
  recipient: string;
  memo?: string;
  signature: string;
  nonce: string;
}
