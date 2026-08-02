import { Manrope } from "next/font/google";
import "./globals.css";
import Providers from "@/components/common/Providers";
import { Toaster } from "@/components/ui/sonner";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata = {
  title: "Alleyo — See what's happening around you",
  description: "Discover nearby businesses, offers, and local updates.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${manrope.variable} h-full antialiased`}>
      <body className="min-h-full">
        <Providers>{children}</Providers>
        <Toaster />
      </body>
    </html>
  );
}
