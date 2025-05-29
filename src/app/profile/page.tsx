'use client';

import { supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Ad {
  id: string;
  title: string;
  description: string;
  price: number | null;
  category: string | null;
  image_urls: string[] | null;
  lottie_url: string | null;
  created_at: string;
  is_topped: boolean;
  topped_expires_at: string | null;
}

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [userAds, setUserAds] = useState<Ad[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchUserData() {
      setIsLoading(true);
      setError(null);

      const { data: { user: fetchedUser } } = await supabase.auth.getUser();

      if (!fetchedUser) {
        router.push('/'); // Redirect to home/login if not logged in
        return;
      }
      setUser(fetchedUser);

      const { data: ads, error: adsError } = await supabase
        .from('ads')
        .select('*')
        .eq('user_id', fetchedUser.id)
        .order('created_at', { ascending: false });

      if (adsError) {
        console.error('Error fetching user ads:', adsError);
        setError(`Failed to load your ads: ${adsError.message}`);
      } else {
        setUserAds(ads || []);
      }
      setIsLoading(false);
    }

    fetchUserData();

    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.push('/'); // Redirect if user logs out
      } else if (session.user.id !== user?.id) {
        // If a different user logs in, refetch data
        fetchUserData();
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [router, user?.id]); // Re-run if router or user ID changes

  if (isLoading) {
    return <div className="container mx-auto p-4 text-center text-slate-600">Loading profile...</div>;
  }

  if (error) {
    return <div className="container mx-auto p-4 text-center text-red-600">Error: {error}</div>;
  }

  if (!user) {
    // This case should ideally be handled by redirect in useEffect, but as a fallback:
    return <div className="container mx-auto p-4 text-center text-slate-600">Redirecting to login...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white p-6 md:p-8 shadow-xl rounded-xl mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-2">Your Profile</h1>
        <p className="text-slate-600">Welcome, <span className="font-medium text-sky-600">{user.email}</span>!</p>
        {/* Add more profile details or settings links here later */}
      </div>

      <h2 className="text-2xl md:text-3xl font-semibold text-slate-700 mb-6">Your Ads</h2>
      {userAds.length === 0 ? (
         <div className="text-center py-12 bg-white p-6 shadow-lg rounded-xl">
          <svg className="mx-auto h-12 w-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-slate-700">You haven't posted any ads yet.</h3>
          <p className="mt-1 text-sm text-slate-500">Why not create your first one?</p>
          <div className="mt-6">
            <Link href="/create-ad" className="bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2 px-6 rounded-md transition duration-150 shadow-sm hover:shadow-md">
              Post New Ad
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-8">
          {userAds.map((ad) => (
            <Link href={`/ads/${ad.id}`} key={ad.id} className="group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:-translate-y-1">
              <div className="w-full h-52 bg-slate-200 flex items-center justify-center relative overflow-hidden">
                {ad.is_topped && (
                  <div className="absolute top-2 right-2 bg-amber-400 text-amber-900 text-xs font-semibold px-2 py-1 rounded-full shadow-md z-10">
                    TOP AD
                  </div>
                )}
                {ad.image_urls && ad.image_urls.length > 0 ? (
                  <img
                    src={ad.image_urls[0]}
                    alt={ad.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <svg className="w-16 h-16 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                )}
              </div>
              <div className="p-5">
                <h2 className="text-lg font-semibold text-slate-800 mb-1 truncate group-hover:text-sky-600 transition-colors" title={ad.title}>
                  {ad.title}
                </h2>
                <p className="text-sky-600 font-bold text-xl mb-2">
                  {ad.price ? `$${Number(ad.price).toFixed(2)}` : 'Free'}
                </p>
                <p className="text-xs text-slate-500">
                  Posted: {new Date(ad.created_at).toLocaleDateString()}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
