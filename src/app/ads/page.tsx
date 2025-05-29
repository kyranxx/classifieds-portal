import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export const revalidate = 0; // Revalidate data on every request

async function getAds() {
  const { data: ads, error } = await supabase
    .from('ads')
    .select('*')
    .order('is_topped', { ascending: false, nullsFirst: false }) // Topped ads first
    .order('topped_expires_at', { ascending: false, nullsFirst: true }) // Newer topped ads first
    .order('created_at', { ascending: false }); // Newest ads first for non-topped

  if (error) {
    console.error('Error fetching ads:', error);
    return [];
  }
  return ads || [];
}

export default async function AdsPage() {
  const ads = await getAds();

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-slate-800">Classified Ads</h1>
        <Link href="/create-ad" className="bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2 px-6 rounded-md transition duration-150 shadow-sm hover:shadow-md">
          Post New Ad
        </Link>
      </div>

      {ads.length === 0 ? (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-slate-700">No ads found</h3>
          <p className="mt-1 text-sm text-slate-500">Be the first to post an ad!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-8">
          {ads.map((ad) => (
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
