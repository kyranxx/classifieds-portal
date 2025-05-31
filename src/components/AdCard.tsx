'use client';

import Link from 'next/link';

// Define the structure of an ad, accommodating fields from both Supabase and Algolia
export interface Ad {
  id: string; // Supabase ID
  objectID?: string; // Algolia objectID (optional, if data comes from Algolia)
  title?: string | null;
  price?: number | string | null; // Can be number or string like "Contact for price"
  image_urls?: string[] | null;
  created_at?: string | Date | null; // Can be string or Date object
  is_topped?: boolean | null;
  // Add any other common fields you expect
}

interface AdCardProps {
  ad: Ad;
}

const AdCard = ({ ad }: AdCardProps) => {
  const displayId = ad.objectID || ad.id; // Use Algolia's objectID if present, else Supabase id
  const displayTitle = ad.title || 'Untitled Ad';
  
  let displayPrice: string;
  if (ad.price === null || ad.price === undefined || ad.price === '') {
    displayPrice = 'Free';
  } else if (typeof ad.price === 'number') {
    displayPrice = `$${ad.price.toFixed(2)}`;
  } else {
    // If it's a string but not empty (e.g., "Contact for price")
    displayPrice = String(ad.price); 
  }

  const displayDate = ad.created_at 
    ? new Date(ad.created_at).toLocaleDateString() 
    : 'N/A';

  return (
    <Link 
      href={`/ads/${displayId}`} 
      className="group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 block border border-slate-200"
    >
      <div className="w-full h-48 bg-slate-100 flex items-center justify-center relative overflow-hidden">
        {ad.is_topped && (
          <div className="absolute top-2 right-2 bg-amber-400 text-amber-900 text-xs font-semibold px-2.5 py-1 rounded-full shadow z-10">
            TOP AD
          </div>
        )}
        {ad.image_urls && ad.image_urls.length > 0 ? (
          <img
            src={ad.image_urls[0]}
            alt={displayTitle}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => (e.currentTarget.style.display = 'none')} // Hide if image fails to load
          />
        ) : (
          <svg className="w-12 h-12 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
          </svg>
        )}
      </div>
      <div className="p-4">
        <h2 
          className="text-md font-semibold text-slate-700 mb-1 truncate group-hover:text-sky-600 transition-colors" 
          title={displayTitle}
        >
          {displayTitle}
        </h2>
        <p className="text-sky-600 font-bold text-lg mb-2">
          {displayPrice}
        </p>
        <p className="text-xs text-slate-500">
          Posted: {displayDate}
        </p>
      </div>
    </Link>
  );
};

export default AdCard;
