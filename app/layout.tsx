import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Providers from "./providers";
import { Toaster } from "@/components/ui/toaster";
import Header from "@/components/header";
import ClientOnly from "@/components/client-only";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Etheract",
  description:
    "web tool that allows users to interact with unverified smart contract methods with simple UI.",
};

type RootLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <div className="flex flex-col">
            <Header />
            <div className="container flex-1 py-12">
              <ClientOnly>{children}</ClientOnly>
            </div>
          </div>
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}
