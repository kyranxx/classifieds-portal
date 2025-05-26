'use client'; // Required for Lottie component if it uses client-side features

import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import Lottie from "lottie-react";
import { useEffect, useState } from 'react';
import StripePaymentForm from '@/components/StripePaymentForm'; // Import the payment form

export const revalidate = 0; // Revalidate data on every request

async function getAdById(id: string) {
  const { data: ad, error } = await supabase
    .from('ads')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error(`Error fetching ad ${id}:`, error);
    return null;
  }
  return ad;
}

interface AdPageProps {
  params: {
    id: string;
  };
}

export default function AdPage({ params }: AdPageProps) {
  const [ad, setAd] = useState<any>(null); // Define a more specific type later
  const [lottieData, setLottieData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAdAndLottie() {
      setIsLoading(true);
      setError(null);
      const fetchedAd = await getAdById(params.id);
      setAd(fetchedAd);

      if (fetchedAd && fetchedAd.lottie_url) {
        try {
          const response = await fetch(fetchedAd.lottie_url);
          if (!response.ok) {
            throw new Error(`Failed to fetch Lottie JSON: ${response.statusText}`);
          }
          const jsonData = await response.json();
          setLottieData(jsonData);
        } catch (e: any) {
          console.error("Error fetching Lottie data:", e);
          setError(`Could not load Lottie animation: ${e.message}`);
          setLottieData(null); // Ensure no broken Lottie tries to render
        }
      }
      setIsLoading(false);
    }

    fetchAdAndLottie();
  }, [params.id]);

  const handlePaymentSuccess = () => {
    console.log('Ad topped successfully! Refreshing ad data...');
    window.location.reload(); 
  };

  if (isLoading) {
    return <div className="container mx-auto p-4 text-center">Loading ad details...</div>;
  }

  if (!ad) {
    return (
      <div className="container mx-auto p-4 text-center">
        <h1 className="text-2xl font-bold mb-4">{error || 'Ad not found'}</h1>
        <Link href="/ads" className="text-blue-500 hover:underline">
          Back to all ads
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white shadow-xl rounded-lg overflow-hidden">
        <div className="w-full bg-gray-200 flex flex-col items-center justify-center">
          {ad.lottie_url && lottieData ? (
            <div className="w-full h-96 flex items-center justify-center">
              <Lottie animationData={lottieData} loop={true} style={{ width: 300, height: 300 }} />
            </div>
          ) : ad.lottie_url && error ? (
            <div className="w-full h-96 flex items-center justify-center text-red-500 p-4 text-center">
              <p>Error loading Lottie animation:<br />{error}</p>
            </div>
          ) : ad.image_urls && ad.image_urls.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-2 w-full">
              {ad.image_urls.map((url: string, index: number) => (
                <img
                  key={index}
                  src={url}
                  alt={`${ad.title} image ${index + 1}`}
                  className="w-full h-48 object-cover rounded-md"
                />
              ))}
            </div>
          ) : (
            <div className="w-full h-96 flex items-center justify-center">
              <span className="text-gray-500">No Image</span>
            </div>
          )}
        </div>
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-4">{ad.title}</h1>
          <p className="text-gray-800 font-bold text-2xl mb-4">
            {ad.price ? `$${Number(ad.price).toFixed(2)}` : 'Free'}
          </p>
          {ad.category && (
            <p className="text-sm text-gray-600 mb-2">
              <span className="font-semibold">Category:</span> {ad.category}
            </p>
          )}
          <p className="text-gray-700 mb-4 whitespace-pre-wrap">
            {ad.description || 'No description provided.'}
          </p>
          <p className="text-xs text-gray-500">
            Ad ID: {ad.id}
          </p>
          <p className="text-sm text-gray-500">
            Posted on: {new Date(ad.created_at).toLocaleString()}
          </p>
          {ad.is_topped && ad.topped_expires_at && (
            <p className="text-sm text-green-600 font-semibold mt-2">
              This ad is currently topped! Expires on: {new Date(ad.topped_expires_at).toLocaleString()}
            </p>
          )}

          {/* Stripe Payment Form */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-xl font-semibold mb-4">Top this Ad!</h3>
            <StripePaymentForm
              adId={ad.id}
              priceId={process.env.NEXT_PUBLIC_STRIPE_PRICE_ID!}
              onPaymentSuccess={handlePaymentSuccess}
            />
          </div>
        </div>
      </div>
      <div className="mt-8 text-center">
        <Link href="/ads" className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
          Back to All Ads
        </Link>
      </div>
    </div>
  );
}
