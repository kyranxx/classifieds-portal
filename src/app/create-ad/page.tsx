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
    <div className="container mx-auto p-4 md:p-6 lg:p-8 max-w-3xl">
      <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-8 text-center">Post a New Ad</h1>
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 sm:p-8 md:p-10 shadow-lg rounded-xl border border-slate-200">
        {error && <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-lg border border-red-200" role="alert">{error}</div>}
        {successMessage && <div className="p-3 mb-4 text-sm text-green-700 bg-green-100 rounded-lg border border-green-200" role="alert">{successMessage}</div>}

        <div>
          <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-1.5">
            Ad Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="block w-full px-4 py-2.5 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
            required
            placeholder="e.g., Vintage Leather Sofa"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-1.5">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            className="block w-full px-4 py-2.5 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
            placeholder="Provide details about your item, condition, etc."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-slate-700 mb-1.5">
              Price (USD)
            </label>
            <input
              type="number"
              id="price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              step="0.01"
              min="0"
              className="block w-full px-4 py-2.5 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
              placeholder="Leave blank if free"
            />
          </div>
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-slate-700 mb-1.5">
              Category
            </label>
            <input
              type="text"
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="block w-full px-4 py-2.5 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
              placeholder="e.g., Furniture, Electronics"
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="lottieUrl" className="block text-sm font-medium text-slate-700 mb-1.5">
            Lottie Animation URL (Optional)
          </label>
          <input
            type="url"
            id="lottieUrl"
            value={lottieUrl}
            onChange={(e) => setLottieUrl(e.target.value)}
            className="block w-full px-4 py-2.5 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
            placeholder="https://example.com/animation.json"
          />
        </div>

        <div>
          <label htmlFor="images" className="block text-sm font-medium text-slate-700 mb-1.5">
            Upload Images (Select multiple)
          </label>
          <input
            type="file"
            id="images"
            multiple
            accept="image/*"
            onChange={(e) => setImages(e.target.files)}
            className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-sky-100 file:text-sky-700 hover:file:bg-sky-200 cursor-pointer border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500"
          />
          <p className="mt-1.5 text-xs text-slate-500">
            Images will be uploaded via Cloudflare. Max 5 images.
          </p>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:opacity-50 transition duration-150"
          >
            {isLoading ? 'Submitting Ad...' : 'Submit Ad'}
          </button>
        </div>
      </form>
    </div>
  );
}
