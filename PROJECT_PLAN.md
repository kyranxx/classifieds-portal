# Classified Ads Portal - Project Plan

**Overall Project Goal:** Build a classified ads portal.

**Phase 1: Foundation & Core Ad Features (Completed)**
*   Project setup (Next.js 14, pnpm).
*   Supabase project and environment variables configured.
*   `ads` table created in Supabase with basic schema, RLS, and topping trigger.
*   Supabase client utility (`src/lib/supabase.ts`) created.
*   Basic authentication form (`AuthForm.tsx`) implemented.
*   Tailwind CSS styling issues resolved (downgraded to v3).
*   Ad Listing Page (`src/app/ads/page.tsx`) created.
*   Individual Ad Page (`src/app/ads/[id]/page.tsx`) created (Lottie, images).
*   Ad Creation Page & Form (`src/app/create-ad/page.tsx`) created (Lottie URL, Cloudflare image upload).
*   Cloudflare Images API route (`src/app/api/upload-image/route.ts`) created.
*   All initial changes committed to GitHub.

**Phase 2: User Accounts & "Topping" Ads (Completed)**
*   User Profile Page (`src/app/profile/page.tsx`) created and displays user's ads.
*   Logout button (`src/components/LogoutButton.tsx`) created and integrated.
*   Server-side Supabase client (`src/lib/supabase/server.ts`) for auth in layout.
*   Stripe packages installed (`@stripe/stripe-js`, `stripe`, `@stripe/react-stripe-js`).
*   Stripe API keys and Price ID added to `.env.local`.
*   Stripe Payment Form component (`src/components/StripePaymentForm.tsx`) created.
*   API route for creating Stripe Payment Intents (`src/app/api/create-payment-intent/route.ts`) created.
*   Stripe Payment Form integrated into Individual Ad Page.
*   Stripe Webhook API route (`src/app/api/stripe-webhook/route.ts`) created to handle payment success.
*   `ngrok` setup for local webhook testing.
*   Stripe Webhook Signing Secret added to `.env.local`.
*   Ad listing page updated to show topped ads first.
*   All Phase 2 changes committed to GitHub.

**Phase 3: Styling, Search, Deployment & Distinguishing Features (Current Phase)**
*   **Advanced UI/UX & Styling (Partially Completed):**
    *   Initial refinements to global styles, navigation, Ad Listing, Ad Detail, Ad Creation, and Profile pages.
    *   **Remaining:** Further refinement of overall design, color palette, typography, mobile responsiveness, and strategic Lottie animation use.
*   **Search Functionality (Algolia) (Next Up):**
    *   **User Task:** Create a new Algolia application and index for "Bazzoo Classifieds". Obtain Application ID, Search-Only API Key, Admin API Key, and Index Name.
    *   Install Algolia client libraries.
    *   Add Algolia credentials to `.env.local`.
    *   Implement Supabase Edge Function or server-side logic to sync ad data (creations, updates, deletions) to the Algolia index.
    *   Create a search bar component.
    *   Implement a search results page or integrate search results display.
    *   (Optional) Add filtering and sorting to search results.
*   **Email Notifications (Resend):**
    *   Set up a Resend account and configure domain/API keys.
    *   Create an API route for email sending.
    *   Implement email notifications (user registration, ad confirmation, payment confirmation).
*   **Deployment & Optimization (Vercel/Cloudflare):**
    *   Set up Vercel project, connect to GitHub.
    *   Configure environment variables on Vercel.
    *   Deploy application.
    *   Set up custom domain, SSL.
    *   Update Stripe webhook URL to production.
    *   Performance optimization.
*   **Distinguishing Features (To be defined and integrated):**
    *   Brainstorm and select 5 unique features.
    *   Plan and implement each selected feature.
