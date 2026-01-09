"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { agents, agentLogs, concerts, ticketTiers } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { createClient } from "@/lib/supabase/server";

interface MandateConfig {
  concertId: string;
  maxBudget: number;
  quantity: number;
  preferredTiers: string[];
  validUntil: string;
  autoApprove: boolean;
  fallbackBehavior: "wait" | "next_best" | "cancel";
}

export async function createAgent(config: MandateConfig) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  try {
    // Create the AP2 Intent Mandate structure
    const ap2IntentMandate = {
      maxPrice: config.maxBudget,
      preferredTiers: config.preferredTiers,
      quantity: config.quantity,
      validUntil: config.validUntil,
      autoApprove: config.autoApprove,
      fallbackBehavior: config.fallbackBehavior,
      // In production, this would be cryptographically signed
      signature: `sig_${Date.now()}_${user.id}`,
    };

    const [newAgent] = await db
      .insert(agents)
      .values({
        userId: user.id,
        concertId: config.concertId,
        maxBudgetUsdc: config.maxBudget.toString(),
        status: "idle",
        ap2IntentMandate,
      })
      .returning();

    // Log the agent creation
    await db.insert(agentLogs).values({
      agentId: newAgent.id,
      eventType: "created",
      message: "Agent created with mandate",
      payload: { mandate: ap2IntentMandate },
    });

    revalidatePath("/dashboard/agents");
    return { success: true, agentId: newAgent.id };
  } catch (error) {
    console.error("Error creating agent:", error);
    return { error: "Failed to create agent" };
  }
}

export async function activateAgent(agentId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  try {
    await db
      .update(agents)
      .set({ status: "active", updatedAt: new Date() })
      .where(eq(agents.id, agentId));

    await db.insert(agentLogs).values({
      agentId,
      eventType: "started",
      message: "Agent activated and searching for tickets",
    });

    revalidatePath("/dashboard/agents");
    return { success: true };
  } catch (error) {
    console.error("Error activating agent:", error);
    return { error: "Failed to activate agent" };
  }
}

export async function pauseAgent(agentId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  try {
    await db
      .update(agents)
      .set({ status: "idle", updatedAt: new Date() })
      .where(eq(agents.id, agentId));

    await db.insert(agentLogs).values({
      agentId,
      eventType: "paused",
      message: "Agent paused by user",
    });

    revalidatePath("/dashboard/agents");
    return { success: true };
  } catch (error) {
    console.error("Error pausing agent:", error);
    return { error: "Failed to pause agent" };
  }
}

export async function cancelAgent(agentId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  try {
    await db
      .update(agents)
      .set({ status: "cancelled", updatedAt: new Date() })
      .where(eq(agents.id, agentId));

    await db.insert(agentLogs).values({
      agentId,
      eventType: "cancelled",
      message: "Agent cancelled by user",
    });

    revalidatePath("/dashboard/agents");
    return { success: true };
  } catch (error) {
    console.error("Error cancelling agent:", error);
    return { error: "Failed to cancel agent" };
  }
}

export async function getAgentLogs(agentId: string) {
  try {
    const logs = await db
      .select()
      .from(agentLogs)
      .where(eq(agentLogs.agentId, agentId))
      .orderBy(agentLogs.createdAt);

    return { logs };
  } catch (error) {
    console.error("Error fetching logs:", error);
    return { error: "Failed to fetch logs", logs: [] };
  }
}

export async function getUserAgents() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized", agents: [] };
  }

  try {
    const userAgents = await db
      .select()
      .from(agents)
      .where(eq(agents.userId, user.id))
      .orderBy(agents.createdAt);

    return { agents: userAgents };
  } catch (error) {
    console.error("Error fetching agents:", error);
    return { error: "Failed to fetch agents", agents: [] };
  }
}
