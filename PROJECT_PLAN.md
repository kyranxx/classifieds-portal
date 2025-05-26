# Classified Ads Portal - Project Plan

**Overall Project Goal:** Build a classified ads portal.

**Phase 1: Foundation & Core Ad Features (Completed)**

*   **Completed So Far:**
    *   Project setup (Next.js 14, pnpm).
    *   Supabase project and environment variables configured.
    *   `ads` table created in Supabase with basic schema, Row Level Security (RLS), and a trigger for `topped_expires_at`.
    *   Supabase client utility (`src/lib/supabase.ts`) created.
    *   Basic authentication form (`AuthForm.tsx`) implemented and integrated into `src/app/page.tsx`.
    *   Tailwind CSS styling issues resolved (downgraded to v3).
    *   Ad Listing Page (`src/app/ads/page.tsx`) created and displays ads.
    *   Individual Ad Page (`src/app/ads/[id]/page.tsx`) created, displays ad details, and integrates Lottie animations.
    *   Ad Creation Page & Form (`src/app/create-ad/page.tsx`) created with Lottie URL and image file inputs.
    *   Cloudflare Images API route (`src/app/api/upload-image/route.ts`) created and integrated into ad creation form.
    *   User Profile Page (`src/app/profile/page.tsx`) created and displays user's ads.
    *   Logout button (`src/components/LogoutButton.tsx`) created and integrated into navigation.
    *   Server-side Supabase client (`src/lib/supabase/server.ts`) created.
    *   All changes committed and pushed to GitHub.

*   **Remaining Tasks for Phase 1:** (None - Phase 1 is complete)

**Phase 2: User Accounts & "Topping" Ads (Current Phase)**

*   **Completed So Far:**
    *   User Profile Page.

*   **Remaining Tasks for Phase 2:**
    1.  **"Topping" Feature (Stripe Integration):**
        *   **Stripe Project Setup (User Task):**
            *   Create a new Stripe project/application.
            *   Obtain Publishable and Secret API keys.
            *   Set up a webhook for payment events (recommended for production).
            *   Create a product and price for "topping" an ad.
        *   Install Stripe packages (`@stripe/stripe-js`, `stripe`).
        *   Implement client-side payment form using Stripe Elements.
        *   Create a Next.js API route for creating Stripe Payment Intents.
        *   Handle Stripe webhook events to update `is_topped` and `topped_expires_at` in the `ads` table.
        *   Modify the ad listing to show topped ads first.

**Phase 3: Styling, Search & Deployment**

*   **Advanced UI/UX & Styling:**
    *   Refine the overall design to be "beautifully but minimalistic," responsive, and mobile-first.
    *   Implement appealing color schemes.
*   **Search Functionality (Algolia):**
    *   Set up Algolia and sync Supabase `ads` data.
    *   Implement a search bar and search results page.
*   **Email Notifications (Resend):**
    *   Integrate Resend for email notifications (e.g., ad confirmation).
*   **Deployment & Optimization (Vercel/Cloudflare):**
    *   Deploy to Vercel (will provide CDN for the entire page).
    *   Configure custom domain, SSL.
    *   Optimize for performance.

**Distinguishing Features (To be integrated throughout):**
The 5 distinguishing features will be presented once core functionality is in place. We can then decide which ones to prioritize and how to integrate them.
