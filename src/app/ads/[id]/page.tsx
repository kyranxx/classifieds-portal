'use client'; // Required for Lottie component if it uses client-side features

import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import Image from 'next/image';
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
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <div className="bg-white shadow-lg rounded-xl overflow-hidden md:flex border border-slate-200">
        {/* Image/Lottie Column */}
        <div className="md:w-1/2 w-full bg-slate-50 p-4 sm:p-6 flex flex-col items-center justify-center min-h-[300px] md:min-h-full md:max-h-[70vh] overflow-y-auto">
          {ad.lottie_url && lottieData ? (
            <div className="w-full max-w-lg h-auto flex items-center justify-center">
              <Lottie animationData={lottieData} loop={true} style={{ width: '100%', height: 'auto', maxWidth: 450 }} />
            </div>
          ) : ad.lottie_url && error ? (
            <div className="w-full text-red-600 p-4 text-center bg-red-50 rounded-md">
              <p className="font-medium">Error loading Lottie animation:</p>
              <p className="text-sm">{error}</p>
            </div>
          ) : ad.image_urls && ad.image_urls.length > 0 ? (
            <div className="w-full space-y-3">
              {ad.image_urls.map((url: string, index: number) => (
                <Image
                  key={index}
                  src={url}
                  alt={`${ad.title || 'Ad'} image ${index + 1}`}
                  width={800}
                  height={600}
                  className="w-full h-auto object-contain rounded-lg shadow-sm border border-slate-200 max-h-[500px]"
                />
              ))}
            </div>
          ) : (
            <div className="w-full h-64 flex flex-col items-center justify-center text-slate-400">
               <svg className="w-20 h-20 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
               <p className="text-sm">No image provided</p>
            </div>
          )}
        </div>

        {/* Details Column */}
        <div className="md:w-1/2 w-full p-6 sm:p-8 space-y-4">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800">{ad.title || 'Untitled Ad'}</h1>
          
          <div className="flex items-baseline gap-3">
            <p className="text-sky-600 font-bold text-2xl md:text-3xl">
              {ad.price ? `$${Number(ad.price).toFixed(2)}` : 'Free'}
            </p>
            {ad.is_topped && (
              <span className="bg-amber-400 text-amber-900 text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm">
                TOP AD
              </span>
            )}
          </div>
          
          {ad.is_topped && ad.topped_expires_at && (
            <div className="text-xs text-amber-600 bg-amber-50 p-2 rounded-md border border-amber-200">
              Top ad status expires on: {new Date(ad.topped_expires_at).toLocaleString()}
            </div>
          )}

          <div className="text-sm text-slate-600 space-y-1">
            {ad.category && (
              <p><span className="font-semibold text-slate-700">Category:</span> {ad.category}</p>
            )}
            <p><span className="font-semibold text-slate-700">Posted:</span> {new Date(ad.created_at).toLocaleString()}</p>
          </div>
          
          <div>
            <h2 className="text-lg font-semibold text-slate-700 mb-1.5">Description</h2>
            <p className="text-slate-600 whitespace-pre-wrap leading-relaxed text-sm">
              {ad.description || 'No description provided.'}
            </p>
          </div>
          
          <p className="text-xs text-slate-400 pt-2">
            Ad ID: {ad.id}
          </p>

          {/* Stripe Payment Form */}
          {!ad.is_topped && (
            <div className="mt-6 pt-6 border-t border-slate-200">
              <h3 className="text-lg font-semibold text-slate-700 mb-3">Top this Ad for 7 days!</h3>
              <StripePaymentForm
                adId={ad.id}
                priceId={process.env.NEXT_PUBLIC_STRIPE_PRICE_ID!}
                onPaymentSuccess={handlePaymentSuccess}
              />
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 text-center">
        <Link href="/ads" className="inline-flex items-center text-sky-600 hover:text-sky-700 font-medium py-2 px-4 rounded-md border border-sky-600 hover:bg-sky-50 transition text-sm">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Back to All Ads
        </Link>
      </div>
    </div>
  );
}
