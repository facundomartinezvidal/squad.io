"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useConvexAuth, useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { authClient } from "~/lib/auth-client";
import { Button } from "~/components/ui/button";
import { PlayerCard } from "~/components/player-card";
import { ProfileSidebar } from "~/components/profile-sidebar";
import { ActivitySidebar } from "~/components/activity-sidebar";
import { X, Heart, Users, LogOut } from "lucide-react";

export default function HomePage() {
  const { isAuthenticated, isLoading: authLoading } = useConvexAuth();
  const router = useRouter();
  const [showMatch, setShowMatch] = useState(false);
  const [isSwiping, setIsSwiping] = useState(false);

  const currentPlayer = useQuery(
    api.players.getCurrentPlayer,
    isAuthenticated ? {} : "skip",
  );
  const nextPlayer = useQuery(
    api.players.getNextPlayer,
    isAuthenticated && currentPlayer ? {} : "skip",
  );
  const friends = useQuery(
    api.friends.getMyFriends,
    isAuthenticated && currentPlayer ? {} : "skip",
  );
  const matches = useQuery(
    api.swipes.getMatches,
    isAuthenticated && currentPlayer ? {} : "skip",
  );
  const stats = useQuery(
    api.swipes.getSwipeStats,
    isAuthenticated && currentPlayer ? {} : "skip",
  );
  const recordSwipe = useMutation(api.swipes.recordSwipe);
  const createProfile = useMutation(api.players.createMyProfile);

  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/login");
  };

  const handleSwipe = async (direction: "like" | "reject") => {
    if (!nextPlayer || isSwiping) return;
    setIsSwiping(true);
    try {
      const result = await recordSwipe({
        targetId: nextPlayer._id,
        direction,
      });
      if (result.matched) {
        setShowMatch(true);
      }
    } finally {
      setIsSwiping(false);
    }
  };

  const handleCreateProfile = async () => {
    await createProfile({ username: "Player", role: "Mid" });
  };

  // Loading state
  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-slate-900 via-blue-900 to-slate-900">
        <div className="text-center">
          <h1 className="text-5xl font-bold tracking-tight text-white md:text-7xl">
            Squad.io
          </h1>
          <p className="mt-6 text-xl text-white/60">Loading...</p>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-slate-900 via-blue-900 to-slate-900">
        <div className="text-center">
          <h1 className="text-5xl font-bold tracking-tight text-white md:text-7xl">
            Squad.io
          </h1>
          <p className="mt-6 text-xl text-white/60">Find your squad</p>
          <Button
            variant="outline"
            className="mt-8"
            onClick={() => router.push("/login")}
          >
            Sign in
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-linear-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Navbar */}
      <nav className="flex h-14 shrink-0 items-center justify-between border-b border-slate-700/50 bg-slate-900/90 px-6">
        <div className="w-24" />
        <h1 className="text-2xl font-extrabold tracking-widest text-white uppercase">
          Squad.io
        </h1>
        <div className="flex w-24 justify-end">
          <Button
            variant="ghost"
            size="icon"
            className="text-slate-400 hover:text-white"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </nav>

      {/* Body: sidebar + main */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left sidebar */}
        {currentPlayer && (
          <ProfileSidebar
            player={currentPlayer}
            friends={friends ?? []}
          />
        )}

        {/* Main content */}
        <main className="flex flex-1 flex-col items-center justify-center overflow-y-auto px-4 pb-8">
          {/* No player profile yet */}
          {currentPlayer === null && (
            <div className="text-center">
              <Users className="mx-auto h-16 w-16 text-slate-500" />
              <h2 className="mt-4 text-2xl font-bold text-white">
                Welcome to Squad.io
              </h2>
              <p className="mt-2 text-slate-400">
                Create your player profile to start finding teammates
              </p>
              <Button className="mt-6" onClick={handleCreateProfile}>
                Create Profile
              </Button>
            </div>
          )}

          {/* Loading player data */}
          {currentPlayer === undefined && (
            <p className="text-xl text-white/60">Loading...</p>
          )}

          {/* Swiping state */}
          {currentPlayer && nextPlayer && (
            <div className="flex flex-col items-center gap-6">
              <p className="text-center text-sm font-medium tracking-wide text-slate-400 uppercase">
                Desliza y encuentra tu compañero ideal
              </p>

              <PlayerCard player={nextPlayer} />

              {/* Action buttons */}
              <div className="flex items-center gap-8">
                <button
                  type="button"
                  disabled={isSwiping}
                  onClick={() => handleSwipe("reject")}
                  className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-red-500/50 bg-red-500/10 text-red-400 transition-all hover:scale-110 hover:border-red-500 hover:bg-red-500/20 hover:text-red-300 disabled:opacity-50"
                >
                  <X className="h-8 w-8" />
                </button>
                <button
                  type="button"
                  disabled={isSwiping}
                  onClick={() => handleSwipe("like")}
                  className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-emerald-500/50 bg-emerald-500/10 text-emerald-400 transition-all hover:scale-110 hover:border-emerald-500 hover:bg-emerald-500/20 hover:text-emerald-300 disabled:opacity-50"
                >
                  <Heart className="h-8 w-8" />
                </button>
              </div>
            </div>
          )}

          {/* Empty state - no more players */}
          {currentPlayer && nextPlayer === null && (
            <div className="text-center">
              <Users className="mx-auto h-16 w-16 text-slate-500" />
              <h2 className="mt-4 text-2xl font-bold text-white">
                No more players
              </h2>
              <p className="mt-2 text-slate-400">
                You&apos;ve seen all available players. Check back later!
              </p>
            </div>
          )}
        </main>

        {/* Right sidebar */}
        {currentPlayer && (
          <ActivitySidebar
            matches={matches ?? []}
            stats={stats ?? { totalSwipes: 0, likes: 0, rejects: 0, matchCount: 0 }}
          />
        )}
      </div>

      {/* Match overlay */}
      {showMatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="text-center">
            <Heart className="mx-auto h-20 w-20 animate-pulse text-emerald-400" />
            <h2 className="mt-4 text-4xl font-bold text-white">
              It&apos;s a Match!
            </h2>
            <p className="mt-2 text-lg text-slate-300">
              You both want to play together
            </p>
            <Button className="mt-6" onClick={() => setShowMatch(false)}>
              Keep swiping
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
