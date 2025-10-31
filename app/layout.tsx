import "./globals.css";
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { headers } from "next/headers";

import { Providers } from "../components/providers";
import AuthHydrator from "../components/AuthHydrator";

export const metadata: Metadata = {
  title: "Nasdem Website",
  description: "Nasdem Website",
  generator: "Nasdem Website",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let user: {
    userId: number;
    role: string;
    email?: string;
    username?: string;
  } | null = null;
  let isAdminRoute = false;
  try {
    const hdrs = await headers();
    const encoded = hdrs.get("x-user");
    const adminFlag = hdrs.get("x-admin-route");
    if (adminFlag === "1") {
      isAdminRoute = true;
    }
    if (encoded) {
      try {
        user = JSON.parse(Buffer.from(encoded, "base64").toString("utf-8"));
      } catch {}
    }
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("headers() unavailable during prerendering:", error);
    }
  }
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable} scheme-dark`}
      suppressHydrationWarning
    >
      <body
        style={{ fontFamily: GeistSans.style.fontFamily }}
        suppressHydrationWarning
      >
        <AuthHydrator user={user} />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
