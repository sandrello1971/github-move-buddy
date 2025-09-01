import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Mic, ChefHat, Heart, Users, Target, BookOpen } from 'lucide-react';

const ChiSiamo = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="content-section-alt">
        <div className="container mx-auto max-w-5xl text-center hero-fade-in">
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold text-blog-hero mb-8 leading-tight">
            Chi Siamo
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-16 max-w-3xl mx-auto leading-relaxed">
            Scopri la storia, la missione e i valori che guidano Sabadvance nel suo viaggio attraverso curiosità, cultura e conoscenza
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="content-section bg-gradient-to-br from-blog-accent/10 to-blog-muted/20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-blog-hero mb-6">
              La Nostra Missione
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Sabadvance nasce dalla passione per la <strong className="text-blog-terracotta">conoscenza</strong> e dalla curiosità 
              verso tutto ciò che rende la vita più interessante e ricca di significato.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blog-accent/20 flex items-center justify-center">
                <Mic className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-blog-hero mb-3">Interviste</h3>
              <p className="text-muted-foreground">
                Diamo voce a chi ha storie interessanti da raccontare, con conversazioni autentiche e coinvolgenti.
              </p>
            </div>
            <div className="p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blog-terracotta/20 flex items-center justify-center">
                <ChefHat className="h-8 w-8 text-blog-hero" />
              </div>
              <h3 className="text-xl font-bold text-blog-hero mb-3">Passione</h3>
              <p className="text-muted-foreground">
                Ogni articolo è scritto con amore e dedizione, perché crediamo nel potere delle storie ben raccontate.
              </p>
            </div>
            <div className="p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blog-muted/20 flex items-center justify-center">
                <Heart className="h-8 w-8 text-blog-hero" />
              </div>
              <h3 className="text-xl font-bold text-blog-hero mb-3">Autenticità</h3>
              <p className="text-muted-foreground">
                Condividiamo contenuti genuini e utili, pensati per arricchire davvero la tua giornata.
              </p>
            </div>
          </div>
          
          <div className="text-center">
            <p className="text-lg text-muted-foreground leading-relaxed max-w-4xl mx-auto">
              Il nostro obiettivo è creare un spazio dove la <strong className="text-blog-hero">curiosità incontra la qualità</strong>, 
              dove ogni lettore può trovare qualcosa di nuovo da scoprire, imparare o semplicemente apprezzare.
            </p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="content-section-alt bg-gradient-to-br from-blog-muted/5 to-blog-accent/5">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-bold text-blog-hero mb-6">
              I Nostri Valori
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Principi che guidano ogni nostro contenuto e interazione
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg card-hover h-full">
              <CardContent className="p-8">
                <div className="w-16 h-16 mb-6 rounded-2xl bg-blog-accent shadow-lg flex items-center justify-center">
                  <BookOpen className="h-8 w-8 text-blog-hero" />
                </div>
                <h3 className="text-2xl font-bold text-blog-hero mb-4">Conoscenza</h3>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Crediamo che la conoscenza sia il fondamento di una vita ricca e consapevole. Ogni contenuto è pensato per ampliare i tuoi orizzonti.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg card-hover h-full">
              <CardContent className="p-8">
                <div className="w-16 h-16 mb-6 rounded-2xl bg-blog-terracotta shadow-lg flex items-center justify-center">
                  <Users className="h-8 w-8 text-background" />
                </div>
                <h3 className="text-2xl font-bold text-blog-hero mb-4">Comunità</h3>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Costruiamo una comunità di persone curiose e appassionate, dove ognuno può condividere e imparare dagli altri.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg card-hover h-full">
              <CardContent className="p-8">
                <div className="w-16 h-16 mb-6 rounded-2xl bg-blog-muted shadow-lg flex items-center justify-center">
                  <Target className="h-8 w-8 text-blog-hero" />
                </div>
                <h3 className="text-2xl font-bold text-blog-hero mb-4">Qualità</h3>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Non cerchiamo la quantità, ma la qualità. Ogni articolo è curato nei minimi dettagli per offrire valore reale.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Presentazione di Sabadvance */}
      <section className="content-section bg-gradient-to-br from-blog-terracotta/5 to-blog-muted/5">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-blog-hero mb-6">
              PRESENTAZIONE DI SABADVANCE
            </h2>
          </div>
          
          <div className="prose prose-lg max-w-none text-lg text-muted-foreground leading-relaxed space-y-6">
            <p>
              Sabadvance è una pagina Facebook e Instagram dedicata allo svago e all'intrattenimento, 
              nata nel 2018 con l'idea di creare uno spazio di svago, condivisione e intrattenimento. 
              Il nome nasce dalla combinazione di SAB, abbreviazione del mio nome, e di un errore 
              curioso: doveva essere advise, ma uno sbaglio di digitazione lo trasformò in advance, e 
              così è rimasto.
            </p>
            
            <p>
              Nei primi mesi, Sabadvance proponeva consigli pratici e numerose ricette, spesso 
              condivise da amiche appassionate e molto brave in cucina. Con il tempo, il progetto è 
              cresciuto e si è trasformato in un vero e proprio web magazine, con rubriche periodiche e 
              contenuti sempre più vari e strutturati.
            </p>
            
            <p>
              Una delle sezioni più seguite è quella delle interviste al personaggio del mese, donne e 
              uomini — noti o meno — che scelgono di raccontarsi con autenticità.
            </p>
            
            <p>
              Dal dicembre scorso, è nata anche la rubrica "Dietro le quinte", che porta alla scoperta del 
              backstage del mondo dello spettacolo, con interviste a protagonisti del settore.
            </p>
            
            <div className="mt-12">
              <h3 className="text-3xl font-bold text-blog-hero mb-8 text-center">Le rubriche settimanali</h3>
              <p className="mb-8 text-center">
                Ogni settimana su Sabadvance vengono pubblicati quattro post, secondo questo 
                calendario fisso:
              </p>
              
              <div className="grid md:grid-cols-2 gap-8">
                <Card className="border-0 shadow-lg card-hover">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-full bg-blog-accent/20 flex items-center justify-center">
                        <Mic className="h-6 w-6 text-blog-hero" />
                      </div>
                      <h4 className="text-xl font-bold text-blog-hero">Lunedì</h4>
                    </div>
                    <p className="font-semibold mb-2">Interviste ai protagonisti del mese</p>
                    <p className="text-sm">Rubrica mensile curata dalla giornalista Valentina Cristiani</p>
                  </CardContent>
                </Card>
                
                <Card className="border-0 shadow-lg card-hover">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-full bg-blog-terracotta/20 flex items-center justify-center">
                        <BookOpen className="h-6 w-6 text-blog-hero" />
                      </div>
                      <h4 className="text-xl font-bold text-blog-hero">Mercoledì</h4>
                    </div>
                    <p className="font-semibold mb-2">I libri di Sabadvance</p>
                    <p className="text-sm mb-3">Dove gli autori presentano le loro opere</p>
                    <p className="font-semibold mb-2">Parole in viaggio</p>
                    <p className="text-sm">Rubrica letteraria curata da Federica Scaltriti, blogger letteraria</p>
                  </CardContent>
                </Card>
                
                <Card className="border-0 shadow-lg card-hover">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-full bg-blog-muted/20 flex items-center justify-center">
                        <Target className="h-6 w-6 text-blog-hero" />
                      </div>
                      <h4 className="text-xl font-bold text-blog-hero">Venerdì</h4>
                    </div>
                    <p className="font-semibold mb-2">Doppio appuntamento mensile con:</p>
                    <p className="font-semibold mb-1">Le erbe di Sabadvance</p>
                    <p className="text-sm mb-3">A cura della dott.ssa Anna Maria Anastasi, che ci guida nel mondo dell'erboristeria</p>
                    <p className="font-semibold mb-1">Look & Fashion by Suit</p>
                    <p className="text-sm">Rubrica di moda firmata Federica Montanari</p>
                  </CardContent>
                </Card>
                
                <Card className="border-0 shadow-lg card-hover">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-full bg-blog-accent/20 flex items-center justify-center">
                        <ChefHat className="h-6 w-6 text-blog-hero" />
                      </div>
                      <h4 className="text-xl font-bold text-blog-hero">Domenica</h4>
                    </div>
                    <p className="font-semibold mb-2">Giornata dedicata alla cucina</p>
                    <p className="text-sm mb-3">Con ricette inviate da amici della pagina, sia appassionati che professionisti.</p>
                    <p className="text-sm">Tra i contributi fissi, quelli della Pasticceria Carlo Vago di Como, che ogni mese propone "Le Golosità"</p>
                  </CardContent>
                </Card>
              </div>
            </div>
            
            <p className="mt-8">
              Inoltre, un appuntamento molto importante è quello con l'Associazione Amore Randagio 
              ODV, con la quale collaboriamo per promuovere adozioni di cani e gatti in cerca di una 
              nuova famiglia.
            </p>
            
            <p className="text-center font-semibold">
              …e tutti i mesi non mancano sorprese e novità!
            </p>
            
            <div className="mt-12">
              <h3 className="text-3xl font-bold text-blog-hero mb-6 text-center">Il Salotto di Sabadvance</h3>
              <p>
                Dal progetto Sabadvance è nato anche un programma televisivo di intrattenimento: 
                "Il Salotto di Sabadvance", che ha già superato le 30 puntate, con ospiti in studio e in 
                collegamento, sempre legati al mondo della pagina.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sabrina Bertolani Section */}
      <section className="content-section bg-gradient-to-br from-blog-hero/5 to-blog-accent/5">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-blog-hero mb-6">
              Sabrina Bertolani
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Fondatrice e Anima di Sabadvance
            </p>
          </div>
          
          <div className="max-w-none">
            <div className="relative">
              <img 
                src="/lovable-uploads/16aab4aa-5d80-4927-b8a5-bf9aa180f3a0.png" 
                alt="Sabrina Bertolani" 
                className="float-left w-80 h-auto rounded-2xl shadow-2xl mr-8 mb-6"
              />
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-blog-hero/10 to-transparent float-left w-80 mr-8 mb-6"></div>
            </div>
            
            <div className="prose prose-lg max-w-none text-lg text-muted-foreground leading-relaxed">
              <p className="mb-6">
                Giornalista con una solida esperienza nel settore dell'informazione sportiva, televisiva e 
                web, Sabrina Bertolani è attiva dal 2002 con numerose collaborazioni in ambito editoriale, 
                televisivo e digitale.
              </p>
              
              <p className="mb-6">
                Conduttrice e autrice della trasmissione "Il Salotto di Sabadvance", in onda su canali 
                televisivi e piattaforme online, è anche ideatrice e amministratrice unica del progetto 
                SABADVANCE, un web magazine nato nel 2018 e seguito su Facebook e Instagram.
              </p>
              
              <p className="mb-6">
                Nel corso della sua carriera ha collaborato con le emittenti Telereggio e TRC Modena, è 
                stata inviata sui campi della Serie A e ha seguito da vicino la squadra della Correggese 
                Calcio. Ha lavorato anche come redattrice per il giornale aziendale T-News di Transcoop, 
                e ha scritto per il mensile NIMA Magazine.
              </p>
              
              <p className="mb-6">
                Dal 2015 è presenza saltuaria su Telereggio, è stata ospite/opinionista del talk sportivo 
                "Palle e Palloni", dedicato a Sassuolo Calcio, Reggiana Calcio e Pallacanestro Reggiana.
              </p>
              
              <p className="mb-6">
                Da anni cura la presentazione di eventi sportivi, culturali e di moda, tra cui fiere, sfilate e 
                incontri letterari. Ha tenuto anche lezioni scolastiche sul mondo dell'informazione, come quella presso la 
                scuola primaria Jean Piaget di Bologna.
              </p>
              
              <p className="mb-0">
                Ha firmato articoli per importanti testate locali come Gazzetta di Reggio, Giornale di 
                Reggio, Ultime Notizie e TuttoReggio, dedicandosi sia al calcio amatoriale che a temi di 
                costume e attualità.
              </p>
            </div>
            
            <div className="clear-both"></div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default ChiSiamo;