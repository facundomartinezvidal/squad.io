"use client";

import { useRouter } from "next/navigation";
import { useConvexAuth } from "convex/react";
import { authClient } from "~/lib/auth-client";
import { Button } from "~/components/ui/button";

export default function HomePage() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/login");
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-slate-900 via-blue-900 to-slate-900">
        <div className="text-center">
          <h1 className="text-6xl font-bold tracking-tight text-white md:text-8xl">
            Squad.io
          </h1>
          <p className="mt-6 text-2xl text-white/60">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="text-center">
        <h1 className="text-6xl font-bold tracking-tight text-white md:text-8xl">
          Squad.io
        </h1>
        <p className="mt-6 text-2xl text-white/60">
          {isAuthenticated ? "Find your squad" : "Coming soon"}
        </p>
        {isAuthenticated && (
          <Button variant="outline" className="mt-8" onClick={handleLogout}>
            Sign out
          </Button>
        )}
      </div>
    </div>
  );
}
