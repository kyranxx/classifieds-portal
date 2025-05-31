import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from '@/lib/supabase/server'; // Import server-side client
import '@/app/globals.css'; // Import global styles
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
    <html lang="en" suppressHydrationWarning className="light h-full">
      <body className="flex flex-col min-h-full bg-slate-100"> {/* Changed bg-slate-50 to bg-slate-100 for a slightly darker page background */}
        <Providers>
          <header className="bg-white shadow-sm sticky top-0 z-50"> {/* Made header sticky */}
            <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">
                <div className="flex items-center">
                  <Link href="/" className="text-2xl font-bold text-sky-600 hover:text-sky-700 transition-colors">
                    Bazzoo
                  </Link>
                </div>
                <div className="hidden md:flex items-center space-x-6">
                  <Link href="/ads" className="text-slate-600 hover:text-sky-600 font-medium transition-colors">
                    All Ads
                  </Link>
                  <Link href="/search" className="text-slate-600 hover:text-sky-600 font-medium transition-colors">
                    Search
                  </Link>
                  {/* User-specific links will be on the right */}
                </div>
                <div className="flex items-center space-x-3">
                  <Link href="/create-ad" className="bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2 px-4 rounded-md text-sm transition-colors shadow-sm">
                    Post Ad
                  </Link>
                  {user ? (
                    <>
                      <Link href="/profile" className="text-slate-600 hover:text-sky-600 font-medium text-sm transition-colors">
                        Profile
                      </Link>
                      <LogoutButton />
                    </>
                  ) : (
                    <Link href="/" className="text-slate-600 hover:text-sky-600 font-medium text-sm transition-colors border border-slate-300 hover:border-sky-500 px-3 py-1.5 rounded-md">
                      Login / Sign Up
                    </Link>
                  )}
                </div>
              </div>
            </nav>
          </header>
          <main className="container mx-auto mt-4 sm:mt-6 p-4 flex-grow"> {/* Adjusted top margin */}
            {children}
          </main>
          <footer className="bg-slate-100 border-t border-slate-200 mt-auto py-6"> {/* Changed mt-12 to mt-auto and added py-6 */}
            <div className="container mx-auto px-4 text-center text-sm text-slate-500">
              &copy; {new Date().getFullYear()} Bazzoo Classifieds. All rights reserved.
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
