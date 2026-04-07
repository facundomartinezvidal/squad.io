"use client";

import { useState } from "react";
import type { Doc, Id } from "../../convex/_generated/dataModel";
import { Search, Star } from "lucide-react";
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
  onChatOpen?: (contactId: Id<"players">) => void;
}

export function ProfileSidebar({ player, friends, onChatOpen }: ProfileSidebarProps) {
  const [search, setSearch] = useState("");
  const rankColors = getRankColor(player.rank);
  const rankLabel = player.division
    ? `${player.rank} ${player.division}`
    : player.rank;
  const avatarLetter = player.username.charAt(0).toUpperCase();

  const filteredFriends = search
    ? friends.filter((f) =>
        f.username.toLowerCase().includes(search.toLowerCase()),
      )
    : friends;

  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-slate-700/50 bg-slate-900/80">
      {/* Profile card — fixed top */}
      <div className="shrink-0 p-4 pb-3">
        <div className="flex flex-col items-center gap-3 rounded-xl border border-slate-700/50 bg-slate-800/60 p-4">
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
          <h2 className="text-lg font-bold text-white">{player.username}</h2>
          <div
            className={cn(
              "rounded-full px-3 py-1 text-sm font-semibold",
              rankColors.text,
              rankColors.bg,
            )}
          >
            {rankLabel}
          </div>
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
      </div>

      {/* Friends section — scrollable, fills remaining space */}
      <div className="flex min-h-0 flex-1 flex-col px-4 pb-3">
        <div className="flex flex-1 flex-col gap-2 overflow-hidden rounded-xl border border-slate-700/50 bg-slate-800/60 p-3">
          <h3 className="shrink-0 text-xs font-semibold tracking-wider text-slate-400 uppercase">
            Amigos conectados
          </h3>

          {/* Search input */}
          <div className="relative shrink-0">
            <Search className="pointer-events-none absolute top-1/2 left-2.5 h-3.5 w-3.5 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Buscar amigo..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-slate-600/50 bg-slate-700/50 py-1.5 pr-3 pl-8 text-sm text-slate-200 placeholder-slate-500 outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
            />
          </div>

          {/* Scrollable friend list */}
          <div className="flex-1 overflow-y-auto">
            {filteredFriends.length === 0 && (
              <p className="py-2 text-center text-sm text-slate-500">
                {search ? "Sin resultados" : "Sin amigos conectados"}
              </p>
            )}
            <div className="flex flex-col gap-0.5">
              {filteredFriends.map((friend) => (
                <FriendRow
                  key={friend._id}
                  friend={friend}
                  onClick={onChatOpen ? () => onChatOpen(friend._id) : undefined}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Social links — fixed bottom */}
      <div className="shrink-0 px-4 pb-3">
        <div className="flex items-center justify-center gap-3 rounded-xl border border-slate-700/50 bg-slate-800/60 px-3 py-2.5">
          <SocialIconLink href="https://discord.gg/squadio" label="Discord">
            <DiscordIcon />
          </SocialIconLink>
          <SocialIconLink href="https://x.com/squadio" label="Twitter">
            <TwitterIcon />
          </SocialIconLink>
          <SocialIconLink href="https://instagram.com/squadio" label="Instagram">
            <InstagramIcon />
          </SocialIconLink>
        </div>
      </div>
    </aside>
  );
}

function SocialIconLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-700/40 hover:text-slate-200"
    >
      {children}
    </a>
  );
}

function DiscordIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4.5 w-4.5">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  );
}

function TwitterIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
    </svg>
  );
}

function FriendRow({ friend, onClick }: { friend: Doc<"players">; onClick?: () => void }) {
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

  const Wrapper = onClick ? "button" : "div";

  return (
    <Wrapper
      type={onClick ? "button" : undefined}
      onClick={onClick}
      className={cn(
        "flex items-center gap-2.5 rounded-lg p-1",
        onClick && "cursor-pointer transition-colors hover:bg-slate-700/30",
      )}
    >
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
    </Wrapper>
  );
}
