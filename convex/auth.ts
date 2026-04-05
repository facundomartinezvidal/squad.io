import { betterAuth } from "better-auth";
import { createClient } from "@convex-dev/better-auth";
import { convex } from "@convex-dev/better-auth/plugins";
import type { GenericCtx } from "@convex-dev/better-auth/utils";
import type { DataModel } from "./_generated/dataModel";
import { components } from "./_generated/api";
import authConfig from "./auth.config";

export const authComponent = createClient<DataModel>(
  components.betterAuth,
);

export const createAuth = (ctx: GenericCtx<DataModel>) => {
  return betterAuth({
    appName: "Squad.io",
    baseURL: process.env.SITE_URL,
    secret: process.env.BETTER_AUTH_SECRET,
    database: authComponent.adapter(ctx),
    emailAndPassword: {
      enabled: true,
      sendResetPassword: async ({
        user,
        url,
      }: {
        user: { email: string };
        url: string;
        token: string;
      }) => {
        console.log(`Password reset for ${user.email}: ${url}`);
      },
    },
    plugins: [convex({ authConfig })],
  });
};
