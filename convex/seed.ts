import { v } from "convex/values";
import { internalAction } from "./_generated/server";

export const createUser = internalAction({
  args: {
    email: v.string(),
    password: v.string(),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const convexSiteUrl = process.env.CONVEX_SITE_URL;
    if (!convexSiteUrl) {
      throw new Error(
        "CONVEX_SITE_URL env var not set. Run: npx convex env set CONVEX_SITE_URL <your-convex-site-url>",
      );
    }

    const response = await fetch(`${convexSiteUrl}/api/auth/sign-up/email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: args.email,
        password: args.password,
        name: args.name,
      }),
    });

    const body = await response.text();
    console.log(`Seed user response: ${response.status} ${body}`);

    if (!response.ok) {
      throw new Error(`Failed to create test user: ${response.status} ${body}`);
    }

    return { status: response.status, body };
  },
});
