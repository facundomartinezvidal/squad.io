import { v } from "convex/values";
import { internalAction, internalMutation } from "./_generated/server";

export const createUser = internalAction({
  args: {
    email: v.string(),
    password: v.string(),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const convexSiteUrl = process.env.CONVEX_SITE_URL;
    if (!convexSiteUrl) {
      throw new Error(
        "CONVEX_SITE_URL env var not set. Run: npx convex env set CONVEX_SITE_URL <your-convex-site-url>",
      );
    }

    const response = await fetch(`${convexSiteUrl}/api/auth/sign-up/email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: args.email,
        password: args.password,
        name: args.name,
      }),
    });

    const body = await response.text();
    console.log(`Seed user response: ${response.status} ${body}`);

    if (!response.ok) {
      throw new Error(`Failed to create test user: ${response.status} ${body}`);
    }

    return { status: response.status, body };
  },
});

export const seedPlayers = internalMutation({
  args: {},
  handler: async (ctx) => {
    const players = [
      {
        username: "DarkPhoenix",
        rank: "Gold",
        division: "III",
        role: "Top",
        level: 120,
        winRate: 52,
        language: "es",
        server: "LAS",
        reputation: 4.2,
        isOnline: true,
        isLookingForMatch: true,
        tokenIdentifier: "seed|player-1",
      },
      {
        username: "NightWolf99",
        rank: "Platinum",
        division: "II",
        role: "Jungle",
        level: 230,
        winRate: 58,
        language: "es",
        server: "LAS",
        reputation: 4.5,
        isOnline: true,
        isLookingForMatch: true,
        tokenIdentifier: "seed|player-2",
      },
      {
        username: "CrystalMage",
        rank: "Silver",
        division: "I",
        role: "Mid",
        level: 85,
        winRate: 48,
        language: "es",
        server: "LAS",
        reputation: 3.8,
        isOnline: true,
        isLookingForMatch: true,
        tokenIdentifier: "seed|player-3",
      },
      {
        username: "IronClad_X",
        rank: "Diamond",
        division: "IV",
        role: "Support",
        level: 310,
        winRate: 61,
        language: "en",
        server: "NA",
        reputation: 4.7,
        isOnline: true,
        isLookingForMatch: true,
        tokenIdentifier: "seed|player-4",
      },
      {
        username: "ThunderADC",
        rank: "Gold",
        division: "I",
        role: "ADC",
        level: 150,
        winRate: 55,
        language: "pt",
        server: "LAS",
        reputation: 4.0,
        isOnline: true,
        isLookingForMatch: true,
        tokenIdentifier: "seed|player-5",
      },
      {
        username: "ShadowStep",
        rank: "Emerald",
        division: "III",
        role: "Jungle",
        level: 200,
        winRate: 57,
        language: "es",
        server: "LAN",
        reputation: 4.3,
        isOnline: true,
        isLookingForMatch: true,
        tokenIdentifier: "seed|player-6",
      },
      {
        username: "FrostBite22",
        rank: "Platinum",
        division: "IV",
        role: "Mid",
        level: 175,
        winRate: 53,
        language: "en",
        server: "EUW",
        reputation: 3.5,
        isOnline: true,
        isLookingForMatch: true,
        tokenIdentifier: "seed|player-7",
      },
      {
        username: "VoidWalker",
        rank: "Silver",
        division: "III",
        role: "Top",
        level: 65,
        winRate: 45,
        language: "es",
        server: "LAS",
        reputation: 3.2,
        isOnline: true,
        isLookingForMatch: true,
        tokenIdentifier: "seed|player-8",
      },
      {
        username: "StarGuard",
        rank: "Gold",
        division: "II",
        role: "Support",
        level: 140,
        winRate: 56,
        language: "es",
        server: "LAS",
        reputation: 4.8,
        isOnline: true,
        isLookingForMatch: true,
        tokenIdentifier: "seed|player-9",
      },
      {
        username: "BladeRunner",
        rank: "Diamond",
        division: "III",
        role: "ADC",
        level: 280,
        winRate: 63,
        language: "en",
        server: "NA",
        reputation: 4.6,
        isOnline: true,
        isLookingForMatch: true,
        tokenIdentifier: "seed|player-10",
      },
    ];

    for (const player of players) {
      await ctx.db.insert("players", player);
    }
  },
});
