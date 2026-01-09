import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { agents, agentLogs, orders, transactions, notifications } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import crypto from "crypto";

// Webhook payload types
interface AgentCallbackPayload {
  agentId: string;
  eventType:
    | "searching"
    | "found_ticket"
    | "price_check"
    | "purchase_attempt"
    | "purchase_success"
    | "purchase_failed"
    | "mandate_expired"
    | "error";
  message: string;
  data?: {
    ticketTierId?: string;
    price?: number;
    quantity?: number;
    txHash?: string;
    orderId?: string;
    error?: string;
    [key: string]: unknown;
  };
  timestamp: string;
}

// Verify webhook signature
function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("hex");

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}

export async function POST(request: NextRequest) {
  try {
    // Get webhook secret
    const webhookSecret = process.env.AGENT_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.error("AGENT_WEBHOOK_SECRET not configured");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    // Verify signature
    const signature = request.headers.get("x-webhook-signature");
    if (!signature) {
      return NextResponse.json(
        { error: "Missing webhook signature" },
        { status: 401 }
      );
    }

    const rawBody = await request.text();

    if (!verifyWebhookSignature(rawBody, signature, webhookSecret)) {
      return NextResponse.json(
        { error: "Invalid webhook signature" },
        { status: 401 }
      );
    }

    // Parse payload
    const payload: AgentCallbackPayload = JSON.parse(rawBody);

    // Validate required fields
    if (!payload.agentId || !payload.eventType || !payload.message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Verify agent exists
    const [agent] = await db
      .select()
      .from(agents)
      .where(eq(agents.id, payload.agentId))
      .limit(1);

    if (!agent) {
      return NextResponse.json(
        { error: "Agent not found" },
        { status: 404 }
      );
    }

    // Insert log entry
    await db.insert(agentLogs).values({
      agentId: payload.agentId,
      eventType: payload.eventType,
      message: payload.message,
      payload: payload.data || {},
    });

    // Handle specific event types
    switch (payload.eventType) {
      case "purchase_success":
        // Update agent status
        await db
          .update(agents)
          .set({ status: "completed", updatedAt: new Date() })
          .where(eq(agents.id, payload.agentId));

        // Create notification
        await db.insert(notifications).values({
          userId: agent.userId,
          type: "purchase_complete",
          content: {
            title: "Ticket Purchased!",
            body: payload.message,
            actionUrl: `/dashboard/orders/${payload.data?.orderId}`,
            metadata: payload.data,
          },
        });
        break;

      case "purchase_failed":
        // Update agent status
        await db
          .update(agents)
          .set({ status: "failed", updatedAt: new Date() })
          .where(eq(agents.id, payload.agentId));

        // Create notification
        await db.insert(notifications).values({
          userId: agent.userId,
          type: "purchase_failed",
          content: {
            title: "Purchase Failed",
            body: payload.message,
            metadata: payload.data,
          },
        });
        break;

      case "mandate_expired":
        // Update agent status
        await db
          .update(agents)
          .set({ status: "cancelled", updatedAt: new Date() })
          .where(eq(agents.id, payload.agentId));

        // Create notification
        await db.insert(notifications).values({
          userId: agent.userId,
          type: "agent_update",
          content: {
            title: "Mandate Expired",
            body: "Your agent mandate has expired without finding suitable tickets.",
            actionUrl: "/dashboard/agents",
          },
        });
        break;

      case "found_ticket":
        // Notify user about available ticket
        await db.insert(notifications).values({
          userId: agent.userId,
          type: "ticket_available",
          content: {
            title: "Ticket Found!",
            body: payload.message,
            metadata: payload.data,
          },
        });
        break;

      case "searching":
      case "price_check":
        // Just update agent status to show it's active
        await db
          .update(agents)
          .set({ status: "searching", updatedAt: new Date() })
          .where(eq(agents.id, payload.agentId));
        break;

      case "error":
        // Log error but don't necessarily fail the agent
        await db.insert(notifications).values({
          userId: agent.userId,
          type: "agent_update",
          content: {
            title: "Agent Error",
            body: payload.message,
            metadata: payload.data,
          },
        });
        break;
    }

    return NextResponse.json({
      success: true,
      message: "Callback processed successfully",
    });
  } catch (error) {
    console.error("Error processing agent callback:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "AItix Agent Callback API",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  });
}
