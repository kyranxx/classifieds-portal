'use client';

import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LogoutButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogout = async () => {
    setIsLoading(true);
    setError(null);
    const { error: logoutError } = await supabase.auth.signOut();
    setIsLoading(false);

    if (logoutError) {
      console.error('Error logging out:', logoutError);
      setError(logoutError.message);
    } else {
      router.push('/'); // Redirect to home/login page after logout
      router.refresh(); // Refresh the page to update server-side session
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isLoading}
      className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-sm disabled:opacity-50"
    >
      {isLoading ? 'Logging out...' : 'Logout'}
    </button>
  );
}
