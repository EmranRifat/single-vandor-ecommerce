import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "./providers";
import { AuthProvider } from "@/lib/auth-context";
import ConditionalNavbar from "@/src/components/dashboard/ConditionalNavbar";
import Navbar from "../components/Navbar/index";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "StayNest | Vacation rentals, apartments, and short stays",
  description:
    "Discover amazing products at great prices. Shop electronics, fashion, home & living, and sports equipment.",
  openGraph: {
    images: [
      {
        url: "https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: [
      {
        url: "https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <AuthProvider>
          <Providers>
            <ConditionalNavbar />
            {/* <Navbar /> */}
            {children}
          </Providers>
        </AuthProvider>
      </body>
    </html>
  );
}
