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
    return <div className="container mx-auto p-4 text-center text-slate-600">Loading ad details...</div>;
  }

  if (!ad) {
    return (
      <div className="container mx-auto p-4 text-center">
        <h1 className="text-2xl font-bold mb-4 text-red-600">{error || 'Ad not found'}</h1>
        <Link href="/ads" className="text-sky-600 hover:text-sky-700 font-medium">
          &larr; Back to all ads
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white shadow-xl rounded-lg overflow-hidden md:flex">
        {/* Image/Lottie Column */}
        <div className="md:w-1/2 w-full bg-slate-100 p-4 flex flex-col items-center justify-center min-h-[300px] md:min-h-full">
          {ad.lottie_url && lottieData ? (
            <div className="w-full max-w-md h-auto flex items-center justify-center">
              <Lottie animationData={lottieData} loop={true} style={{ width: '100%', height: 'auto', maxWidth: 400 }} />
            </div>
          ) : ad.lottie_url && error ? (
            <div className="w-full text-red-500 p-4 text-center">
              <p>Error loading Lottie animation:<br />{error}</p>
            </div>
          ) : ad.image_urls && ad.image_urls.length > 0 ? (
            <div className="w-full grid grid-cols-1 gap-2">
              {ad.image_urls.map((url: string, index: number) => (
                <img
                  key={index}
                  src={url}
                  alt={`${ad.title} image ${index + 1}`}
                  className="w-full h-auto object-contain rounded-md max-h-96"
                />
              ))}
            </div>
          ) : (
            <div className="w-full h-64 flex items-center justify-center">
               <svg className="w-24 h-24 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
            </div>
          )}
        </div>

        {/* Details Column */}
        <div className="md:w-1/2 w-full p-6 md:p-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-3">{ad.title}</h1>
          <p className="text-sky-600 font-bold text-3xl mb-5">
            {ad.price ? `$${Number(ad.price).toFixed(2)}` : 'Free'}
          </p>
          
          {ad.is_topped && ad.topped_expires_at && (
            <div className="mb-4 p-3 bg-amber-100 border-l-4 border-amber-500 rounded-md">
              <p className="text-sm text-amber-700 font-semibold">
                This ad is currently topped!
              </p>
              <p className="text-xs text-amber-600">
                Expires on: {new Date(ad.topped_expires_at).toLocaleString()}
              </p>
            </div>
          )}

          {ad.category && (
            <p className="text-sm text-slate-600 mb-1">
              <span className="font-semibold text-slate-700">Category:</span> {ad.category}
            </p>
          )}
          <p className="text-sm text-slate-500 mb-4">
            Posted on: {new Date(ad.created_at).toLocaleString()}
          </p>
          
          <h2 className="text-xl font-semibold text-slate-700 mt-6 mb-2">Description</h2>
          <p className="text-slate-600 mb-6 whitespace-pre-wrap leading-relaxed">
            {ad.description || 'No description provided.'}
          </p>
          
          <p className="text-xs text-slate-400 mb-6">
            Ad ID: {ad.id}
          </p>

          {/* Stripe Payment Form */}
          {!ad.is_topped && (
            <div className="mt-6 pt-6 border-t border-slate-200">
              <h3 className="text-xl font-semibold text-slate-700 mb-4">Top this Ad for 7 days!</h3>
              <StripePaymentForm
                adId={ad.id}
                priceId={process.env.NEXT_PUBLIC_STRIPE_PRICE_ID!}
                onPaymentSuccess={handlePaymentSuccess}
              />
            </div>
          )}
        </div>
      </div>

      <div className="mt-10 text-center">
        <Link href="/ads" className="text-sky-600 hover:text-sky-700 font-medium py-2 px-4 rounded-md border border-sky-600 hover:bg-sky-50 transition">
          &larr; Back to All Ads
        </Link>
      </div>
    </div>
  );
}
