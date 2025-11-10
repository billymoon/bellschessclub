import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "./Header";
import {
  getUserInfoFromCookie,
  getUserInfoFromImpersonatorCookie,
} from "@/modules/cookies";
import { Analytics } from "@vercel/analytics/next";
import { MembersHeader } from "@/components/MembersHeader";
import { getUserById, getUsers, queryDocuments } from "@/modules/turso";
import { MemberStoreProvider } from "@/stores/member-store-provider";

async function MembersLayout({ children }: { children: React.ReactNode }) {
  const { _id } = await getUserInfoFromCookie();

  return (
    <MemberStoreProvider
      initialData={{
        documents: await queryDocuments(),
        member: await getUserById(_id),
        members: await getUsers(false),
      }}
    >
      <MembersHeader />
      {children}
    </MemberStoreProvider>
  );
}

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sandy Bells Chess Club",
  description: "Home of Chess in Edinburgh South",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isAdmin, isMember } = await getUserInfoFromCookie();
  const { _id: imposterId } = await getUserInfoFromImpersonatorCookie();

  return (
    <html lang="en">
      <meta charSet="UTF-8" />
      <meta name="google" content="notranslate" />
      <meta httpEquiv="Content-Language" content="en" />
      <head>
        <title>Sandy Bells Chess Club</title>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {process.env.NODE_ENV === "production" ? <Analytics /> : null}
        <Header
          isAdmin={isAdmin}
          isMember={isMember}
          isImpersonating={Boolean(imposterId)}
        />
        {isMember ? <MembersLayout>{children}</MembersLayout> : children}
      </body>
    </html>
  );
}
