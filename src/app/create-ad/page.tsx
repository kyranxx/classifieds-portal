'use client'; // This will be a client component to handle form interactions

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function CreateAdPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [lottieUrl, setLottieUrl] = useState('');
  const [images, setImages] = useState<FileList | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    // Basic validation
    if (!title.trim()) {
      setError('Title is required.');
      setIsLoading(false);
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      setError('You must be logged in to post an ad.');
      setIsLoading(false);
      // Optionally redirect to login page
      // router.push('/'); 
      return;
    }

    const adData = {
      user_id: user.id,
      title,
      description,
      price: price ? parseFloat(price) : null,
      category,
      lottie_url: lottieUrl || null,
      image_urls: [] as string[], // Explicitly type as string[]
    };

    const uploadedImageUrls: string[] = [];
    if (images && images.length > 0) {
      for (let i = 0; i < images.length; i++) {
        const file = images[i];
        const uploadFormData = new FormData();
        uploadFormData.append('image', file);

        try {
          const uploadResponse = await fetch('/api/upload-image', {
            method: 'POST',
            body: uploadFormData,
          });

          const uploadResult = await uploadResponse.json();

          if (!uploadResponse.ok || uploadResult.error) {
            throw new Error(uploadResult.error || 'Failed to upload image.');
          }
          uploadedImageUrls.push(uploadResult.url);
        } catch (uploadError: any) {
          console.error('Error uploading image:', uploadError);
          setError(`Failed to upload image: ${uploadError.message}`);
          setIsLoading(false);
          return; // Stop if any image upload fails
        }
      }
      adData.image_urls = uploadedImageUrls;
    }

    const { error: insertError } = await supabase.from('ads').insert(adData);

    setIsLoading(false);

    if (insertError) {
      console.error('Error inserting ad:', insertError);
      setError(`Failed to post ad: ${insertError.message}`);
    } else {
      setSuccessMessage('Ad posted successfully! Redirecting...');
      setTitle('');
      setDescription('');
      setPrice('');
      setCategory('');
      setLottieUrl('');
      setImages(null);
      if (document.getElementById('images')) { // Reset file input
        (document.getElementById('images') as HTMLInputElement).value = '';
      }
      setTimeout(() => {
        router.push('/ads'); // Redirect to ads listing page
      }, 2000);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6 text-center">Post a New Ad</h1>
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 shadow-lg rounded-lg">
        {error && <p className="text-red-500 bg-red-100 p-3 rounded-md">{error}</p>}
        {successMessage && <p className="text-green-500 bg-green-100 p-3 rounded-md">{successMessage}</p>}

        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
            Price (USD) - leave blank if free
          </label>
          <input
            type="number"
            id="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            step="0.01"
            min="0"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <input
            type="text"
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        
        <div>
          <label htmlFor="lottieUrl" className="block text-sm font-medium text-gray-700 mb-1">
            Lottie Animation URL (optional)
          </label>
          <input
            type="url"
            id="lottieUrl"
            value={lottieUrl}
            onChange={(e) => setLottieUrl(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="https://example.com/animation.json"
          />
        </div>

        <div>
          <label htmlFor="images" className="block text-sm font-medium text-gray-700 mb-1">
            Images (select multiple)
          </label>
          <input
            type="file"
            id="images"
            multiple
            accept="image/*"
            onChange={(e) => setImages(e.target.files)}
            className="mt-1 block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-l-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
          />
          <p className="mt-1 text-xs text-gray-500">
            Image upload will be handled by Cloudflare Images (integration pending).
          </p>
        </div>

        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {isLoading ? 'Posting Ad...' : 'Post Ad'}
          </button>
        </div>
      </form>
    </div>
  );
}
