# Fix per Errore 404 sui Link di Condivisione Social

## Problema
Il link `https://sabadvance.it/share/bruce?v=2025-12-22T11:45:52.722201+00:00` restituisce un errore 404.

## Causa
Il sito usa Cloudflare Pages Functions per gestire i link di condivisione (`/share/:slug`). La configurazione iniziale di `_routes.json` era troppo restrittiva (`include: ["/share/*"]`), il che significava che SOLO i percorsi `/share/*` venivano valutati per le Functions, mentre tutti gli altri percorsi venivano trattati come file statici. Questo rompeva il routing SPA per percorsi come `/blog/:slug`, causando 404 quando gli utenti navigavano direttamente a questi URL.

## Soluzione Implementata

### 1. Aggiornato File `_routes.json`
Modificato il file `/public/_routes.json` per gestire correttamente sia le Functions che il routing SPA:

```json
{
  "version": 1,
  "include": ["/*"],
  "exclude": [
    "/assets/*",
    "/favicon.*",
    "/placeholder.svg",
    "/robots.txt",
    "/sitemap.xml",
    "/_headers",
    "/_redirects",
    "/lovable-uploads/*"
  ]
}
```

Questo garantisce che:
- Tutti i percorsi (`/*`) vengono valutati per le Functions
- I file statici (CSS, JS, immagini, ecc.) vengono esclusi dalla valutazione Functions
- Le richieste a `/share/*` vengono gestite dalla Function in `/functions/share/[slug].ts`
- Tutti gli altri percorsi cadono attraverso al file `_redirects` che serve `index.html` per il React SPA

### 2. Aggiornato `.gitignore`
Aggiunto `.wrangler/` ai file ignorati da git (è una directory di build creata da wrangler per i test locali).

### 3. Installato Wrangler
Aggiunto `wrangler` come dipendenza di sviluppo per permettere il test locale delle Functions.

## Verifica della Soluzione

### Test Locali
Per testare localmente:

```bash
# Build del progetto
npm run build

# Avvia wrangler con le Functions
npx wrangler pages dev dist --port 8788

# Testa l'endpoint (in un altro terminale)
curl http://localhost:8788/share/bruce
```

**Nota**: Il test locale potrebbe fallire per mancanza di accesso a Supabase, ma l'importante è che la Function venga chiamata (non un 404).

### Deployment su Cloudflare Pages

Dopo il deployment su Cloudflare Pages, verifica:

1. **Test diretto**:
   ```
   https://sabadvance.it/share/bruce
   ```
   Dovrebbe reindirizzare a `/blog/bruce`

2. **Test con Facebook Debugger**:
   - Vai su https://developers.facebook.com/tools/debug/
   - Incolla `https://sabadvance.it/share/bruce`
   - Clicca "Debug"
   - Verifica che mostri titolo, descrizione e immagine corretti

3. **Test su WhatsApp**:
   - Invia il link a te stesso su WhatsApp
   - Verifica che l'anteprima venga generata correttamente

## Configurazione Cloudflare Pages

Assicurati che le variabili d'ambiente siano configurate nel dashboard di Cloudflare Pages:

- `VITE_SUPABASE_URL`: `https://nzpawvhmjetdxcvvbwbi.supabase.co`
- `VITE_SUPABASE_PUBLISHABLE_KEY`: (la tua chiave pubblica Supabase)
- `VITE_SITE_URL`: `https://sabadvance.it` (opzionale, ma raccomandato)

## Come Funziona

1. Quando qualcuno visita `/share/bruce`:
   - Cloudflare Pages Routes Configuration (`_routes.json`) identifica che questa route deve essere gestita da una Function
   - La Function in `/functions/share/[slug].ts` viene eseguita
   - La Function recupera i dati del post da Supabase
   - Restituisce HTML con i meta tag Open Graph corretti per i social media
   - Reindirizza l'utente a `/blog/bruce`

2. I crawler dei social media (WhatsApp, Facebook, Twitter):
   - Leggono l'HTML con i meta tag Open Graph
   - Generano l'anteprima con titolo, descrizione e immagine
   - Mostrano l'anteprima ricca agli utenti

## Troubleshooting

### 404 ancora presente dopo il deployment

1. **Verifica che il deployment sia su Cloudflare Pages**:
   - Questa soluzione funziona SOLO su Cloudflare Pages
   - Se il sito è deployato altrove (Lovable.dev, Netlify, Vercel), le Functions non funzioneranno

2. **Verifica che le Functions siano state deployate**:
   - Nel dashboard di Cloudflare Pages, controlla la sezione "Functions"
   - Dovresti vedere `share/[slug]` nella lista

3. **Controlla i log**:
   - Nel dashboard di Cloudflare Pages → Functions → Logs
   - Cerca errori relativi alla Function `share/[slug]`

4. **Verifica le variabili d'ambiente**:
   - Vai su Settings → Environment variables
   - Controlla che `VITE_SUPABASE_URL` e `VITE_SUPABASE_PUBLISHABLE_KEY` siano impostate

### L'anteprima non si aggiorna

WhatsApp e Facebook cachano le anteprime. Per forzare l'aggiornamento:

1. **Cambia il parametro `v=`**:
   ```
   https://sabadvance.it/share/bruce?v=2025-12-23T15:00:00.000Z
   ```

2. **Usa Facebook Debugger**:
   - Vai su https://developers.facebook.com/tools/debug/
   - Incolla l'URL
   - Clicca "Scrape Again"

### La Function restituisce 500 Internal Server Error

1. **Verifica le credenziali Supabase**:
   - Controlla che `VITE_SUPABASE_URL` e `VITE_SUPABASE_PUBLISHABLE_KEY` siano corrette
   - Prova a fare una query diretta a Supabase per verificare

2. **Controlla che il post esista**:
   - Il post deve esistere nel database
   - Il post deve avere `status = 'published'`
   - Lo slug deve corrispondere esattamente

3. **Verifica i log di Cloudflare**:
   - Dashboard → Functions → Logs
   - Cerca il messaggio di errore specifico

## File Modificati

- `/public/_routes.json` - AGGIORNATO: Configurazione routing Cloudflare Pages per gestire sia Functions che SPA
- `/public/_redirects` - ESISTENTE: Gestisce il fallback SPA
- `/.gitignore` - ESISTENTE: Include `.wrangler/`
- `/package.json` - ESISTENTE: Include `wrangler` come dev dependency

## Note sulla Configurazione `_routes.json`

La configurazione `_routes.json` con `include: ["/*"]` e `exclude: [...]` è cruciale per il corretto funzionamento del sito. Non usare `include: ["/share/*"]` perché questo rompe il routing SPA facendo in modo che solo i percorsi `/share/*` vengano valutati per le Functions, mentre tutti gli altri vengono trattati come file statici.

## Riferimenti

- [Cloudflare Pages Functions Documentation](https://developers.cloudflare.com/pages/platform/functions/)
- [Cloudflare Pages Routing](https://developers.cloudflare.com/pages/platform/functions/routing/)
- [Open Graph Protocol](https://ogp.me/)
