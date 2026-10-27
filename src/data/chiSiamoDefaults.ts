export interface ChiSiamoBox { title: string; text: string }
export interface ChiSiamoContent {
  heroTitle: string; heroSubtitle: string;
  missionTitle: string; missionIntro: string; missionBoxes: ChiSiamoBox[]; missionClosing: string;
  valuesTitle: string; valuesSubtitle: string; values: ChiSiamoBox[];
  presentationTitle: string; presentationIntro: string; calendarIntro: string; calendar: ChiSiamoBox[];
  presentationOutro: string; salottoTitle: string; salottoText: string;
  sabrinaTitle: string; sabrinaSubtitle: string; sabrinaBio: string;
}

// Colori ammessi nell'editor (stessi della palette del sito)
export const SITE_COLOR_MAP = [
  'FF82B5', 'Rosa (titoli)',
  'C995B5', 'Fucsia tenue',
  'E8A8C7', 'Rosa lampone',
  'E6007A', 'Rosa intenso',
  '0ABAB5', 'Turchese',
  '6B7280', 'Grigio testo',
  '111827', 'Nero',
];

export const chiSiamoDefaults: ChiSiamoContent = {
  heroTitle: 'Chi Siamo',
  heroSubtitle: 'Scopri la storia, la missione e i valori che guidano Sabadvance nel suo viaggio attraverso curiosità, cultura e conoscenza',
  missionTitle: 'La Nostra Missione',
  missionIntro: '<p>Sabadvance nasce dalla passione per la <strong style="color:#C995B5">conoscenza</strong> e dalla curiosità verso tutto ciò che rende la vita più interessante e ricca di significato.</p>',
  missionBoxes: [
    { title: 'Interviste', text: 'Diamo voce a chi ha storie interessanti da raccontare, con conversazioni autentiche e coinvolgenti.' },
    { title: 'Passione', text: 'Ogni articolo è scritto con amore e dedizione, perché crediamo nel potere delle storie ben raccontate.' },
    { title: 'Autenticità', text: 'Condividiamo contenuti genuini e utili, pensati per arricchire davvero la tua giornata.' },
  ],
  missionClosing: '<p>Il nostro obiettivo è creare un spazio dove la <strong style="color:#FF82B5">curiosità incontra la qualità</strong>, dove ogni lettore può trovare qualcosa di nuovo da scoprire, imparare o semplicemente apprezzare.</p>',
  valuesTitle: 'I Nostri Valori',
  valuesSubtitle: 'Principi che guidano ogni nostro contenuto e interazione',
  values: [
    { title: 'Conoscenza', text: 'Crediamo che la conoscenza sia il fondamento di una vita ricca e consapevole. Ogni contenuto è pensato per ampliare i tuoi orizzonti.' },
    { title: 'Comunità', text: 'Costruiamo una comunità di persone curiose e appassionate, dove ognuno può condividere e imparare dagli altri.' },
    { title: 'Qualità', text: 'Non cerchiamo la quantità, ma la qualità. Ogni articolo è curato nei minimi dettagli per offrire valore reale.' },
  ],
  presentationTitle: 'PRESENTAZIONE DI SABADVANCE',
  presentationIntro: '',
  calendarIntro: 'Ogni settimana su Sabadvance vengono pubblicati quattro post, secondo questo calendario fisso:',
  calendar: [
    { title: 'Lunedì', text: '<p><strong>Interviste ai protagonisti del mese</strong></p><p><small>Rubrica mensile curata dalla giornalista Valentina Cristiani</small></p>' },
    { title: 'Mercoledì', text: '<p><strong>I libri di Sabadvance</strong></p><p><small>Dove gli autori presentano le loro opere</small></p><p><strong>Parole in viaggio</strong></p><p><small>Rubrica letteraria curata da Federica Scaltriti, blogger letteraria</small></p>' },
    { title: 'Venerdì', text: '<p><strong>Doppio appuntamento mensile con:</strong></p><p><strong>Le erbe di Sabadvance</strong></p><p><small>A cura della dott.ssa Anna Maria Anastasi, che ci guida nel mondo dell\'erboristeria</small></p><p><strong>Look &amp; Fashion by Suit</strong></p><p><small>Rubrica di moda firmata Federica Montanari</small></p>' },
    { title: 'Domenica', text: '<p><strong>Giornata dedicata alla cucina</strong></p><p><small>Con ricette inviate da amici della pagina, sia appassionati che professionisti.</small></p><p><small>Tra i contributi fissi, quelli della Pasticceria Carlo Vago di Como, che ogni mese propone "Le Golosità"</small></p>' },
  ],
  presentationOutro: '<p>Inoltre, un appuntamento molto importante è quello con l\'Associazione Amore Randagio ODV, con la quale collaboriamo per promuovere adozioni di cani e gatti in cerca di una nuova famiglia.</p><p style="text-align:center"><strong>…e tutti i mesi non mancano sorprese e novità!</strong></p>',
  salottoTitle: 'Il Salotto di Sabadvance',
  salottoText: '<p>Dal progetto Sabadvance è nato anche un programma televisivo di intrattenimento: "Il Salotto di Sabadvance", che ha già superato le 30 puntate, con ospiti in studio e in collegamento, sempre legati al mondo della pagina.</p>',
  sabrinaTitle: 'Sabrina Bertolani',
  sabrinaSubtitle: 'Fondatrice e Anima di Sabadvance',
  sabrinaBio: '',
};

export const mergeChiSiamo = (saved: Partial<ChiSiamoContent> | null | undefined): ChiSiamoContent => {
  const out = { ...chiSiamoDefaults, ...(saved || {}) } as ChiSiamoContent;
  // Garantisce il numero fisso di riquadri
  (['missionBoxes', 'values', 'calendar'] as const).forEach((k) => {
    out[k] = chiSiamoDefaults[k].map((d, i) => ({ ...d, ...(out[k]?.[i] || {}) }));
  });
  return out;
};
