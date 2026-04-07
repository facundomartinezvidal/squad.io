import { v } from "convex/values";
import type { Id } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";

export const send = mutation({
  args: {
    receiverId: v.id("players"),
    body: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const sender = await ctx.db
      .query("players")
      .withIndex("by_tokenIdentifier", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier),
      )
      .unique();

    if (!sender) {
      throw new Error("No player profile found");
    }

    if (args.body.trim() === "") {
      throw new Error("Message cannot be empty");
    }

    await ctx.db.insert("messages", {
      senderId: sender._id,
      receiverId: args.receiverId,
      body: args.body.trim(),
    });
  },
});

export const getConversation = query({
  args: {
    otherPlayerId: v.id("players"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    const me = await ctx.db
      .query("players")
      .withIndex("by_tokenIdentifier", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier),
      )
      .unique();

    if (!me) {
      return [];
    }

    // Get messages in both directions
    const sent = await ctx.db
      .query("messages")
      .withIndex("by_senderId_and_receiverId", (q) =>
        q.eq("senderId", me._id).eq("receiverId", args.otherPlayerId),
      )
      .collect();

    const received = await ctx.db
      .query("messages")
      .withIndex("by_senderId_and_receiverId", (q) =>
        q.eq("senderId", args.otherPlayerId).eq("receiverId", me._id),
      )
      .collect();

    // Merge and sort by creation time
    const all = [...sent, ...received].sort(
      (a, b) => a._creationTime - b._creationTime,
    );

    return all;
  },
});

export const getChatList = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    const me = await ctx.db
      .query("players")
      .withIndex("by_tokenIdentifier", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier),
      )
      .unique();

    if (!me) {
      return [];
    }

    // Get all friends
    const friendships = await ctx.db
      .query("friends")
      .withIndex("by_playerId", (q) => q.eq("playerId", me._id))
      .take(50);

    const acceptedFriends = friendships.filter((f) => f.status === "accepted");

    // Get all matches (mutual likes)
    const myLikes = await ctx.db
      .query("swipes")
      .withIndex("by_swiperId", (q) => q.eq("swiperId", me._id))
      .collect();

    const likedIds = myLikes
      .filter((s) => s.direction === "like")
      .map((s) => s.targetId);

    const matchedIds: Id<"players">[] = [];
    for (const targetId of likedIds) {
      const reciprocal = await ctx.db
        .query("swipes")
        .withIndex("by_swiperId_and_targetId", (q) =>
          q.eq("swiperId", targetId).eq("targetId", me._id),
        )
        .unique();
      if (reciprocal !== null && reciprocal.direction === "like") {
        matchedIds.push(targetId);
      }
    }

    // Merge friend IDs and match IDs (unique set)
    const idStrings = new Set<string>();
    const chatPlayerIds: Id<"players">[] = [];
    for (const id of [
      ...acceptedFriends.map((f) => f.friendId),
      ...matchedIds,
    ]) {
      if (!idStrings.has(id)) {
        idStrings.add(id);
        chatPlayerIds.push(id);
      }
    }

    // Fetch player docs and last message for each
    const chatList: {
      player: { _id: Id<"players">; username: string; isOnline: boolean; rank: string; division?: string };
      lastMessage: { body: string; time: number; isMe: boolean } | null;
    }[] = [];

    for (const playerId of chatPlayerIds) {
      const player = await ctx.db.get(playerId);
      if (!player) continue;

      // Get last message between us
      const sentLast = await ctx.db
        .query("messages")
        .withIndex("by_senderId_and_receiverId", (q) =>
          q.eq("senderId", me._id).eq("receiverId", playerId),
        )
        .order("desc")
        .take(1);

      const receivedLast = await ctx.db
        .query("messages")
        .withIndex("by_senderId_and_receiverId", (q) =>
          q.eq("senderId", playerId).eq("receiverId", me._id),
        )
        .order("desc")
        .take(1);

      const lastMessages = [...sentLast, ...receivedLast].sort(
        (a, b) => b._creationTime - a._creationTime,
      );
      const lastMsg = lastMessages[0] ?? null;

      chatList.push({
        player: {
          _id: player._id,
          username: player.username,
          isOnline: player.isOnline,
          rank: player.rank,
          division: player.division,
        },
        lastMessage: lastMsg
          ? {
              body: lastMsg.body,
              time: lastMsg._creationTime,
              isMe: lastMsg.senderId === me._id,
            }
          : null,
      });
    }

    // Sort: those with recent messages first, then alphabetically
    chatList.sort((a, b) => {
      if (a.lastMessage && b.lastMessage) {
        return b.lastMessage.time - a.lastMessage.time;
      }
      if (a.lastMessage) return -1;
      if (b.lastMessage) return 1;
      return a.player.username.localeCompare(b.player.username);
    });

    return chatList;
  },
});
