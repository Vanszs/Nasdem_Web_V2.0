import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "./providers";
import { headers } from "next/headers";
import AuthHydrator from "./components/layout/AuthHydrator";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NasDem Admin Panel - Sidoarjo",
  description:
    "Panel administrasi untuk DPD NasDem Sidoarjo - Manajemen konten, berita, galeri, dan informasi organisasi",
  keywords: [
    "NasDem",
    "Sidoarjo",
    "Admin Panel",
    "Politik",
    "Partai",
    "Indonesia",
  ],
  authors: [{ name: "NasDem Sidoarjo" }],
  creator: "NasDem Sidoarjo",
  publisher: "NasDem Sidoarjo",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://nasdem-sidoarjo.id"),
  openGraph: {
    title: "NasDem Admin Panel - Sidoarjo",
    description: "Panel administrasi untuk DPD NasDem Sidoarjo",
    url: "https://admin.nasdem-sidoarjo.id",
    siteName: "NasDem Admin Panel",
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "NasDem Admin Panel - Sidoarjo",
    description: "Panel administrasi untuk DPD NasDem Sidoarjo",
    creator: "@nasdemsidoarjo",
  },
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Read user from middleware-injected header
  const hdrs = await headers();
  const encoded = hdrs.get("x-user");
  let user: {
    userId: number;
    role: string;
    email?: string;
    username?: string;
  } | null = null;
  if (encoded) {
    try {
      user = JSON.parse(Buffer.from(encoded, "base64").toString("utf-8"));
    } catch {}
  }
  return (
    <Providers>
      <div className={`${inter.className}`} suppressHydrationWarning>
        {/* Hydrate auth store from SSR without extra API calls */}
        <AuthHydrator user={user} />
        {children}
      </div>
    </Providers>
  );
}
