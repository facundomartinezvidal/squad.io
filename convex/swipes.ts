import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const recordSwipe = mutation({
  args: {
    targetId: v.id("players"),
    direction: v.union(v.literal("like"), v.literal("reject")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const currentPlayer = await ctx.db
      .query("players")
      .withIndex("by_tokenIdentifier", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier),
      )
      .unique();

    if (!currentPlayer) {
      throw new Error("No player profile found");
    }

    const existing = await ctx.db
      .query("swipes")
      .withIndex("by_swiperId_and_targetId", (q) =>
        q.eq("swiperId", currentPlayer._id).eq("targetId", args.targetId),
      )
      .unique();

    if (existing) {
      return { matched: false };
    }

    await ctx.db.insert("swipes", {
      swiperId: currentPlayer._id,
      targetId: args.targetId,
      direction: args.direction,
    });

    if (args.direction === "like") {
      const reciprocal = await ctx.db
        .query("swipes")
        .withIndex("by_swiperId_and_targetId", (q) =>
          q.eq("swiperId", args.targetId).eq("targetId", currentPlayer._id),
        )
        .unique();

      if (reciprocal !== null && reciprocal.direction === "like") {
        return { matched: true };
      }
    }

    return { matched: false };
  },
});

export const getMatches = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    const currentPlayer = await ctx.db
      .query("players")
      .withIndex("by_tokenIdentifier", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier),
      )
      .unique();

    if (!currentPlayer) {
      return [];
    }

    const myLikes = await ctx.db
      .query("swipes")
      .withIndex("by_swiperId", (q) => q.eq("swiperId", currentPlayer._id))
      .collect();

    const likedByMe = myLikes.filter((s) => s.direction === "like");

    const matchedPlayers = [];

    for (const like of likedByMe.slice(0, 50)) {
      const reciprocal = await ctx.db
        .query("swipes")
        .withIndex("by_swiperId_and_targetId", (q) =>
          q
            .eq("swiperId", like.targetId)
            .eq("targetId", currentPlayer._id),
        )
        .unique();

      if (reciprocal !== null && reciprocal.direction === "like") {
        const targetPlayer = await ctx.db.get(like.targetId);
        if (targetPlayer !== null) {
          matchedPlayers.push(targetPlayer);
        }
      }
    }

    return matchedPlayers;
  },
});
