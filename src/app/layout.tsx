import "~/styles/globals.css";

import { type Metadata } from "next";
import { Host_Grotesk } from "next/font/google";
import { Toaster } from "sonner";
import { TRPCReactProvider } from "~/trpc/react";

export const metadata: Metadata = {
  title: "Voidtable",
  description: "Develop complex data models using Voidtable",
  icons: [{ rel: "icon", url: "/icon.svg" }],
};

const hostGrotesk = Host_Grotesk({
  subsets: ["latin"],
  variable: "--font-host-grotesk",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${hostGrotesk.variable}`}
      suppressHydrationWarning
    >
      <body>
        <Toaster />
        <TRPCReactProvider>{children}</TRPCReactProvider>
      </body>
    </html>
  );
}
