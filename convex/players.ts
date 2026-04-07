import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getCurrentPlayer = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }
    const player = await ctx.db
      .query("players")
      .withIndex("by_tokenIdentifier", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier),
      )
      .unique();
    return player;
  },
});

export const getNextPlayer = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    const currentPlayer = await ctx.db
      .query("players")
      .withIndex("by_tokenIdentifier", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier),
      )
      .unique();

    if (!currentPlayer) {
      return null;
    }

    const swipes = await ctx.db
      .query("swipes")
      .withIndex("by_swiperId", (q) => q.eq("swiperId", currentPlayer._id))
      .collect();

    const swipedIds = new Set(swipes.map((s) => s.targetId));

    const candidatesQuery = ctx.db
      .query("players")
      .withIndex("by_isOnline_and_isLookingForMatch", (q) =>
        q.eq("isOnline", true).eq("isLookingForMatch", true),
      );

    for await (const player of candidatesQuery) {
      if (
        player._id !== currentPlayer._id &&
        !swipedIds.has(player._id)
      ) {
        return player;
      }
    }

    return null;
  },
});

export const createMyProfile = mutation({
  args: {
    username: v.string(),
    role: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const existing = await ctx.db
      .query("players")
      .withIndex("by_tokenIdentifier", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier),
      )
      .unique();

    if (existing) {
      return existing._id;
    }

    const playerId = await ctx.db.insert("players", {
      username: args.username,
      role: args.role,
      tokenIdentifier: identity.tokenIdentifier,
      rank: "Silver",
      division: "II",
      level: 30,
      winRate: 50,
      language: "es",
      server: "LAS",
      reputation: 3.0,
      isOnline: true,
      isLookingForMatch: true,
    });

    return playerId;
  },
});
