import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const slug = url.searchParams.get('slug');

    if (!slug) {
      return new Response(
        JSON.stringify({ error: 'Slug parameter required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: post, error } = await supabase
      .from('posts')
      .select('title, excerpt, featured_image, published_at, slug')
      .eq('slug', slug)
      .eq('status', 'published')
      .single();

    if (error || !post) {
      return new Response(
        JSON.stringify({ error: 'Post not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const siteUrl = 'https://sabadvance.it';
    const postUrl = `${siteUrl}/blog/${post.slug}`;
    const ogImage = post.featured_image || `${siteUrl}/lovable-uploads/9afc0cc7-085e-45e9-8a5d-eaccf88663b6.png`;
    const description = post.excerpt || `${post.title} - Leggi l'articolo completo su Sabadvance`;

    // Escape HTML entities to prevent XSS
    const escapeHtml = (str: string) => str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');

    const safeTitle = escapeHtml(post.title);
    const safeDescription = escapeHtml(description);

    const html = `<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${safeTitle} | Sabadvance</title>
  <meta name="description" content="${safeDescription}">
  
  <!-- Open Graph -->
  <meta property="og:title" content="${safeTitle} | Sabadvance">
  <meta property="og:description" content="${safeDescription}">
  <meta property="og:type" content="article">
  <meta property="og:url" content="${postUrl}">
  <meta property="og:image" content="${ogImage}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:site_name" content="Sabadvance">
  <meta property="og:locale" content="it_IT">
  <meta property="article:published_time" content="${post.published_at}">
  
  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${safeTitle} | Sabadvance">
  <meta name="twitter:description" content="${safeDescription}">
  <meta name="twitter:image" content="${ogImage}">
  <meta name="twitter:site" content="@sabadvance">
  
  <link rel="canonical" href="${postUrl}">
  
  <!-- Redirect to actual page -->
  <meta http-equiv="refresh" content="0;url=${postUrl}">
  <script>window.location.replace("${postUrl}");</script>
</head>
<body style="font-family: sans-serif; text-align: center; padding: 50px;">
  <p>Reindirizzamento in corso...</p>
  <p><a href="${postUrl}">Clicca qui se non vieni reindirizzato automaticamente</a></p>
</body>
</html>`;

    // IMPORTANT: Explicitly encode as bytes and set Content-Type to ensure proper rendering
    // Some clients (and crawlers) will ignore OG tags if served as text/plain or with wrong encoding
    const htmlBytes = new TextEncoder().encode(html);
    
    return new Response(htmlBytes, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});