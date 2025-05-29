import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from '@/lib/supabase/server'; // Import server-side client
import LogoutButton from '@/components/LogoutButton'; // Import the new LogoutButton
import { Providers } from "./providers";
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
    <html lang="en" suppressHydrationWarning className="light">
      <body>
        <Providers>
          <nav className="bg-white shadow-md">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
              <Link href="/" className="text-2xl font-bold text-sky-600 hover:text-sky-700">
                Bazzoo
              </Link>
              <div className="space-x-4">
                <Link href="/ads" className="text-slate-700 hover:text-sky-600 font-medium">
                  All Ads
                </Link>
                <Link href="/search" className="text-slate-700 hover:text-sky-600 font-medium">
                  Search
                </Link>
                <Link href="/create-ad" className="text-slate-700 hover:text-sky-600 font-medium">
                  Post Ad
                </Link>
                {user ? (
                  <>
                    <Link href="/profile" className="text-slate-700 hover:text-sky-600 font-medium">
                      Profile
                    </Link>
                    <LogoutButton />
                  </>
                ) : (
                  <Link href="/" className="bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2 px-4 rounded-md transition duration-150">
                    Login / Sign Up
                  </Link>
                )}
              </div>
            </div>
          </nav>
          <main className="container mx-auto mt-6 p-4">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
