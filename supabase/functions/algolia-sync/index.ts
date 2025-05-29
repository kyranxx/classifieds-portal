import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import algoliasearch from 'npm:algoliasearch@5' // Deno can import npm modules

// IMPORTANT: These environment variables must be set in your Supabase project settings
// under Edge Functions > algolia-sync > Secrets.
// They should match what you have in your .env.local file.
const ALGOLIA_APP_ID = Deno.env.get('ALGOLIA_APP_ID')
const ALGOLIA_ADMIN_KEY = Deno.env.get('ALGOLIA_ADMIN_KEY')
const ALGOLIA_INDEX_NAME = Deno.env.get('ALGOLIA_INDEX_NAME')

if (!ALGOLIA_APP_ID || !ALGOLIA_ADMIN_KEY || !ALGOLIA_INDEX_NAME) {
  console.error('Missing Algolia environment variables for Edge Function. Please set them in Supabase project secrets.');
  // Optionally, throw an error or return a specific response if you want to halt execution
}

const client = algoliasearch(ALGOLIA_APP_ID!, ALGOLIA_ADMIN_KEY!)
const index = client.initIndex(ALGOLIA_INDEX_NAME!)

console.log('Algolia sync function initialized.');
console.log(`Using Algolia Index: ${ALGOLIA_INDEX_NAME}`);


serve(async (req: Request) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    })
  }

  try {
    const payload = await req.json()
    // console.log('Received webhook payload:', JSON.stringify(payload, null, 2)); // Log for debugging

    const { type, record, old_record } = payload

    if (!type || !(record || old_record)) {
      console.error('Invalid payload structure from Supabase webhook:', payload);
      return new Response(JSON.stringify({ error: 'Invalid payload structure' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
    }

    let objectID;

    if (type === 'INSERT' || type === 'UPDATE') {
      if (!record || !record.id) {
        console.error('Missing record or record.id for INSERT/UPDATE:', record);
        return new Response(JSON.stringify({ error: 'Missing record or record.id for INSERT/UPDATE' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        });
      }
      objectID = record.id;
      const algoliaRecord = {
        objectID: record.id,
        title: record.title,
        description: record.description,
        price: record.price,
        category: record.category,
        image_urls: record.image_urls,
        lottie_url: record.lottie_url,
        is_topped: record.is_topped,
        created_at: record.created_at,
        // Algolia can often parse ISO date strings, but a Unix timestamp is more robust for sorting/filtering
        created_at_timestamp: new Date(record.created_at).getTime() 
      };
      
      // console.log(`Attempting to save to Algolia:`, JSON.stringify(algoliaRecord, null, 2));
      await index.saveObject(algoliaRecord);
      console.log(`Record ${objectID} ${type === 'INSERT' ? 'inserted' : 'updated'} in Algolia.`);

    } else if (type === 'DELETE') {
      if (!old_record || !old_record.id) {
         console.error('Missing old_record or old_record.id for DELETE:', old_record);
        return new Response(JSON.stringify({ error: 'Missing old_record or old_record.id for DELETE' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        });
      }
      objectID = old_record.id;
      // console.log(`Attempting to delete from Algolia, objectID: ${objectID}`);
      await index.deleteObject(objectID);
      console.log(`Record ${objectID} deleted from Algolia.`);

    } else {
      console.log(`Unhandled Supabase webhook event type: ${type}`);
      return new Response(JSON.stringify({ message: `Unhandled event type: ${type}` }), {
        status: 200, // Acknowledge receipt even if unhandled, or 400 if it's an error
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
    }

    return new Response(JSON.stringify({ success: true, type, id: objectID }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    })
  } catch (e: any) { // Explicitly type the caught error
    console.error('Error processing Supabase webhook:', e.message, e.stack);
    return new Response(JSON.stringify({ error: e.message || 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    })
  }
})
