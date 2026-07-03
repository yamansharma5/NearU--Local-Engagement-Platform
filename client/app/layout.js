import "./globals.css";
import Providers from "@/components/common/Providers";
import { Toaster } from "@/components/ui/sonner";

export const metadata = {
  title: "nearU",
  description: "Discover nearby businesses, offers, and local updates.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark h-full antialiased">
      <body className="min-h-full">
        <Providers>{children}</Providers>
        <Toaster />
      </body>
    </html>
  );
}
