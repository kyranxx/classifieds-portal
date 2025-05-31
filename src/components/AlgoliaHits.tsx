'use client';

import { useHits, UseHitsProps } from 'react-instantsearch';
import AdCard, { Ad as AdCardType } from './AdCard'; // Import the new AdCard and its type

// Define the structure of an ad hit from Algolia, ensuring it's compatible with AdCardType
interface AlgoliaAdHit {
  objectID: string;
  id?: string; // Supabase ID might also be indexed
  title?: string | null;
  price?: number | string | null;
  image_urls?: string[] | null;
  created_at?: string | number | null; // Algolia might store timestamp as number
  is_topped?: boolean | null;
  // Add other fields you expect to display from Algolia
  [key: string]: any; // Index signature for other Algolia properties
}

// Helper function to adapt Algolia hit to AdCardType
const adaptAlgoliaHitToAdCard = (hit: AlgoliaAdHit): AdCardType => {
  return {
    id: hit.id || hit.objectID, // Prefer Supabase id if present, else Algolia objectID
    objectID: hit.objectID,
    title: hit.title,
    price: hit.price,
    image_urls: hit.image_urls,
    // Algolia might store created_at as a Unix timestamp (number) or ISO string
    created_at: hit.created_at ? (typeof hit.created_at === 'number' ? new Date(hit.created_at * 1000).toISOString() : hit.created_at) : null,
    is_topped: hit.is_topped,
  };
};

const Hits = (props: UseHitsProps<AlgoliaAdHit>) => {
  const { hits, results } = useHits<AlgoliaAdHit>(props);

  if (!results || results.nbHits === 0) {
    return (
      <div className="text-center py-16">
        <svg className="mx-auto h-16 w-16 text-slate-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
        <h3 className="mt-2 text-xl font-semibold text-slate-700">No results found</h3>
        <p className="mt-1 text-md text-slate-500">Try adjusting your search terms or filters.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 py-8">
      {hits.map((hit) => (
        <AdCard key={hit.objectID} ad={adaptAlgoliaHitToAdCard(hit)} />
      ))}
    </div>
  );
};

export default Hits;
