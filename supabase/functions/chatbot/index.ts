import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message } = await req.json();

    if (!message) {
      throw new Error('Message is required');
    }

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Rate limiting semplice basato su timestamp
    const now = Date.now();
    const rateLimitKey = `chatbot_${req.headers.get('x-forwarded-for') || 'unknown'}`;
    
    // Fetch recent blog posts to provide context
    const { data: posts, error } = await supabase
      .from('posts')
      .select(`
        title,
        content,
        excerpt,
        slug,
        post_categories(
          categories(name, slug)
        )
      `)
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(10);

    if (error) {
      console.error('Error fetching posts:', error);
    }

    // Create context from blog posts
    const blogContext = posts?.map(post => ({
      title: post.title,
      excerpt: post.excerpt,
      categories: post.post_categories?.map(pc => pc.categories?.name).join(', '),
      slug: post.slug
    })) || [];

    const contextText = blogContext.map(post => 
      `Titolo: ${post.title}\nDescrizione: ${post.excerpt}\nCategorie: ${post.categories}\nSlug: ${post.slug}`
    ).join('\n\n');

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-5-2025-08-07',
        messages: [
          {
            role: 'system',
            content: `Sei un assistente virtuale ESCLUSIVAMENTE per il blog SabAdvance. 

REGOLE RIGOROSE:
- Rispondi SOLO a domande sui contenuti del blog SabAdvance
- NON fornire informazioni generali, consigli medici, finanziari o legali
- NON rispondere a domande su argomenti non correlati al blog
- Se richiesto argomenti esterni al blog, rispondi: "Mi dispiace, posso aiutarti solo con i contenuti del blog SabAdvance."

Il blog tratta di:
- Calcio femminile
- Sport femminili  
- Storie di atlete
- Interviste
- Notizie sportive
- Cucina
- Lifestyle
- Curiosità

Contenuti disponibili nel blog:
${contextText}

ISTRUZIONI:
- Usa SEMPRE gli slug reali per i link: [titolo](/blog/slug-reale)
- Mantieni le risposte brevi e pertinenti
- Reindirizza sempre verso i contenuti del blog
- NON inventare contenuti non presenti nel blog

IMPORTANTE: Rifiuta educatamente qualsiasi domanda non correlata ai contenuti del blog.`
          },
          {
            role: 'user',
            content: message
          }
        ],
        max_completion_tokens: 300,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Failed to get AI response');
    }

    const data = await response.json();
    const botMessage = data.choices[0].message.content;

    return new Response(JSON.stringify({ message: botMessage }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in chatbot function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});