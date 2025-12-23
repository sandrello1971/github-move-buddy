# Guida Deployment per WhatsApp Preview

## Situazione Attuale

Il progetto supporta **due metodi** per generare le anteprime social corrette:

### Metodo 1: Supabase Edge Function (ATTIVO - Compatibile con Lovable.dev)

✅ **Funziona con il deployment corrente su Lovable.dev**

- **URL**: `https://nzpawvhmjetdxcvvbwbi.supabase.co/functions/v1/og-meta?slug=article-slug`
- **Vantaggi**: 
  - Funziona immediatamente con Lovable.dev
  - Nessuna configurazione aggiuntiva richiesta
  - Già deployato e funzionante
- **Svantaggi**:
  - URL più lungo
  - Dipende da Supabase Edge Functions

### Metodo 2: Cloudflare Pages Function (Disponibile per il futuro)

⏳ **Richiede deployment su Cloudflare Pages**

- **URL**: `https://sabadvance.it/share/article-slug`
- **Vantaggi**:
  - URL più pulito
  - Parte del dominio principale
  - Migliore per SEO
- **Svantaggi**:
  - Richiede deployment su Cloudflare Pages
  - Non funziona con Lovable.dev

## Come Verificare che Funziona

### Test 1: Verifica l'URL della Supabase Function

Apri nel browser:
```
https://nzpawvhmjetdxcvvbwbi.supabase.co/functions/v1/og-meta?slug=SLUG_ARTICOLO
```

Sostituisci `SLUG_ARTICOLO` con lo slug di un articolo pubblicato.

**Comportamento atteso**: 
- Dovresti essere reindirizzato alla pagina dell'articolo su sabadvance.it
- Se visualizzi il sorgente HTML (prima del redirect), dovresti vedere i meta tag OG corretti

### Test 2: Verifica su Facebook Debugger

1. Vai su: https://developers.facebook.com/tools/debug/
2. Incolla l'URL completo della Supabase Function (con lo slug)
3. Clicca "Debug"
4. Dovresti vedere:
   - ✅ Titolo articolo
   - ✅ Descrizione articolo
   - ✅ Immagine in evidenza

### Test 3: Condividi su WhatsApp

1. Nel blog, clicca sul pulsante condividi WhatsApp di un articolo
2. Il link generato dovrebbe essere: `https://nzpawvhmjetdxcvvbwbi.supabase.co/functions/v1/og-meta?slug=...`
3. Invia il messaggio
4. WhatsApp dovrebbe generare l'anteprima con titolo, descrizione e immagine

## Troubleshooting

### Problema: "404 Not Found" sulla Supabase Function

**Causa**: La function potrebbe non essere deployata o ci sono errori nella configurazione Supabase.

**Soluzione**:
1. Verifica che la function `og-meta` esista in Supabase Dashboard
2. Controlla i log della function in Supabase Dashboard → Edge Functions
3. Verifica che le variabili d'ambiente siano configurate:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`

### Problema: Viene mostrato il codice HTML invece dell'anteprima

**Causa**: La risposta della Supabase Edge Function non veniva interpretata correttamente come HTML.

**Soluzione**:
Questo problema è stato risolto (Dicembre 2024) modificando la function `og-meta` per codificare esplicitamente la risposta HTML come bytes. Se continui a vedere questo problema:
1. Verifica che la function `og-meta` sia aggiornata all'ultima versione
2. Rideploya la function in Supabase Dashboard
3. Pulisci la cache di WhatsApp/Facebook usando il parametro `v=` o il Facebook Debugger

### Problema: Anteprima generica invece di quella dell'articolo

**Causa**: WhatsApp potrebbe aver cached-ato una versione precedente.

**Soluzione**:
1. Il parametro `v=` viene automaticamente aggiunto con il timestamp di aggiornamento
2. Prova a modificare manualmente il parametro `v=` nell'URL
3. Usa il Facebook Debugger e clicca "Scrape Again" per forzare l'aggiornamento

### Problema: Il link non si apre

**Causa**: Possibile errore nella query al database o articolo non pubblicato.

**Soluzione**:
1. Verifica che l'articolo abbia `status = 'published'` nel database
2. Controlla che lo slug nell'URL corrisponda a quello nel database
3. Verifica i log della function in Supabase Dashboard

## Prossimi Passi (Opzionale)

Se in futuro vuoi passare a Cloudflare Pages per avere URL più puliti:

1. Segui la guida in `docs/deployment.md`
2. Deploya su Cloudflare Pages invece di Lovable.dev
3. Il codice supporta già entrambi i metodi
4. I link `/share/` funzioneranno automaticamente

## Verifica Deployment Corrente

Per verificare quale metodo è attualmente in uso:

```bash
# Controlla il componente SocialShare
grep "shareUrl" src/components/SocialShare.tsx
```

**Output atteso** (metodo Supabase):
```typescript
const shareUrl = `${supabaseUrl}/functions/v1/og-meta?slug=${encodeURIComponent(slug)}...
```

## Note Tecniche

### Perché due metodi?

1. **Supabase Edge Function**: Funziona ovunque (Lovable.dev, Vercel, Netlify, ecc.)
2. **Cloudflare Pages Function**: Funziona solo su Cloudflare Pages ma offre URL più puliti

### Quale usare?

- **Ora**: Usa Supabase Edge Function (già attivo)
- **Futuro**: Se migri a Cloudflare Pages, passa alla Pages Function

### Differenze tecniche

| Aspetto | Supabase Edge Function | Cloudflare Pages Function |
|---------|----------------------|--------------------------|
| URL | `*.supabase.co/functions/v1/og-meta?slug=...` | `sabadvance.it/share/...` |
| Platform | Deno | Cloudflare Workers |
| Deploy | Supabase CLI | Cloudflare Pages |
| Costo | Incluso in Supabase free tier | Incluso in Cloudflare free tier |
| Latency | ~100-300ms | ~50-150ms |

## Supporto

Se continui ad avere problemi:
1. Verifica i log in Supabase Dashboard → Edge Functions → og-meta
2. Controlla che gli articoli siano pubblicati nel database
3. Testa l'URL direttamente nel browser prima di condividere
