import { createAuthClient } from "better-auth/react";
import { convexClient } from "@convex-dev/better-auth/client/plugins";

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
export const authClient = createAuthClient({
  plugins: [convexClient()],
});
