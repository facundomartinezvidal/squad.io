"use client";

import type { Doc } from "../../convex/_generated/dataModel";
import { Star } from "lucide-react";
import { cn } from "~/lib/utils";

function getRankColor(rank: string): { text: string; bg: string } {
  switch (rank.toLowerCase()) {
    case "iron":
      return { text: "text-gray-400", bg: "bg-gray-400/10" };
    case "bronze":
      return { text: "text-amber-700", bg: "bg-amber-700/10" };
    case "silver":
      return { text: "text-slate-300", bg: "bg-slate-300/10" };
    case "gold":
      return { text: "text-amber-400", bg: "bg-amber-400/10" };
    case "platinum":
      return { text: "text-teal-400", bg: "bg-teal-400/10" };
    case "emerald":
      return { text: "text-emerald-400", bg: "bg-emerald-400/10" };
    case "diamond":
      return { text: "text-blue-400", bg: "bg-blue-400/10" };
    case "master":
      return { text: "text-purple-400", bg: "bg-purple-400/10" };
    case "grandmaster":
      return { text: "text-red-400", bg: "bg-red-400/10" };
    case "challenger":
      return { text: "text-yellow-400", bg: "bg-yellow-400/10" };
    default:
      return { text: "text-slate-400", bg: "bg-slate-400/10" };
  }
}

interface ProfileSidebarProps {
  player: Doc<"players">;
  friends: Doc<"players">[];
}

export function ProfileSidebar({ player, friends }: ProfileSidebarProps) {
  const rankColors = getRankColor(player.rank);
  const rankLabel = player.division
    ? `${player.rank} ${player.division}`
    : player.rank;
  const avatarLetter = player.username.charAt(0).toUpperCase();

  return (
    <aside className="flex w-64 shrink-0 flex-col gap-4 overflow-y-auto border-r border-slate-700/50 bg-slate-900/80 p-4">
      {/* Profile card */}
      <div className="flex flex-col items-center gap-3 rounded-xl border border-slate-700/50 bg-slate-800/60 p-4">
        {/* Avatar */}
        <div className="relative">
          <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-slate-500 bg-slate-700">
            {player.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={player.avatarUrl}
                alt={player.username}
                className="h-full w-full rounded-full object-cover"
              />
            ) : (
              <span className="text-2xl font-bold text-white">
                {avatarLetter}
              </span>
            )}
          </div>
          {player.isOnline && (
            <span className="absolute right-0.5 bottom-0.5 h-3.5 w-3.5 rounded-full bg-emerald-500 ring-2 ring-slate-800" />
          )}
        </div>

        {/* Username */}
        <h2 className="text-lg font-bold text-white">{player.username}</h2>

        {/* Rank badge */}
        <div
          className={cn(
            "rounded-full px-3 py-1 text-sm font-semibold",
            rankColors.text,
            rankColors.bg,
          )}
        >
          {rankLabel}
        </div>

        {/* Stats */}
        <div className="flex w-full flex-col gap-1.5 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Win Rate</span>
            <span className="font-medium text-slate-200">{player.winRate}%</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Reputation</span>
            <div className="flex items-center gap-1">
              <span className="font-medium text-slate-200">
                {player.reputation.toFixed(1)}
              </span>
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Friends connected */}
      <div className="flex flex-col gap-2 rounded-xl border border-slate-700/50 bg-slate-800/60 p-4">
        <h3 className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
          Amigos conectados
        </h3>

        {friends.length === 0 && (
          <p className="text-sm text-slate-500">Sin amigos conectados</p>
        )}

        <div className="flex flex-col gap-2">
          {friends.map((friend) => (
            <FriendRow key={friend._id} friend={friend} />
          ))}
        </div>
      </div>
    </aside>
  );
}

function FriendRow({ friend }: { friend: Doc<"players"> }) {
  const avatarLetter = friend.username.charAt(0).toUpperCase();
  const statusLabel = friend.isLookingForMatch
    ? "Buscando partida"
    : friend.isOnline
      ? "En línea"
      : "Desconectado";
  const statusColor = friend.isLookingForMatch
    ? "text-emerald-400"
    : friend.isOnline
      ? "text-blue-400"
      : "text-slate-500";
  const dotColor = friend.isLookingForMatch
    ? "bg-emerald-500"
    : friend.isOnline
      ? "bg-blue-500"
      : "bg-slate-600";

  return (
    <div className="flex items-center gap-2.5">
      {/* Mini avatar */}
      <div className="relative shrink-0">
        <div className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-600 bg-slate-700 text-xs font-bold text-white">
          {avatarLetter}
        </div>
        <span
          className={cn(
            "absolute -right-0.5 -bottom-0.5 h-2.5 w-2.5 rounded-full ring-2 ring-slate-800",
            dotColor,
          )}
        />
      </div>

      {/* Name + status */}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-slate-200">
          {friend.username}
        </p>
        <p className={cn("truncate text-xs", statusColor)}>{statusLabel}</p>
      </div>
    </div>
  );
}
