import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import AdCard, { Ad } from '@/components/AdCard'; // Import the new AdCard component and Ad interface
import AdFilters from '@/components/AdFilters'; // Import the AdFilters component

export const revalidate = 0; // Revalidate data on every request

async function getAds(): Promise<Ad[]> { // Ensure the return type matches the Ad interface
  const { data, error } = await supabase
    .from('ads')
    .select('*')
    .order('is_topped', { ascending: false, nullsFirst: false }) // Topped ads first
    .order('topped_expires_at', { ascending: false, nullsFirst: true }) // Newer topped ads first
    .order('created_at', { ascending: false }); // Newest ads first for non-topped

  if (error) {
    console.error('Error fetching ads:', error);
    return [];
  }
  // Ensure the returned data conforms to the Ad interface, especially for id.
  // Supabase typically returns `id` as a string if it's a UUID or text type.
  // If `id` is a number in your DB, you might need to cast it or adjust the Ad interface.
  return (data || []).map(ad => ({
    ...ad,
    id: String(ad.id), // Ensure id is a string as per Ad interface
  })) as Ad[];
}

export default async function AdsPage() {
  const ads = await getAds();

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-800">All Classified Ads</h1>
        <Link 
          href="/create-ad" 
          className="bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2.5 px-6 rounded-lg transition duration-150 shadow-sm hover:shadow-md text-sm sm:text-base"
        >
          Post New Ad
        </Link>
      </div>

      {/* Filters Section */}
      <AdFilters />

      {ads.length === 0 ? (
        <div className="text-center py-16">
          <svg className="mx-auto h-16 w-16 text-slate-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
          </svg>
          <h3 className="mt-2 text-xl font-semibold text-slate-700">No ads found</h3>
          <p className="mt-1 text-md text-slate-500">Be the first to post an ad or try adjusting your filters!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {ads.map((ad) => (
            <AdCard key={ad.id} ad={ad} />
          ))}
        </div>
      )}
    </div>
  );
}
