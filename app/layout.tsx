import "./globals.css";
import { Inter } from "next/font/google";
import { Navbar } from "@/app/components/navbar";
import { Toaster } from "@/app/components/ui/sonner";
import { Footer } from "@/app/components/footer";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Instant Aberturas",
  description: "Instant Aberturas app",
  icons: {
    icon: "/instantAberturasLogo.svg",
    apple: "/instantAberturasLogo.svg",
  },
  openGraph: {
    title: "Instant Aberturas app",
    description: "Instant Aberturas app",
    type: "website",
    authors: "https://github.com/OmarReales",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <CartProvider>
            <Navbar />
            <main className="min-h-screen bg-gray-50 pt-16">{children}</main>
            <Footer />
            <Toaster />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
