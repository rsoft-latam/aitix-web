"use server";

import { db } from "@/lib/db";
import { concerts, artists, venues, ticketTiers } from "@/lib/db/schema";
import { eq, sql } from "drizzle-orm";

export interface ConcertWithDetails {
  id: string;
  artist: string;
  genre: string;
  image: string;
  venue: string;
  city: string;
  date: string;
  time: string;
  price: number;
  currency: string;
  tier: string;
  available: boolean;
}

export async function getConcerts(): Promise<ConcertWithDetails[]> {
  try {
    // Step 1: Get all concerts with their artist and venue info
    const allConcerts = await db
      .select({
        concertId: concerts.id,
        artistName: artists.name,
        genre: artists.genre,
        imageUrl: artists.imageUrl,
        venueName: venues.name,
        city: venues.city,
        date: concerts.date,
        status: concerts.status,
      })
      .from(concerts)
      .innerJoin(artists, eq(concerts.artistId, artists.id))
      .innerJoin(venues, eq(concerts.venueId, venues.id))
      .orderBy(concerts.date);

    // Step 2: Get the cheapest ticket tier for each concert
    const minPricesSubquery = db
      .select({
        concertId: ticketTiers.concertId,
        minPrice: sql<number>`MIN(${ticketTiers.priceUsdc})`.as("min_price"),
      })
      .from(ticketTiers)
      .groupBy(ticketTiers.concertId)
      .as("min_prices");

    const cheapestTiers = await db
      .select({
        concertId: ticketTiers.concertId,
        price: ticketTiers.priceUsdc,
        tierName: ticketTiers.name,
        remainingInventory: ticketTiers.remainingInventory,
      })
      .from(ticketTiers)
      .innerJoin(minPricesSubquery, eq(ticketTiers.concertId, minPricesSubquery.concertId))
      .where(eq(ticketTiers.priceUsdc, minPricesSubquery.minPrice));

    // Step 3: Combine the data
    const concertMap = new Map<string, ConcertWithDetails>();

    for (const concert of allConcerts) {
      const cheapestTier = cheapestTiers.find(t => t.concertId === concert.concertId);

      concertMap.set(concert.concertId, {
        id: concert.concertId,
        artist: concert.artistName,
        genre: concert.genre || "Unknown",
        image: concert.imageUrl || "/placeholder.png",
        venue: concert.venueName,
        city: concert.city,
        date: concert.date.toISOString().split("T")[0],
        time: concert.date.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        price: cheapestTier ? parseFloat(cheapestTier.price.toString()) : 0,
        currency: "USDC",
        tier: cheapestTier?.tierName || "General Admission",
        available: cheapestTier ? cheapestTier.remainingInventory > 0 : false,
      });
    }

    return Array.from(concertMap.values());
  } catch (error) {
    console.error("Error fetching concerts:", error);
    return [];
  }
}
