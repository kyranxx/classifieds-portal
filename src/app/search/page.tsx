'use client';

import { algoliasearch } from 'algoliasearch';
import { InstantSearch, Configure } from 'react-instantsearch'; // Updated import
import SearchBox from '@/components/AlgoliaSearchBox';
import Hits from '@/components/AlgoliaHits';
import Link from 'next/link';

const algoliaAppId = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID;
const algoliaSearchOnlyKey = process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_ONLY_KEY;
const algoliaIndexName = process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME;

if (!algoliaAppId || !algoliaSearchOnlyKey || !algoliaIndexName) {
  console.error('Algolia environment variables are not set. Search will not work.');
  // Optionally, render an error message or a disabled state for the search page
}

// Initialize the Algolia search client (search-only key for frontend)
const searchClient = algoliasearch(
  algoliaAppId || 'fallback-app-id', // Fallback to prevent crash if env var is missing
  algoliaSearchOnlyKey || 'fallback-search-key' // Fallback
);

export default function SearchPage() {
  if (!algoliaAppId || !algoliaSearchOnlyKey || !algoliaIndexName) {
    return (
      <div className="container mx-auto p-4 text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Search Configuration Error</h1>
        <p className="text-slate-600 mb-6">
          Algolia search is not properly configured. Please check the environment variables.
        </p>
        <Link href="/" className="text-sky-600 hover:text-sky-700 font-medium">
          &larr; Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <InstantSearch searchClient={searchClient} indexName={algoliaIndexName}>
        {/* Configure can be used to set search parameters like hitsPerPage, etc. */}
        <Configure hitsPerPage={12} />
        
        <div className="mb-8">
          <SearchBox />
        </div>
        
        <Hits />
      </InstantSearch>
    </div>
  );
}
