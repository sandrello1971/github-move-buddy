# Modifica della pagina "Chi Siamo" dall'amministrazione

## Cosa ottieni
- Nella pagina di amministrazione compare un pulsante **"Modifica Chi Siamo"** (solo per gli admin) che apre un modulo diviso per sezioni, nello stesso ordine della pagina: Intestazione, La Nostra Missione (con i 3 riquadri), I Nostri Valori (3 schede), Presentazione di Sabadvance, ecc.
- Per ogni sezione modifichi **titoli e testi**, senza dover pensare a font e colori: la grafica della pagina resta identica (titoli grandi nel colore del sito, testi in grigio, icone e sfondi colorati).
- Per i testi lunghi (es. Presentazione) usi lo stesso editor degli articoli, con grassetto, corsivo, elenchi e **parole evidenziate in colore** (es. "conoscenza" in terracotta) scegliendo solo tra i colori del sito, così niente colori fuori stile.
- Pulsante "Salva" e link "Vedi pagina". Se nulla è stato ancora salvato, la pagina mostra i testi attuali.

## Per risparmiare crediti
- Una sola tabella nuova, una nuova pagina di modifica e un piccolo intervento sulla pagina Chi Siamo: niente costruttore di pagine generico.
- Icone, layout e numero di riquadri restano fissi (si modificano solo i contenuti).

## Dettagli tecnici
- Tabella `site_content` (`key` text unico, `content` jsonb, `updated_at`), lettura pubblica, scrittura solo admin via `has_role`; GRANT a anon/authenticated/service_role. Riga `chi_siamo`.
- `src/data/chiSiamoDefaults.ts`: testi attuali come valori di default (merge con quanto salvato).
- `ChiSiamo.tsx`: legge la riga, renderizza i campi mantenendo le classi esistenti; i testi ricchi in `prose` con DOMPurify.
- Nuova rotta `/admin/chi-siamo` (`EditChiSiamo.tsx`), con Input per titoli/testi brevi e `RichTextEditor` per paragrafi; palette colori limitata ai token del sito (terracotta, accent, hero).
- Pulsante in `Admin.tsx`, rotta in `App.tsx`.
