"use client";

import type { Doc } from "../../convex/_generated/dataModel";
import {
  Crosshair,
  Heart,
  Shield,
  Star,
  Sword,
  Trees,
} from "lucide-react";
import type { LucideProps } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
} from "~/components/ui/card";
import { cn } from "~/lib/utils";

interface PlayerCardProps {
  player: Doc<"players">;
}

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

function RoleIcon({ role, ...props }: { role: string } & LucideProps) {
  switch (role.toLowerCase()) {
    case "top":
      return <Shield {...props} />;
    case "jungle":
      return <Trees {...props} />;
    case "mid":
      return <Crosshair {...props} />;
    case "adc":
      return <Sword {...props} />;
    case "support":
      return <Heart {...props} />;
    default:
      return <Crosshair {...props} />;
  }
}

function ReputationStars({ reputation }: { reputation: number }) {
  const fullStars = Math.floor(reputation);
  const totalStars = 5;

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: totalStars }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            "h-4 w-4",
            i < fullStars
              ? "fill-amber-400 text-amber-400"
              : "fill-transparent text-slate-600",
          )}
        />
      ))}
      <span className="ml-1 text-sm text-slate-400">{reputation.toFixed(1)}</span>
    </div>
  );
}

export function PlayerCard({ player }: PlayerCardProps) {
  const rankColors = getRankColor(player.rank);
  const avatarLetter = player.username.charAt(0).toUpperCase();
  const rankLabel = player.division
    ? `${player.rank} ${player.division}`
    : player.rank;

  return (
    <Card className="mx-auto w-full max-w-[380px] rounded-xl border-slate-700 bg-slate-800/90 shadow-lg">
      <CardHeader className="pb-0">
        {/* Avatar + Username + Online Status */}
        <div className="flex flex-col items-center gap-3">
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
              <span className="absolute right-0.5 bottom-0.5 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-slate-800" />
            )}
          </div>
          <h2 className="text-xl font-bold text-white">{player.username}</h2>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-4 pt-4">
        {/* Role + Rank row */}
        <div className="flex items-center justify-center gap-3 flex-wrap">
          {/* Role badge */}
          <div className="flex items-center gap-1.5 rounded-full bg-slate-700/60 px-3 py-1.5 text-sm text-slate-200">
            <RoleIcon role={player.role} className="h-4 w-4" />
            <span className="capitalize">{player.role}</span>
          </div>

          {/* Rank badge */}
          <div
            className={cn(
              "rounded-full px-3 py-1.5 text-sm font-medium",
              rankColors.text,
              rankColors.bg,
            )}
          >
            {rankLabel}
          </div>
        </div>

        {/* Stats row */}
        <div className="flex items-center justify-center gap-6 text-sm">
          <div className="flex flex-col items-center gap-0.5">
            <span className="text-xs text-slate-500 uppercase tracking-wide">Level</span>
            <span className="font-semibold text-slate-200">Lvl {player.level}</span>
          </div>
          <div className="h-8 w-px bg-slate-700" />
          <div className="flex flex-col items-center gap-0.5">
            <span className="text-xs text-slate-500 uppercase tracking-wide">Win Rate</span>
            <span className="font-semibold text-slate-200">{player.winRate}% WR</span>
          </div>
        </div>

        {/* Language + Server badges */}
        <div className="flex items-center justify-center gap-2 flex-wrap">
          <span className="rounded-md bg-slate-700/60 px-2.5 py-1 text-xs font-medium text-slate-300">
            {player.language}
          </span>
          <span className="rounded-md bg-slate-700/60 px-2.5 py-1 text-xs font-medium text-slate-300">
            {player.server}
          </span>
        </div>

        {/* Reputation stars */}
        <div className="flex flex-col items-center gap-1">
          <span className="text-xs text-slate-500 uppercase tracking-wide">Reputation</span>
          <ReputationStars reputation={player.reputation} />
        </div>
      </CardContent>
    </Card>
  );
}
