import { supabase } from '@/lib/supabase'; // Assuming supabase client is here
import AdCard, { Ad } from '@/components/AdCard';
import AdFilters from '@/components/AdFilters';
// No need for Link from next/link if not used directly for navigation here

export const revalidate = 0; // Revalidate data on every request

async function getAllAds(): Promise<Ad[]> {
  const { data, error } = await supabase
    .from('ads')
    .select('*')
    .order('is_topped', { ascending: false, nullsFirst: false })
    .order('topped_expires_at', { ascending: false, nullsFirst: true })
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching all ads for homepage:', error);
    return [];
  }
  return (data || []).map(ad => ({
    ...ad,
    id: String(ad.id),
  })) as Ad[];
}

export default async function HomePage() {
  const ads = await getAllAds();

  return (
    <div className="space-y-8"> {/* Replaced section with div and added spacing */}
      {/* Filters Section - styled to be more compact and modern */}
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow border border-slate-200">
        <AdFilters />
      </div>

      {/* Ads Grid Section */}
      {ads.length === 0 ? (
        <div className="text-center py-16 bg-white p-6 shadow-md rounded-xl border border-slate-200">
          <svg className="mx-auto h-16 w-16 text-slate-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
          </svg>
          <h3 className="mt-2 text-xl font-semibold text-slate-700">No ads available right now.</h3>
          <p className="mt-1 text-md text-slate-500">Check back later or be the first to post an ad!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
          {ads.map((ad) => (
            <AdCard key={ad.id} ad={ad} />
          ))}
        </div>
      )}
    </div>
  );
}
