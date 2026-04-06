import { query } from "./_generated/server";

export const getMyFriends = query({
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

    const friendships = await ctx.db
      .query("friends")
      .withIndex("by_playerId", (q) => q.eq("playerId", currentPlayer._id))
      .take(50);

    const acceptedFriendships = friendships.filter(
      (f) => f.status === "accepted",
    );

    const friends = [];
    for (const friendship of acceptedFriendships) {
      const friend = await ctx.db.get(friendship.friendId);
      if (friend) {
        friends.push(friend);
      }
    }

    return friends;
  },
});
