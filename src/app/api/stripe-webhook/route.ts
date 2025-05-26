import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { buffer } from 'micro';
import { supabase } from '@/lib/supabase';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-04-30.basil',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  const rawBody = await buffer(req);
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      req.headers.get('stripe-signature') as string,
      webhookSecret
    );
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntentSucceeded = event.data.object as Stripe.PaymentIntent;
      const adId = paymentIntentSucceeded.metadata?.adId;
      const priceId = paymentIntentSucceeded.metadata?.priceId;

      if (adId && priceId) {
        // Calculate topped_expires_at (e.g., 7 days from now)
        const toppedExpiresAt = new Date();
        toppedExpiresAt.setDate(toppedExpiresAt.getDate() + 7); // Ad topped for 7 days

        const { error } = await supabase
          .from('ads')
          .update({
            is_topped: true,
            topped_expires_at: toppedExpiresAt.toISOString(),
          })
          .eq('id', adId);

        if (error) {
          console.error('Error updating ad after payment:', error);
          return NextResponse.json({ error: 'Failed to update ad status.' }, { status: 500 });
        }
        console.log(`Ad ${adId} topped successfully!`);
      }
      break;
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return NextResponse.json({ received: true }, { status: 200 });
}
