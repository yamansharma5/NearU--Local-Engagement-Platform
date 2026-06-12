import "./globals.css";
import Providers from "@/components/common/Providers";
import Toaster from "@/components/ui/Toaster";

export const metadata = {
  title: "nearU",
  description: "Discover nearby businesses, offers, and local updates.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full bg-zinc-950 text-zinc-50">
        <Providers>{children}</Providers>
        <Toaster />
      </body>
    </html>
  );
}
