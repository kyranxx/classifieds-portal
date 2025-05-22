import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { createClient } from '@/lib/supabase/server'; // Import server-side client
import LogoutButton from '@/components/LogoutButton'; // Import the new LogoutButton

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Classifieds Portal",
  description: "A modern classified ads platform",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = createClient(); // Use the server-side client
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <nav className="bg-gray-800 p-4 text-white">
          <div className="container mx-auto flex justify-between items-center">
            <Link href="/" className="text-xl font-bold">
              Classifieds
            </Link>
            <div>
              <Link href="/ads" className="mr-4 hover:text-gray-300">
                All Ads
              </Link>
              <Link href="/create-ad" className="mr-4 hover:text-gray-300">
                Post Ad
              </Link>
              {user ? (
                <>
                  <Link href="/profile" className="mr-4 hover:text-gray-300">
                    Profile
                  </Link>
                  <LogoutButton />
                </>
              ) : (
                <Link href="/" className="mr-4 hover:text-gray-300">
                  Login
                </Link>
              )}
            </div>
          </div>
        </nav>
        <main className="container mx-auto mt-4">
          {children}
        </main>
      </body>
    </html>
  );
}
