import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message } = await req.json();

    // Input validation: message is required, must be string, max 500 chars
    if (!message || typeof message !== 'string') {
      throw new Error('Message is required and must be a string');
    }
    
    const trimmedMessage = message.trim();
    if (trimmedMessage.length === 0) {
      throw new Error('Message cannot be empty');
    }
    
    if (trimmedMessage.length > 500) {
      throw new Error('Message must be 500 characters or less');
    }

    // Controllo della chiave API OpenAI
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Supabase credentials missing');
      // Procedi senza database per ora
    }

    let blogContext = [];
    let contextText = 'Blog SabAdvance - contenuti su calcio femminile, sport, cucina e lifestyle.';

    // Prova a recuperare i post solo se le credenziali Supabase sono disponibili
    if (supabaseUrl && supabaseServiceKey) {
      try {
        const supabase = createClient(supabaseUrl, supabaseServiceKey);
        
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
          .order('published_at', { ascending: false });

        if (!error && posts) {
          blogContext = posts.map(post => ({
            title: post.title,
            excerpt: post.excerpt,
            content: post.content?.substring(0, 500),
            categories: post.post_categories?.map((pc: { categories: { name: string; slug: string } | null }) => pc.categories?.name).filter(Boolean).join(', ') || '',
            slug: post.slug
          }));

          contextText = blogContext.map(post => 
            `Titolo: ${post.title}\nDescrizione: ${post.excerpt}\nContenuto: ${post.content}\nCategorie: ${post.categories}\nSlug: ${post.slug}`
          ).join('\n\n');
        }
      } catch (supabaseError) {
        console.error('Error fetching from Supabase:', supabaseError);
        // Continua senza i dati del database
      }
    }

    // Call OpenAI API con modello corretto
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
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
            content: trimmedMessage
          }
        ],
        max_tokens: 300,
        temperature: 0.7
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API Error:', errorData);
      throw new Error(`OpenAI API Error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const botMessage = data.choices?.[0]?.message?.content || 'Mi dispiace, non riesco a elaborare la tua richiesta.';

    return new Response(JSON.stringify({ message: botMessage }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
    
  } catch (error) {
    console.error('Error in chatbot function:', error);
    
    // Risposta di fallback più user-friendly
    const fallbackMessage = "Mi dispiace, ho riscontrato un problema tecnico. Riprova più tardi o contatta il supporto.";
    
    return new Response(
      JSON.stringify({ 
        message: fallbackMessage,
        error: error instanceof Error ? error.message : 'Unknown error'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
