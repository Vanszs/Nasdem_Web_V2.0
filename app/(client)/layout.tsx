import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";


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
        {children}
      </body>
    </html>
  );
}
