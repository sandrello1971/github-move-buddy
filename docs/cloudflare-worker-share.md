# Share endpoint per anteprime WhatsApp (Cloudflare Worker)

## Perché serve
WhatsApp (e altri crawler) leggono i tag Open Graph **solo se** l’URL risponde con `Content-Type: text/html`.
Nel nostro caso Supabase Edge Functions e Supabase Storage stanno servendo HTML come `text/plain` (con CSP sandbox), quindi l’anteprima spesso non viene generata.

La soluzione definitiva è servire un endpoint su **sabadvance.it** che restituisca HTML con OG tags.

---

## Route consigliata
- URL: `https://sabadvance.it/share/:slug`
- Esempio: `https://sabadvance.it/share/bruce?v=2025-12-22T11:45:13.064Z`

Il parametro `v` è opzionale e serve solo per **bustare la cache** delle anteprime.

---

## Cloudflare Worker (codice)
Crea un Worker e aggiungi una route tipo: `sabadvance.it/share/*`.

Imposta le variabili d’ambiente del Worker:
- `SUPABASE_URL` = `https://nzpawvhmjetdxcvvbwbi.supabase.co`
- `SUPABASE_ANON_KEY` = la tua anon key (pubblica)

```ts
// Cloudflare Worker
export default {
  async fetch(request: Request, env: { SUPABASE_URL: string; SUPABASE_ANON_KEY: string }) {
    const url = new URL(request.url);

    // /share/{slug}
    const parts = url.pathname.split('/').filter(Boolean);
    const slug = parts[1];

    if (!slug) {
      return new Response('Missing slug', { status: 400 });
    }

    const siteUrl = 'https://sabadvance.it';
    const postUrl = `${siteUrl}/blog/${slug}`;

    // REST query: posts pubblicati
    const queryUrl = new URL(`${env.SUPABASE_URL}/rest/v1/posts`);
    queryUrl.searchParams.set('select', 'title,excerpt,featured_image,published_at,slug');
    queryUrl.searchParams.set('slug', `eq.${slug}`);
    queryUrl.searchParams.set('status', 'eq.published');
    queryUrl.searchParams.set('limit', '1');

    const res = await fetch(queryUrl.toString(), {
      headers: {
        apikey: env.SUPABASE_ANON_KEY,
        authorization: `Bearer ${env.SUPABASE_ANON_KEY}`,
      },
    });

    if (!res.ok) {
      return new Response('Post not found', { status: 404 });
    }

    const rows = (await res.json()) as Array<{
      title: string;
      excerpt: string | null;
      featured_image: string | null;
      published_at: string | null;
      slug: string;
    }>;

    const post = rows?.[0];
    if (!post) {
      return new Response('Post not found', { status: 404 });
    }

    const ogImage = post.featured_image || `${siteUrl}/lovable-uploads/9afc0cc7-085e-45e9-8a5d-eaccf88663b6.png`;
    const description = post.excerpt || `${post.title} - Leggi l'articolo completo su Sabadvance`;

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

  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${safeTitle} | Sabadvance" />
  <meta name="twitter:description" content="${safeDescription}" />
  <meta name="twitter:image" content="${ogImage}" />

  <meta http-equiv="refresh" content="0;url=${postUrl}" />
</head>
<body>
  Redirecting… <a href="${postUrl}">Apri articolo</a>
</body>
</html>`;

    return new Response(html, {
      headers: {
        'content-type': 'text/html; charset=utf-8',
        'cache-control': 'public, max-age=3600',
      },
    });
  },
};
```

---

## Note
- Dopo aver attivato il Worker, WhatsApp potrebbe comunque mostrare cache vecchia: cambia `v=` (o modifica il post, così cambia `updated_at`).
