'use client';

import { useHits, UseHitsProps } from 'react-instantsearch'; // Updated import
import Link from 'next/link';

// Define the structure of an ad hit from Algolia
interface AdHit {
  objectID: string; // Corresponds to ad.id from Supabase
  title?: string;
  price?: number | null;
  image_urls?: string[] | null;
  created_at?: string; // Or created_at_timestamp if you prefer to format it
  is_topped?: boolean;
  // Add other fields you expect to display from Algolia
  [key: string]: any; // Index signature for other Algolia properties
}

const AdHitComponent = ({ hit }: { hit: AdHit }) => {
  return (
    <Link href={`/ads/${hit.objectID}`} className="group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 block">
      <div className="w-full h-52 bg-slate-200 flex items-center justify-center relative overflow-hidden">
        {hit.is_topped && (
          <div className="absolute top-2 right-2 bg-amber-400 text-amber-900 text-xs font-semibold px-2 py-1 rounded-full shadow-md z-10">
            TOP AD
          </div>
        )}
        {hit.image_urls && hit.image_urls.length > 0 ? (
          <img
            src={hit.image_urls[0]}
            alt={hit.title || 'Ad image'}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <svg className="w-16 h-16 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
        )}
      </div>
      <div className="p-5">
        <h2 className="text-lg font-semibold text-slate-800 mb-1 truncate group-hover:text-sky-600 transition-colors" title={hit.title}>
          {hit.title || 'Untitled Ad'}
        </h2>
        <p className="text-sky-600 font-bold text-xl mb-2">
          {hit.price ? `$${Number(hit.price).toFixed(2)}` : 'Free'}
        </p>
        {hit.created_at && (
          <p className="text-xs text-slate-500">
            Posted: {new Date(hit.created_at).toLocaleDateString()}
          </p>
        )}
      </div>
    </Link>
  );
};

const Hits = (props: UseHitsProps<AdHit>) => {
  const { hits, results, sendEvent } = useHits<AdHit>(props);

  if (!results || results.nbHits === 0) {
    return <p className="text-center text-slate-500 py-8">No results found for your search.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-8 py-8">
      {hits.map((hit) => (
        <AdHitComponent key={hit.objectID} hit={hit} />
      ))}
    </div>
  );
};

export default Hits;
