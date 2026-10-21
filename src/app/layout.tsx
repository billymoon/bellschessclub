import type { Metadata } from "next";
import localFont from "next/font/local";
// @ts-ignore
import "./globals.css";
import { Header } from "./Header";
import {
  getUserInfoFromCookie,
  getUserInfoFromImpersonatorCookie,
} from "@/modules/cookies";
import { Analytics } from "@vercel/analytics/next";
import { ServerStoreProvider } from "@/stores/server-store-provider";

export const googleSansFlexLocal = localFont({
  src: "../../public/GoogleSansFlex-VariableFont_GRAD,ROND,opsz,slnt,wdth,wght.ttf",
});

// TODO: it would be nice to be able to import google sans felx from the package without errors :-\
// import { Google_Sans_Flex } from "next/font/google";
// const googleSansFlex = Google_Sans_Flex({
//   variable: "--font-google-sans-flex",
//   subsets: ["latin"],
//   axes: ["ROND", "opsz", "wdth"],
//   // adjustFontFallback: false,
// });

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
      <body className={`${googleSansFlexLocal.className} antialiased`}>
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
