import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export const revalidate = 0; // Revalidate data on every request

async function getAds() {
  const { data: ads, error } = await supabase
    .from('ads')
    .select('*')
    .order('created_at', { ascending: false });

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
      <h1 className="text-3xl font-bold mb-6 text-center">Classified Ads</h1>
      {ads.length === 0 ? (
        <p className="text-center text-gray-500">No ads found. Be the first to post one!</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {ads.map((ad) => (
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
              </div>
            </Link>
          ))}
        </div>
      )}
      <div className="mt-8 text-center">
        <Link href="/create-ad" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Post a New Ad
        </Link>
      </div>
    </div>
  );
}
