import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const CLOUDFLARE_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
  const CLOUDFLARE_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;

  if (!CLOUDFLARE_ACCOUNT_ID || !CLOUDFLARE_API_TOKEN) {
    return NextResponse.json({ error: 'Cloudflare API credentials not set.' }, { status: 500 });
  }

  try {
    const formData = await request.formData();
    const imageFile = formData.get('image') as File;

    if (!imageFile) {
      return NextResponse.json({ error: 'No image file provided.' }, { status: 400 });
    }

    const uploadFormData = new FormData();
    uploadFormData.append('file', imageFile);

    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/images/v1`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`,
        },
        body: uploadFormData,
      }
    );

    const result = await response.json();

    if (!response.ok || !result.success) {
      console.error('Cloudflare upload error:', result);
      return NextResponse.json({ error: result.errors?.[0]?.message || 'Failed to upload image to Cloudflare.' }, { status: response.status });
    }

    return NextResponse.json({ url: result.result.variants[0] }); // Return the first variant URL
  } catch (error: any) {
    console.error('Server error during image upload:', error);
    return NextResponse.json({ error: error.message || 'Internal server error.' }, { status: 500 });
  }
}
