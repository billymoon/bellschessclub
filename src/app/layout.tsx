import type { Metadata } from "next";
import { Geist, Geist_Mono, Google_Sans_Flex } from "next/font/google";
import "./globals.css";
import { Header } from "./Header";
import {
  getUserInfoFromCookie,
  getUserInfoFromImpersonatorCookie,
} from "@/modules/cookies";
import { Analytics } from "@vercel/analytics/next";
import { ServerStoreProvider } from "@/stores/server-store-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const googleSansFlex = Google_Sans_Flex({
  variable: "--font-google-sans-flex",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bells Chess Club",
  description: "Home of Chess in Edinburgh South",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieUserInfo = await getUserInfoFromCookie();
  const { _id: imposterId } = await getUserInfoFromImpersonatorCookie();

  return (
    <html lang="en">
      <meta charSet="UTF-8" />
      <meta name="google" content="notranslate" />
      <meta httpEquiv="Content-Language" content="en" />
      <head>
        <title>Bells Chess Club</title>
        <meta name="apple-mobile-web-app-title" content="Bells" />
      </head>
      <body className={`${googleSansFlex.variable} antialiased`}>
        {process.env.NODE_ENV === "production" ? <Analytics /> : null}
        <Header
          isAdmin={cookieUserInfo.isAdmin}
          isMember={cookieUserInfo.isMember}
          isImpersonating={Boolean(imposterId)}
        />
        <ServerStoreProvider
          initialData={{
            cookieUserInfo,
          }}
        >
          {children}
        </ServerStoreProvider>
      </body>
    </html>
  );
}
