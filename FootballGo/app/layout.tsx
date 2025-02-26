import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import clsx from "clsx";
import AuthProvider from "./auth/provider";
import QueryProvider from "./(providers)/QueryProvider";
import { Toaster } from 'react-hot-toast'

const dmSans = DM_Sans({
  subsets: ["latin"], 
  weight: ["400", "500", "700"], 

});

export const metadata: Metadata = {
  title: "FootDataGo",
  description: "Récupérez et comparez la data des joueurs des 5 grands championnats",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="relative" suppressHydrationWarning> 
      <body className={clsx(
        dmSans.className, 
        "antialiased " 
      )}>
        <QueryProvider>
        <AuthProvider>
        {children}
        <Toaster position="top-center" />
        </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}