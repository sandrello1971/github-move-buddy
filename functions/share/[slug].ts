// Cloudflare Pages Function to handle /share/:slug routes
// This provides proper Open Graph meta tags for social media crawlers

interface Env {
  VITE_SUPABASE_URL: string;
  VITE_SUPABASE_PUBLISHABLE_KEY: string;
}

interface Post {
  title: string;
  excerpt: string | null;
  featured_image: string | null;
  published_at: string | null;
  slug: string;
}

export async function onRequest(context: {
  request: Request;
  env: Env;
  params: { slug: string };
}): Promise<Response> {
  const { request, env, params } = context;
  const slug = params.slug;

  if (!slug) {
    return new Response('Missing slug', { status: 400 });
  }

  const siteUrl = 'https://sabadvance.it';
  const postUrl = `${siteUrl}/blog/${slug}`;

  // Get Supabase configuration from environment
  const supabaseUrl = env.VITE_SUPABASE_URL || 'https://nzpawvhmjetdxcvvbwbi.supabase.co';
  const supabaseKey = env.VITE_SUPABASE_PUBLISHABLE_KEY || '';

  try {
    // REST query: fetch published posts
    const queryUrl = new URL(`${supabaseUrl}/rest/v1/posts`);
    queryUrl.searchParams.set('select', 'title,excerpt,featured_image,published_at,slug');
    queryUrl.searchParams.set('slug', `eq.${slug}`);
    queryUrl.searchParams.set('status', 'eq.published');
    queryUrl.searchParams.set('limit', '1');

    const res = await fetch(queryUrl.toString(), {
      headers: {
        apikey: supabaseKey,
        authorization: `Bearer ${supabaseKey}`,
      },
    });

    if (!res.ok) {
      return new Response('Post not found', { status: 404 });
    }

    const rows = (await res.json()) as Post[];
    const post = rows?.[0];

    if (!post) {
      return new Response('Post not found', { status: 404 });
    }

    const ogImage = post.featured_image || `${siteUrl}/lovable-uploads/9afc0cc7-085e-45e9-8a5d-eaccf88663b6.png`;
    const description = post.excerpt || `${post.title} - Leggi l'articolo completo su Sabadvance`;

    // Escape HTML to prevent XSS
    const escapeHtml = (str: string) =>
      str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');

    const safeTitle = escapeHtml(post.title);
    const safeDescription = escapeHtml(description);

    const html = `<!doctype html>
<html lang="it">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>${safeTitle} | Sabadvance</title>
  <meta name="description" content="${safeDescription}" />
  <link rel="canonical" href="${postUrl}" />

  <!-- Open Graph Meta Tags -->
  <meta property="og:title" content="${safeTitle} | Sabadvance" />
  <meta property="og:description" content="${safeDescription}" />
  <meta property="og:type" content="article" />
  <meta property="og:url" content="${postUrl}" />
  <meta property="og:image" content="${ogImage}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:site_name" content="Sabadvance" />
  <meta property="og:locale" content="it_IT" />
  ${post.published_at ? `<meta property="article:published_time" content="${post.published_at}" />` : ''}

  <!-- Twitter Card Meta Tags -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${safeTitle} | Sabadvance" />
  <meta name="twitter:description" content="${safeDescription}" />
  <meta name="twitter:image" content="${ogImage}" />
  <meta name="twitter:site" content="@sabadvance" />

  <!-- Redirect to actual article page -->
  <meta http-equiv="refresh" content="0;url=${postUrl}" />
  <script>window.location.replace("${postUrl}");</script>
</head>
<body style="font-family: sans-serif; text-align: center; padding: 50px; color: #333;">
  <h1>Reindirizzamento in corso...</h1>
  <p><a href="${postUrl}" style="color: #00a693; text-decoration: underline;">Clicca qui se non vieni reindirizzato automaticamente</a></p>
</body>
</html>`;

    return new Response(html, {
      headers: {
        'content-type': 'text/html; charset=utf-8',
        'cache-control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.error('Error fetching post:', error);
    return new Response('Internal server error', { status: 500 });
  }
}
