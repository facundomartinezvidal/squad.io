"use client";

import type { Doc, Id } from "../../convex/_generated/dataModel";
import { Heart, Swords, TrendingUp, Trophy, UserCheck } from "lucide-react";
import { cn } from "~/lib/utils";

interface ActivitySidebarProps {
  matches: Doc<"players">[];
  stats: {
    totalSwipes: number;
    likes: number;
    rejects: number;
    matchCount: number;
  };
  onChatOpen?: (contactId: Id<"players">) => void;
}

export function ActivitySidebar({ matches, stats, onChatOpen }: ActivitySidebarProps) {
  return (
    <aside className="flex w-64 shrink-0 flex-col border-l border-slate-700/50 bg-slate-900/80">
      {/* Stats panel */}
      <div className="shrink-0 p-4 pb-3">
        <div className="rounded-xl border border-slate-700/50 bg-slate-800/60 p-4">
          <h3 className="mb-3 text-xs font-semibold tracking-wider text-slate-400 uppercase">
            Tus estadísticas
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <StatCard
              icon={<Swords className="h-4 w-4 text-blue-400" />}
              label="Swipes"
              value={stats.totalSwipes}
            />
            <StatCard
              icon={<Heart className="h-4 w-4 text-emerald-400" />}
              label="Likes"
              value={stats.likes}
            />
            <StatCard
              icon={<UserCheck className="h-4 w-4 text-amber-400" />}
              label="Matches"
              value={stats.matchCount}
            />
            <StatCard
              icon={<TrendingUp className="h-4 w-4 text-purple-400" />}
              label="Match %"
              value={
                stats.likes > 0
                  ? `${Math.round((stats.matchCount / stats.likes) * 100)}%`
                  : "—"
              }
            />
          </div>
        </div>
      </div>

      {/* Matches list */}
      <div className="flex min-h-0 flex-1 flex-col px-4 pb-4">
        <div className="flex flex-1 flex-col gap-2 overflow-hidden rounded-xl border border-slate-700/50 bg-slate-800/60 p-3">
          <div className="flex shrink-0 items-center gap-2">
            <Trophy className="h-3.5 w-3.5 text-amber-400" />
            <h3 className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
              Tus matches
            </h3>
          </div>

          <div className="flex-1 overflow-y-auto">
            {matches.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-6 text-center">
                <Heart className="h-8 w-8 text-slate-600" />
                <p className="text-sm text-slate-500">
                  Aún no tenés matches.
                </p>
                <p className="text-xs text-slate-600">
                  Dale like a jugadores para hacer match!
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-0.5">
                {matches.map((match) => (
                  <MatchRow
                    key={match._id}
                    player={match}
                    onClick={onChatOpen ? () => onChatOpen(match._id) : undefined}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number | string;
}) {
  return (
    <div className="flex flex-col items-center gap-1 rounded-lg bg-slate-700/30 py-2.5">
      {icon}
      <span className="text-lg font-bold text-white">{value}</span>
      <span className="text-[10px] tracking-wide text-slate-500 uppercase">
        {label}
      </span>
    </div>
  );
}

function getRankColor(rank: string): string {
  switch (rank.toLowerCase()) {
    case "iron": return "text-gray-400";
    case "bronze": return "text-amber-700";
    case "silver": return "text-slate-300";
    case "gold": return "text-amber-400";
    case "platinum": return "text-teal-400";
    case "emerald": return "text-emerald-400";
    case "diamond": return "text-blue-400";
    case "master": return "text-purple-400";
    case "grandmaster": return "text-red-400";
    case "challenger": return "text-yellow-400";
    default: return "text-slate-400";
  }
}

function MatchRow({ player, onClick }: { player: Doc<"players">; onClick?: () => void }) {
  const avatarLetter = player.username.charAt(0).toUpperCase();
  const rankLabel = player.division
    ? `${player.rank} ${player.division}`
    : player.rank;

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-2.5 rounded-lg p-1.5 text-left transition-colors hover:bg-slate-700/30">
      <div className="relative shrink-0">
        <div className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-600 bg-slate-700 text-xs font-bold text-white">
          {avatarLetter}
        </div>
        {player.isOnline && (
          <span className="absolute -right-0.5 -bottom-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-slate-800" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-slate-200">
          {player.username}
        </p>
        <div className="flex items-center gap-1.5">
          <span className={cn("text-xs", getRankColor(player.rank))}>
            {rankLabel}
          </span>
          <span className="text-[10px] text-slate-600">·</span>
          <span className="text-xs text-slate-500 capitalize">{player.role}</span>
        </div>
      </div>
    </button>
  );
}
