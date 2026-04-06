import { createAuthClient } from "better-auth/react";
import { convexClient } from "@convex-dev/better-auth/client/plugins";

/**
 * Better Auth's generic inference doesn't fully resolve method types
 * when the Convex plugin is included. We define the shape of the methods
 * we use so consumers get autocomplete and type safety.
 */
interface AuthClient {
  signIn: {
    email: (opts: {
      email: string;
      password: string;
    }) => Promise<{
      data: unknown;
      error: { message?: string; status?: number } | null;
    }>;
  };
  signOut: () => Promise<void>;
  useSession: () => {
    data: { session: unknown; user: unknown } | null;
    isPending: boolean;
    error: unknown;
  };
}

const client = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_SITE_URL!,
  plugins: [convexClient()],
});

export const authClient: AuthClient = client;
