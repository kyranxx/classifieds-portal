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
      className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 ease-in-out block border border-slate-200 hover:border-sky-300"
    >
      {/* Image container with aspect ratio */}
      <div className="aspect-w-4 aspect-h-3 bg-slate-100 relative overflow-hidden"> {/* Common aspect ratio for product cards */}
        {ad.is_topped && (
          <div className="absolute top-2 right-2 bg-amber-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-md z-10"> {/* Adjusted TOP AD badge */}
            TOP
          </div>
        )}
        {ad.image_urls && ad.image_urls.length > 0 ? (
          <img
            src={ad.image_urls[0]}
            alt={displayTitle}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              const target = e.currentTarget as HTMLImageElement;
              target.style.display = 'none';
              // Optionally, show a placeholder if image fails
              const parent = target.parentElement;
              if (parent) {
                const placeholder = parent.querySelector('.image-placeholder-icon') as HTMLElement | null; // Cast here
                if (placeholder) placeholder.style.display = 'flex';
              }
            }}
          />
        ) : null} 
        {/* Fallback SVG Icon - always present but hidden if image loads */}
        {/* Simplified condition for fallback display */}
        {(!ad.image_urls || ad.image_urls.length === 0) ? (
          <div className="w-full h-full flex items-center justify-center image-placeholder-icon">
            <svg className="w-10 h-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
          </div>
        ) : null}
      </div>
      <div className="p-3 space-y-1"> {/* Reduced padding and added space-y */}
        <h2 
          className="text-sm font-semibold text-slate-800 truncate group-hover:text-sky-600 transition-colors" 
          title={displayTitle}
        >
          {displayTitle}
        </h2>
        <p className="text-sky-600 font-bold text-md"> {/* Adjusted price size */}
          {displayPrice}
        </p>
        <p className="text-xs text-slate-500">
          {displayDate}
        </p>
      </div>
    </Link>
  );
};

export default AdCard;
