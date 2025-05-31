import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-05-28.basil', // Use the API version suggested by the error
});

export async function POST(req: Request) {
  try {
    const { adId, priceId } = await req.json();

    if (!adId || !priceId) {
      return NextResponse.json({ error: 'Missing adId or priceId' }, { status: 400 });
    }

    // Retrieve the price object to get the amount
    const price = await stripe.prices.retrieve(priceId);

    if (!price || !price.unit_amount) {
      return NextResponse.json({ error: 'Invalid priceId or price not found' }, { status: 400 });
    }

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: price.unit_amount, // Amount in cents
      currency: price.currency,
      metadata: { adId: adId, priceId: priceId }, // Store adId and priceId for webhook
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (error: any) {
    console.error('Error creating PaymentIntent:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
