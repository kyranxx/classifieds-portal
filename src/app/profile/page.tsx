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
    return <div className="container mx-auto p-4 text-center">Loading profile...</div>;
  }

  if (error) {
    return <div className="container mx-auto p-4 text-center text-red-500">Error: {error}</div>;
  }

  if (!user) {
    return <div className="container mx-auto p-4 text-center">Please log in to view your profile.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">{user.email}'s Profile</h1>

      <h2 className="text-2xl font-semibold mb-4">Your Ads</h2>
      {userAds.length === 0 ? (
        <p className="text-center text-gray-500">You haven't posted any ads yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {userAds.map((ad) => (
            <Link href={`/ads/${ad.id}`} key={ad.id} className="block border rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-full h-48 bg-gray-200 flex items-center justify-center relative">
                {ad.image_urls && ad.image_urls.length > 0 ? (
                  <img
                    src={ad.image_urls[0]}
                    alt={ad.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-gray-500">No Image</span>
                )}
              </div>
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2 truncate" title={ad.title}>{ad.title}</h2>
                <p className="text-gray-700 font-bold text-lg mb-2">
                  {ad.price ? `$${Number(ad.price).toFixed(2)}` : 'Free'}
                </p>
                <p className="text-sm text-gray-500">
                  Posted on: {new Date(ad.created_at).toLocaleDateString()}
                </p>
                {ad.is_topped && (
                  <p className="text-sm text-green-600 font-semibold mt-2">Topped!</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
