# Classified Ads Portal - Project Plan

**Overall Project Goal:** Build a classified ads portal.

**Phase 1: Foundation & Core Ad Features (Current Phase)**

*   **Completed So Far:**
    *   Project setup (Next.js 14, pnpm).
    *   Supabase project and environment variables configured.
    *   `ads` table created in Supabase with basic schema, Row Level Security (RLS), and a trigger for `topped_expires_at`.
    *   Supabase client utility (`src/lib/supabase.ts`) created.
    *   Basic authentication form (`AuthForm.tsx`) implemented and integrated into `src/app/page.tsx`.
    *   Tailwind CSS styling issues resolved (downgraded to v3).
    *   All changes committed and pushed to GitHub.

*   **Remaining Tasks for Phase 1:**
    1.  **Ad Listing Page:**
        *   Create a new page (e.g., `src/app/ads/page.tsx`).
        *   Fetch and display all ads from Supabase.
        *   Implement basic styling for ad cards (title, price, image placeholder).
    2.  **Individual Ad Page:**
        *   Create a dynamic route (e.g., `src/app/ads/[id]/page.tsx`).
        *   Fetch and display details for a single ad by its ID.
        *   Include Lottie animation display if a URL is provided.
    3.  **Ad Creation Page & Form:**
        *   Create a new page (e.g., `src/app/create-ad/page.tsx`), accessible only to logged-in users.
        *   Build a form for users to input ad details (title, description, price, category, image URLs, Lottie URL).
        *   Implement logic to save new ads to the Supabase `ads` table.
    4.  **Image Handling (Cloudflare Images - Initial Setup):**
        *   Set up a Cloudflare Images account.
        *   Implement basic image upload functionality in the ad creation form.
        *   Store image URLs (from Cloudflare) in the `ads` table.
    5.  **Lottie Animations Integration:**
        *   Integrate a Lottie player component (e.g., `lottie-react`).
        *   Allow users to input a Lottie animation URL when creating an ad.
        *   Display Lottie animations on ad listing and individual ad pages.

**Phase 2: User Accounts & "Topping" Ads**

*   **User Profile Page:**
    *   Allow users to view and manage their own ads (edit/delete).
*   **"Topping" Feature (Stripe Integration):**
    *   Set up a Stripe account.
    *   Integrate Stripe for payments to "top" an ad.
    *   Update `is_topped` and `topped_expires_at` in the `ads` table after successful payment.
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
    *   Deploy to Vercel.
    *   Configure custom domain, SSL.
    *   Optimize for performance.

**Distinguishing Features (To be integrated throughout):**
The 5 distinguishing features will be presented once core functionality is in place. We can then decide which ones to prioritize and how to integrate them.
