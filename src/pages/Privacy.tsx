import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { SEO } from '@/components/SEO';
import { Breadcrumbs } from '@/components/Breadcrumbs';

export default function Privacy() {
  const breadcrumbItems = [{ label: 'Privacy Policy' }];

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Privacy Policy - Sabadvance"
        description="Informativa sulla privacy di Sabadvance. Scopri come proteggiamo i tuoi dati personali e rispettiamo la tua privacy."
        canonical="/privacy"
        keywords="privacy policy, protezione dati, gdpr, sabadvance"
        noindex={false}
      />
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <Breadcrumbs items={breadcrumbItems} />
        <h1 className="text-4xl font-bold text-blog-hero mb-8">Privacy Policy</h1>
        
        <div className="prose prose-lg max-w-none text-foreground">
          <h2 className="text-2xl font-semibold text-blog-hero mt-8 mb-4">1. Informazioni Generali</h2>
          <p className="mb-4">
            Questa Privacy Policy descrive come raccogliamo, utilizziamo e proteggiamo le tue informazioni personali 
            quando visiti il nostro sito web.
          </p>
          
          <h2 className="text-2xl font-semibold text-blog-hero mt-8 mb-4">2. Titolare del Trattamento</h2>
          <p className="mb-4">
            Il titolare del trattamento dei dati è Sabadvance.<br/>
            Per qualsiasi domanda riguardante questa privacy policy, puoi contattarci all'indirizzo email: info@sabadvance.com
          </p>
          
          <h2 className="text-2xl font-semibold text-blog-hero mt-8 mb-4">3. Dati Raccolti</h2>
          <p className="mb-4">I dati personali che potremmo raccogliere includono:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Nome e cognome</li>
            <li>Indirizzo email</li>
            <li>Dati di navigazione (cookie tecnici)</li>
            <li>Indirizzo IP</li>
          </ul>
          
          <h2 className="text-2xl font-semibold text-blog-hero mt-8 mb-4">4. Finalità del Trattamento</h2>
          <p className="mb-4">I tuoi dati vengono utilizzati per:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Fornire i servizi richiesti</li>
            <li>Migliorare l'esperienza utente</li>
            <li>Inviare comunicazioni relative al servizio</li>
            <li>Rispettare gli obblighi legali</li>
          </ul>
          
          <h2 className="text-2xl font-semibold text-blog-hero mt-8 mb-4">5. Base Giuridica</h2>
          <p className="mb-4">
            Il trattamento dei dati è basato sul consenso dell'interessato, sull'esecuzione di un contratto 
            e sul legittimo interesse del titolare.
          </p>
          
          <h2 className="text-2xl font-semibold text-blog-hero mt-8 mb-4">6. Conservazione dei Dati</h2>
          <p className="mb-4">
            I dati personali vengono conservati per il tempo necessario al raggiungimento delle finalità 
            per cui sono stati raccolti e in conformità agli obblighi di legge.
          </p>
          
          <h2 className="text-2xl font-semibold text-blog-hero mt-8 mb-4">7. Diritti dell'Interessato</h2>
          <p className="mb-4">Hai il diritto di:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Accedere ai tuoi dati personali</li>
            <li>Rettificare dati inesatti</li>
            <li>Cancellare i tuoi dati</li>
            <li>Limitare il trattamento</li>
            <li>Portabilità dei dati</li>
            <li>Opporti al trattamento</li>
            <li>Revocare il consenso</li>
          </ul>
          
          <h2 className="text-2xl font-semibold text-blog-hero mt-8 mb-4">8. Sicurezza</h2>
          <p className="mb-4">
            Implementiamo misure di sicurezza tecniche e organizzative appropriate per proteggere 
            i tuoi dati personali da accessi non autorizzati, perdita o distruzione.
          </p>
          
          <h2 className="text-2xl font-semibold text-blog-hero mt-8 mb-4">9. Modifiche</h2>
          <p className="mb-4">
            Ci riserviamo il diritto di modificare questa Privacy Policy in qualsiasi momento. 
            Le modifiche saranno pubblicate su questa pagina.
          </p>
          
          <p className="text-sm text-muted-foreground mt-8">
            Ultimo aggiornamento: {new Date().toLocaleDateString('it-IT')}
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}