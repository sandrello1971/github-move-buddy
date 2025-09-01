import { Header } from '@/components/Header';

export default function Cookies() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-4xl font-bold text-blog-hero mb-8">Cookie Policy</h1>
        
        <div className="prose prose-lg max-w-none text-foreground">
          <h2 className="text-2xl font-semibold text-blog-hero mt-8 mb-4">1. Cosa sono i Cookie</h2>
          <p className="mb-4">
            I cookie sono piccoli file di testo che vengono memorizzati sul tuo dispositivo quando visiti un sito web. 
            Sono ampiamente utilizzati per far funzionare i siti web in modo più efficiente e per fornire informazioni 
            ai proprietari del sito.
          </p>
          
          <h2 className="text-2xl font-semibold text-blog-hero mt-8 mb-4">2. Tipi di Cookie Utilizzati</h2>
          
          <h3 className="text-xl font-medium text-blog-hero mt-6 mb-3">Cookie Tecnici Necessari</h3>
          <p className="mb-4">
            Questi cookie sono essenziali per il funzionamento del sito web e non possono essere disabilitati. 
            Includono cookie per:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Autenticazione e sicurezza</li>
            <li>Mantenimento delle preferenze utente</li>
            <li>Funzionalità del carrello (se applicabile)</li>
          </ul>
          
          <h3 className="text-xl font-medium text-blog-hero mt-6 mb-3">Cookie di Analisi</h3>
          <p className="mb-4">
            Utilizziamo cookie di analisi per comprendere come i visitatori utilizzano il nostro sito web. 
            Questi cookie ci aiutano a:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Contare il numero di visitatori</li>
            <li>Vedere come i visitatori si spostano nel sito</li>
            <li>Identificare le pagine più popolari</li>
            <li>Migliorare l'esperienza utente</li>
          </ul>
          
          <h3 className="text-xl font-medium text-blog-hero mt-6 mb-3">Cookie di Personalizzazione</h3>
          <p className="mb-4">
            Questi cookie permettono al sito web di ricordare le scelte fatte dall'utente per fornire 
            funzionalità personalizzate:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Lingua preferita</li>
            <li>Tema del sito (chiaro/scuro)</li>
            <li>Preferenze di visualizzazione</li>
          </ul>
          
          <h2 className="text-2xl font-semibold text-blog-hero mt-8 mb-4">3. Gestione dei Cookie</h2>
          <p className="mb-4">
            Puoi controllare e/o eliminare i cookie come desideri. Puoi eliminare tutti i cookie 
            che sono già sul tuo computer e puoi impostare la maggior parte dei browser per 
            impedire che vengano inseriti.
          </p>
          
          <h3 className="text-xl font-medium text-blog-hero mt-6 mb-3">Disabilitare i Cookie nel Browser</h3>
          <ul className="list-disc pl-6 mb-4">
            <li><strong>Chrome:</strong> Impostazioni → Privacy e sicurezza → Cookie e altri dati dei siti</li>
            <li><strong>Firefox:</strong> Opzioni → Privacy e sicurezza → Cookie e dati dei siti web</li>
            <li><strong>Safari:</strong> Preferenze → Privacy → Gestione dati siti web</li>
            <li><strong>Edge:</strong> Impostazioni → Cookie e autorizzazioni sito</li>
          </ul>
          
          <h2 className="text-2xl font-semibold text-blog-hero mt-8 mb-4">4. Cookie di Terze Parti</h2>
          <p className="mb-4">
            Il nostro sito web potrebbe utilizzare servizi di terze parti che impostano i propri cookie:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Google Analytics (se utilizzato)</li>
            <li>Social media plugins</li>
            <li>Servizi di chat o supporto</li>
          </ul>
          
          <h2 className="text-2xl font-semibold text-blog-hero mt-8 mb-4">5. Durata dei Cookie</h2>
          <p className="mb-4">
            I cookie possono essere:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li><strong>Cookie di sessione:</strong> vengono eliminati quando chiudi il browser</li>
            <li><strong>Cookie persistenti:</strong> rimangono sul tuo dispositivo per un periodo prestabilito</li>
          </ul>
          
          <h2 className="text-2xl font-semibold text-blog-hero mt-8 mb-4">6. Consenso</h2>
          <p className="mb-4">
            Utilizzando il nostro sito web, acconsenti all'uso dei cookie in conformità con questa policy. 
            Se non accetti l'uso dei cookie, ti preghiamo di disabilitarli nel tuo browser.
          </p>
          
          <h2 className="text-2xl font-semibold text-blog-hero mt-8 mb-4">7. Contatti</h2>
          <p className="mb-4">
            Per qualsiasi domanda riguardante l'uso dei cookie, puoi contattarci all'indirizzo: 
            info@sabadvance.com
          </p>
          
          <p className="text-sm text-muted-foreground mt-8">
            Ultimo aggiornamento: {new Date().toLocaleDateString('it-IT')}
          </p>
        </div>
      </main>
    </div>
  );
}