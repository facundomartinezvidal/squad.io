import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  players: defineTable({
    username: v.string(),
    avatarUrl: v.optional(v.string()),
    rank: v.string(),
    division: v.optional(v.string()),
    role: v.string(),
    level: v.number(),
    winRate: v.number(),
    language: v.string(),
    server: v.string(),
    reputation: v.number(),
    isOnline: v.boolean(),
    isLookingForMatch: v.boolean(),
    tokenIdentifier: v.string(),
  })
    .index("by_tokenIdentifier", ["tokenIdentifier"])
    .index("by_isOnline_and_isLookingForMatch", [
      "isOnline",
      "isLookingForMatch",
    ]),

  swipes: defineTable({
    swiperId: v.id("players"),
    targetId: v.id("players"),
    direction: v.union(v.literal("like"), v.literal("reject")),
  })
    .index("by_swiperId", ["swiperId"])
    .index("by_swiperId_and_targetId", ["swiperId", "targetId"])
    .index("by_targetId_and_direction", ["targetId", "direction"]),
});
