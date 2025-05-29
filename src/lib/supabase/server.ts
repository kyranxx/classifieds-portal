import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import 'server-only';

export function createClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookies().get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookies().set({ name, value, ...options });
          } catch (error) {
            // The `cookies().set()` method can only be called from a Server Component or Server Action
            // This error is typically ignored if you're using Next.js with Supabase Auth UI.
            // console.warn('Could not set cookie from server component:', error);
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookies().set({ name, value: '', ...options });
          } catch (error) {
            // The `cookies().set()` method can only be called from a Server Component or Server Action
            // This error is typically ignored if you're using Next.js with Supabase Auth UI.
            // console.warn('Could not remove cookie from server component:', error);
          }
        },
      },
    }
  );
}
