import { betterAuth } from "better-auth";
import { createClient, createApi } from "@convex-dev/better-auth";
import { convex } from "@convex-dev/better-auth/plugins";
import type { GenericCtx } from "@convex-dev/better-auth/utils";
import type { DataModel } from "./_generated/dataModel";
import { components } from "./_generated/api";
import authConfig from "./auth.config";
import { tables } from "./schema";

export const authComponent = createClient<DataModel, typeof tables>(
  components.betterAuth,
  { verbose: false },
);

const createAuthOptions = (ctx: GenericCtx<DataModel>) => {
  return {
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
  };
};

export const createAuth = (ctx: GenericCtx<DataModel>) => {
  return betterAuth(createAuthOptions(ctx));
};

export const { create, findOne, findMany, updateOne, updateMany, deleteOne, deleteMany } =
  createApi(tables, createAuthOptions);
