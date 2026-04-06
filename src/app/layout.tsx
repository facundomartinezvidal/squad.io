import "~/styles/globals.css";

import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { getToken } from "~/lib/auth-server";
import { ConvexClientProvider } from "~/components/convex-client-provider";

export const metadata: Metadata = {
  title: "Squad.io",
  description: "Coming soon",
  icons: [{ rel: "icon", url: "/favicon.png" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const initialToken = await getToken();
  return (
    <html lang="en" className={`${geist.variable}`}>
      <body>
        <ConvexClientProvider initialToken={initialToken}>
          {children}
        </ConvexClientProvider>
      </body>
    </html>
  );
}
