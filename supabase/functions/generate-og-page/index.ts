import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { slug } = await req.json();

    if (!slug) {
      return new Response(
        JSON.stringify({ error: 'Slug parameter required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch the post
    const { data: post, error } = await supabase
      .from('posts')
      .select('title, excerpt, featured_image, published_at, slug')
      .eq('slug', slug)
      .eq('status', 'published')
      .single();

    if (error || !post) {
      console.error('Post not found:', slug, error);
      return new Response(
        JSON.stringify({ error: 'Post not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const siteUrl = 'https://sabadvance.it';
    const postUrl = `${siteUrl}/blog/${post.slug}`;
    const ogImage = post.featured_image || `${siteUrl}/lovable-uploads/9afc0cc7-085e-45e9-8a5d-eaccf88663b6.png`;
    const description = post.excerpt || `${post.title} - Leggi l'articolo completo su Sabadvance`;

    // Escape HTML entities
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
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; text-align: center; padding: 50px; background: #f5f5f5;">
  <div style="max-width: 500px; margin: 0 auto; background: white; padding: 40px; border-radius: 12px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
    <h1 style="color: #333; margin-bottom: 20px;">${safeTitle}</h1>
    <p style="color: #666; margin-bottom: 30px;">${safeDescription}</p>
    <p style="color: #999;">Reindirizzamento in corso...</p>
    <a href="${postUrl}" style="display: inline-block; margin-top: 20px; padding: 12px 24px; background: #0066cc; color: white; text-decoration: none; border-radius: 6px;">Vai all'articolo</a>
  </div>
  <script>window.location.replace("${postUrl}");</script>
</body>
</html>`;

    // Upload to storage bucket
    const fileName = `${slug}.html`;

    // Best-effort remove to ensure metadata (content-type) gets refreshed
    const { error: removeError } = await supabase.storage
      .from('og-pages')
      .remove([fileName]);

    if (removeError) {
      console.warn('Remove existing OG page failed (ignored):', removeError);
    }

    const htmlBytes = new TextEncoder().encode(html);

    const { error: uploadError } = await supabase.storage
      .from('og-pages')
      .upload(fileName, htmlBytes, {
        contentType: 'text/html; charset=utf-8',
        cacheControl: '3600',
        upsert: true,
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return new Response(
        JSON.stringify({ error: 'Failed to generate OG page', details: uploadError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from('og-pages')
      .getPublicUrl(fileName);

    console.log('Generated OG page:', publicUrlData.publicUrl);

    return new Response(
      JSON.stringify({ 
        success: true, 
        url: publicUrlData.publicUrl,
        slug: post.slug
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
