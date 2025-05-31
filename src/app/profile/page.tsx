'use client';

import { supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AdCard, { Ad as AdCardType } from '@/components/AdCard'; // Import AdCard and its type

// Use AdCardType for userAds state
export default function ProfilePage() {
  const [user, setUser] = useState<any>(null); // Consider defining a User type
  const [userAds, setUserAds] = useState<AdCardType[]>([]);
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
        setUserAds([]); // Ensure it's an empty array on error
      } else {
        // Adapt fetched ads to AdCardType if necessary, ensuring id is a string
        setUserAds((ads || []).map(ad => ({
          ...ad,
          id: String(ad.id), // Ensure id is string
          price: ad.price, // Ensure price matches AdCardType (number | string | null)
          created_at: ad.created_at, // Ensure created_at matches AdCardType (string | Date | null)
        })) as AdCardType[]);
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
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <div className="bg-white p-6 sm:p-8 shadow-lg rounded-xl mb-8 border border-slate-200">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-1">Your Profile</h1>
        <p className="text-slate-600 text-sm">Welcome, <span className="font-medium text-sky-600">{user.email}</span>!</p>
        {/* Add more profile details or settings links here later */}
      </div>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl md:text-2xl font-semibold text-slate-700">Your Ads</h2>
        <Link 
          href="/create-ad" 
          className="bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2 px-5 rounded-lg transition duration-150 shadow-sm hover:shadow-md text-sm"
        >
          Post New Ad
        </Link>
      </div>
      
      {userAds.length === 0 ? (
         <div className="text-center py-16 bg-white p-6 shadow-md rounded-xl border border-slate-200">
          <svg className="mx-auto h-16 w-16 text-slate-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
          </svg>
          <h3 className="mt-2 text-xl font-semibold text-slate-700">You haven't posted any ads yet.</h3>
          <p className="mt-1 text-md text-slate-500">Why not create your first one?</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {userAds.map((ad) => (
            <AdCard key={ad.id} ad={ad} />
          ))}
        </div>
      )}
    </div>
  );
}
