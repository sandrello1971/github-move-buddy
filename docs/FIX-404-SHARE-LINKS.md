# Fix per Errore 404 sui Link di Condivisione Social

## Problema
Il link `https://sabadvance.it/share/bruce?v=2025-12-22T11:45:52.722201+00:00` restituisce un errore 404.

## Causa
Il link di condivisione `/share/:slug` restituisce un errore 404. Questo può accadere per diversi motivi:

1. **Il sito non è deployato su Cloudflare Pages**: Le Cloudflare Pages Functions funzionano SOLO su Cloudflare Pages, non su altri servizi di hosting.
2. **La directory `/functions` non viene deployata**: La build potrebbe non includere la directory delle Functions.
3. **Configurazione di deployment errata**: Le variabili d'ambiente o il comando di build potrebbero essere configurati male.

## Prerequisiti

**IMPORTANTE**: Questa soluzione funziona SOLO se il sito è deployato su **Cloudflare Pages**. Se il sito è su:
- Lovable.dev
- Netlify  
- Vercel
- Altri servizi

Le Cloudflare Pages Functions NON funzioneranno. In quel caso, usa invece la Supabase Edge Function (vedi `GUIDA-DEPLOYMENT-IT.md`).

## Verifica Deployment Cloudflare Pages

Prima di tutto, verifica che il sito sia su Cloudflare Pages:

1. Vai al dashboard di Cloudflare Pages: https://dash.cloudflare.com/
2. Controlla se il progetto `sabadvance` esiste
3. Vai su Functions nella sidebar
4. Verifica che la Function `share/[slug]` sia listata

Se il progetto non esiste o le Functions non sono visibili, devi prima deployare il sito su Cloudflare Pages.

## Soluzione

### 1. Configurazione `_routes.json` (CORRETTA)
Il file `/public/_routes.json` deve avere questa configurazione:

```json
{
  "version": 1,
  "include": ["/share/*"],
  "exclude": []
}
```

Questo garantisce che:
- Solo le richieste a `/share/*` vengono gestite dalla Function in `/functions/share/[slug].ts`
- Tutti gli altri percorsi usano il routing SPA standard (servendo `index.html` tramite `_redirects`)

### 2. Verifica Build e Deployment

#### Verifica che la directory `/functions` venga deployata:

Quando esegui il build del progetto:
```bash
npm run build
```

Assicurati che:
1. La directory `dist/` viene creata
2. La directory `functions/` esiste nella root del progetto (NON in `dist/`)

**IMPORTANTE**: Su Cloudflare Pages, la directory `/functions` deve essere presente nella root del repository, NON nella directory di build `dist/`. Cloudflare la deployta automaticamente insieme al sito statico.

#### Configurazione Build su Cloudflare Pages:

Nel dashboard di Cloudflare Pages, verifica che il Build sia configurato così:

- **Build command**: `npm run build`
- **Build output directory**: `dist`
- **Root directory**: `/` (default)

La directory `/functions` viene automaticamente rilevata da Cloudflare Pages se è nella root del progetto.

### 3. Verifica Variabili d'Ambiente

Nel dashboard di Cloudflare Pages → Settings → Environment variables, assicurati che siano configurate:

- `VITE_SUPABASE_URL`: `https://nzpawvhmjetdxcvvbwbi.supabase.co`
- `VITE_SUPABASE_PUBLISHABLE_KEY`: (la tua chiave pubblica Supabase)
- `VITE_SITE_URL`: `https://sabadvance.it` (opzionale)

Queste variabili sono necessarie perché la Function le usa per connettersi a Supabase e recuperare i dati del post.

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

## File Modificati/Verificati

- `/public/_routes.json` - CONFIGURAZIONE CORRETTA: Solo `/share/*` deve invocare Functions
- `/functions/share/[slug].ts` - Function per gestire i link di condivisione
- `/public/_redirects` - Gestisce il fallback SPA per tutti gli altri percorsi
- `/docs/FIX-404-SHARE-LINKS.md` - Questa guida

## Note Importanti sulla Configurazione

### Perché `include: ["/share/*"]` è la configurazione corretta

La configurazione `_routes.json` con `include: ["/share/*"]` è l'approccio corretto per un SPA con Functions specifiche perché:

1. **Solo i percorsi specificati invocano Functions** - Riduce i costi e migliora le performance
2. **Gli altri percorsi usano il routing SPA** - Cloudflare automaticamente serve `index.html` per percorsi sconosciuti (grazie a `_redirects`)
3. **I file statici vengono serviti direttamente** - CSS, JS, immagini non passano attraverso le Functions

### NON usare `include: ["/*"]`

La configurazione `include: ["/*"]` NON è raccomandata per questo progetto perché:
- Fa sì che OGNI richiesta provi a invocare una Function
- Aumenta i costi e riduce le performance
- Non è necessaria per il routing SPA (funziona automaticamente con `_redirects`)

### Struttura del Progetto per Cloudflare Pages

```
/
├── functions/           ← Cloudflare deploya questa directory automaticamente
│   └── share/
│       └── [slug].ts   ← Gestisce /share/:slug
├── public/
│   ├── _routes.json    ← Controlla quale percorso invoca le Functions
│   └── _redirects      ← Fallback SPA (/* → /index.html)
├── src/                ← Codice React
└── dist/               ← Build output (deployato come sito statico)
```

## Riferimenti

- [Cloudflare Pages Functions Documentation](https://developers.cloudflare.com/pages/platform/functions/)
- [Cloudflare Pages Routing](https://developers.cloudflare.com/pages/platform/functions/routing/)
- [Open Graph Protocol](https://ogp.me/)
