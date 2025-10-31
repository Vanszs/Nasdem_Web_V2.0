import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";

import NasdemHeader from "@/components/nasdem-header";
import NasdemFooter from "@/components/nasdem-footer";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable}`}
      suppressHydrationWarning
    >
      <body
        style={{ fontFamily: GeistSans.style.fontFamily }}
        suppressHydrationWarning
      >
        <NasdemHeader />
        {children}
        <NasdemFooter />
      </body>
    </html>
  );
}
