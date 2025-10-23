import { useEffect, useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { VisitCounter } from '@/components/VisitCounter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Mic, ChefHat, Heart, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { SEO } from '@/components/SEO';

interface Post {
  id: string;
  title: string;
  excerpt: string | null;
  slug: string;
  published_at: string;
  featured_image: string | null;
  post_categories: {
    categories: {
      name: string;
      slug: string;
    };
  }[];
}

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
}

const Index = () => {
  const [latestPosts, setLatestPosts] = useState<Post[]>([]);
  const [additionalCategories, setAdditionalCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetchLatestPosts();
    fetchAdditionalCategories();
  }, []);

  const fetchLatestPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          id,
          title,
          excerpt,
          slug,
          published_at,
          featured_image,
          post_categories(
            categories(name, slug)
          )
        `)
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .limit(3);

      if (error) {
        console.error('Error fetching latest posts:', error);
        return;
      }

      setLatestPosts((data as unknown as Post[]) || []);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchAdditionalCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('id, name, slug, description')
        .not('slug', 'in', '(curiosita,cucina,lifestyle-e-tempo-libero,consigli)')
        .order('name');

      if (error) {
        console.error('Error fetching categories:', error);
        return;
      }

      setAdditionalCategories((data as Category[]) || []);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('it-IT', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Sabadvance",
    "url": "https://sabadvance.it",
    "description": "Magazine digitale che offre contenuti di qualità su interviste, cucina, lifestyle e cultura",
    "publisher": {
      "@type": "Organization",
      "name": "Sabadvance",
      "logo": "https://sabadvance.it/lovable-uploads/9afc0cc7-085e-45e9-8a5d-eaccf88663b6.png"
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://sabadvance.it/blog?search={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Sabadvance - Il Magazine che Nutre Mente e Spirito"
        description="Scopri interviste esclusive, ricette gourmet, lifestyle e contenuti di qualità su Sabadvance. Il magazine che stimola curiosità e arricchisce la conoscenza con Sabrina Bertolani."
        keywords="magazine italiano, interviste esclusive, cucina gourmet, lifestyle, cultura, curiosità, sabrina bertolani, sabadvance"
        canonical="/"
        structuredData={structuredData}
      />
      <Header />
      
      {/* Hero Section */}
      <section className="content-section-alt">
        <div className="container mx-auto max-w-5xl text-center hero-fade-in">
          <div className="mb-6">
            <img src="/lovable-uploads/9afc0cc7-085e-45e9-8a5d-eaccf88663b6.png" alt="Sabadvance - Il Magazine che Nutre Mente e Spirito" className="h-32 w-auto mx-auto" />
          </div>
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-blog-hero mb-4 leading-tight drop-shadow-lg">
            Web magazine
          </h1>
          <p className="text-xl md:text-2xl lg:text-3xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed font-semibold">
            Curiosità, conoscenza e svago.
          </p>
          <p className="text-base md:text-lg text-muted-foreground mb-16 max-w-3xl mx-auto leading-relaxed">
            Esplorando argomenti da tutto il mondo con passione, curiosità e una prospettiva unica
          </p>
        </div>
      </section>

      {/* Categories Section */}
      <section className="content-section bg-gradient-to-br from-blog-accent/10 to-blog-muted/20">
        <div className="container mx-auto max-w-7xl">
          <div className="grid md:grid-cols-3 gap-12 lg:gap-16">
            {/* Interviste */}
            <Link to="/blog?category=interviste" className="text-center group cursor-pointer">
              <div className="w-24 h-24 mx-auto mb-8 rounded-2xl bg-primary shadow-lg flex items-center justify-center group-hover:scale-110 transition-all duration-300 group-hover:shadow-xl">
                <Mic className="h-10 w-10 text-white group-hover:scale-110 transition-transform duration-300" />
              </div>
              <h3 className="text-3xl font-bold text-blog-hero mb-6 group-hover:text-blog-terracotta transition-colors duration-300">Interviste</h3>
              <p className="text-muted-foreground text-lg leading-relaxed group-hover:text-foreground transition-colors duration-300">
                Conversazioni approfondite e interviste esclusive con esperti e personalità di rilievo.
              </p>
            </Link>

            {/* Cucina */}
            <Link to="/blog?category=cucina" className="text-center group cursor-pointer">
              <div className="w-24 h-24 mx-auto mb-8 rounded-2xl bg-primary shadow-lg flex items-center justify-center group-hover:scale-110 transition-all duration-300 group-hover:shadow-xl">
                <ChefHat className="h-10 w-10 text-white group-hover:scale-110 transition-transform duration-300" />
              </div>
              <h3 className="text-3xl font-bold text-blog-hero mb-6 group-hover:text-blog-terracotta transition-colors duration-300">Cucina</h3>
              <p className="text-muted-foreground text-lg leading-relaxed group-hover:text-foreground transition-colors duration-300">
                Trova deliziose ricette e consigli culinari per arricchire la tua tavola.
              </p>
            </Link>

            {/* Consigli di Lifestyle */}
            <Link to="/blog?category=lifestyle-e-tempo-libero" className="text-center group cursor-pointer">
              <div className="w-24 h-24 mx-auto mb-8 rounded-2xl bg-primary shadow-lg flex items-center justify-center group-hover:scale-110 transition-all duration-300 group-hover:shadow-xl">
                <Heart className="h-10 w-10 text-white group-hover:scale-110 transition-transform duration-300" />
              </div>
              <h3 className="text-3xl font-bold text-blog-hero mb-6 group-hover:text-blog-terracotta transition-colors duration-300">Lifestyle e tempo libero</h3>
              <p className="text-muted-foreground text-lg leading-relaxed group-hover:text-foreground transition-colors duration-300">
                Consigli di moda, arredamento, benessere e idee per il tempo libero per migliorare la vita quotidiana.
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* Additional Categories Section */}
      {additionalCategories.length > 0 && (
        <section className="content-section bg-gradient-to-br from-blog-muted/5 to-blog-accent/10">
          <div className="container mx-auto max-w-7xl">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-blog-hero mb-4">
                Altre Categorie
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Esplora tutti i nostri argomenti specializzati
              </p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              {additionalCategories.map((category) => (
                <Link 
                  key={category.id} 
                  to={`/blog?category=${category.slug}`}
                  className="group"
                >
                  <Badge 
                    variant="outline" 
                    className="px-6 py-3 text-base font-medium border-2 border-blog-terracotta/20 bg-background hover:bg-blog-terracotta hover:text-background transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg cursor-pointer"
                  >
                    <Tag className="h-4 w-4 mr-2" />
                    {category.name}
                  </Badge>
                </Link>
              ))}
            </div>
            
            <div className="text-center">
              <Link to="/blog">
                <Button variant="outline" className="border-blog-terracotta text-blog-terracotta hover:bg-blog-terracotta hover:text-background">
                  Vedi Tutti gli Articoli
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Latest Articles Section */}
      <section className="content-section-alt bg-gradient-to-br from-blog-muted/5 to-blog-accent/5">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-bold text-blog-hero mb-6">
              Ultimi Articoli
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Scopri le nostre pubblicazioni più recenti
            </p>
          </div>
          
          <div className="blog-grid mb-16">
            {latestPosts.length > 0 ? (
              latestPosts.map((post, index) => (
                <Link key={post.id} to={`/blog/${post.slug}`} className="group">
                  <Card className="overflow-hidden border-0 shadow-lg card-hover h-full">
                    <div className="aspect-[4/3] overflow-hidden bg-blog-muted/20">
                      {post.featured_image ? (
                        <img 
                          src={post.featured_image} 
                          alt={post.title}
                          loading="lazy"
                          className="w-full h-full object-cover image-hover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blog-accent/20 to-blog-terracotta/20 flex items-center justify-center image-hover">
                          <div className="text-center p-6">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blog-hero/10 flex items-center justify-center">
                              {index === 0 && <Mic className="h-8 w-8 text-white" />}
                              {index === 1 && <ChefHat className="h-8 w-8 text-blog-hero" />}
                              {index === 2 && <Heart className="h-8 w-8 text-blog-hero" />}
                            </div>
                            <div className="text-blog-terracotta text-sm font-medium">
                              {formatDate(post.published_at)}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    <CardContent className="p-8">
                      <h3 className="text-2xl font-bold text-blog-hero mb-4 line-clamp-2 group-hover:text-blog-terracotta transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-muted-foreground line-clamp-3 text-lg leading-relaxed mb-4">
                        {post.excerpt || 'Nessuna descrizione disponibile'}
                      </p>
                      {post.post_categories && post.post_categories.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {post.post_categories.map((pc, index) => (
                            <span 
                              key={index}
                              className="px-3 py-1 text-xs font-medium text-blog-terracotta bg-blog-terracotta/10 rounded-full"
                            >
                              {pc.categories.name}
                            </span>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              ))
            ) : (
              // Anteprime statiche quando non ci sono articoli
              <>
                <div className="group">
                  <Card className="overflow-hidden border-0 shadow-lg card-hover h-full">
                    <div className="aspect-[4/3] overflow-hidden bg-gradient-to-br from-blog-accent/20 to-blog-accent/40">
                      <div className="w-full h-full flex items-center justify-center image-hover">
                        <div className="text-center p-6">
                          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blog-hero/10 flex items-center justify-center">
                             <Mic className="h-8 w-8 text-white" />
                          </div>
                          <div className="text-blog-terracotta text-sm font-medium">
                            Prossimamente
                          </div>
                        </div>
                      </div>
                    </div>
                    <CardContent className="p-8">
                       <h3 className="text-2xl font-bold text-blog-hero mb-4 line-clamp-2">
                         Interviste esclusive
                       </h3>
                       <p className="text-muted-foreground line-clamp-3 text-lg leading-relaxed mb-4">
                         Conversazioni approfondite e interviste con esperti, personalità di rilievo e protagonisti del nostro tempo.
                       </p>
                       <div className="inline-block">
                         <span className="px-3 py-1 text-xs font-medium text-blog-terracotta bg-blog-terracotta/10 rounded-full">
                           Interviste
                         </span>
                       </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="group">
                  <Card className="overflow-hidden border-0 shadow-lg card-hover h-full">
                    <div className="aspect-[4/3] overflow-hidden bg-gradient-to-br from-blog-terracotta/20 to-blog-terracotta/40">
                      <div className="w-full h-full flex items-center justify-center image-hover">
                        <div className="text-center p-6">
                          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blog-hero/10 flex items-center justify-center">
                            <ChefHat className="h-8 w-8 text-blog-hero" />
                          </div>
                          <div className="text-blog-terracotta text-sm font-medium">
                            Prossimamente
                          </div>
                        </div>
                      </div>
                    </div>
                    <CardContent className="p-8">
                      <h3 className="text-2xl font-bold text-blog-hero mb-4 line-clamp-2">
                        Ricette & Tradizioni
                      </h3>
                      <p className="text-muted-foreground line-clamp-3 text-lg leading-relaxed mb-4">
                        Dalle ricette tradizionali ai piatti innovativi, scopri i segreti della cucina italiana e internazionale.
                      </p>
                      <div className="inline-block">
                        <span className="px-3 py-1 text-xs font-medium text-blog-terracotta bg-blog-terracotta/10 rounded-full">
                          Cucina
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="group">
                  <Card className="overflow-hidden border-0 shadow-lg card-hover h-full">
                    <div className="aspect-[4/3] overflow-hidden bg-gradient-to-br from-blog-muted/20 to-blog-muted/40">
                      <div className="w-full h-full flex items-center justify-center image-hover">
                        <div className="text-center p-6">
                          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blog-hero/10 flex items-center justify-center">
                            <Heart className="h-8 w-8 text-blog-hero" />
                          </div>
                          <div className="text-blog-terracotta text-sm font-medium">
                            Prossimamente
                          </div>
                        </div>
                      </div>
                    </div>
                    <CardContent className="p-8">
                      <h3 className="text-2xl font-bold text-blog-hero mb-4 line-clamp-2">
                        Benessere & Stile
                      </h3>
                      <p className="text-muted-foreground line-clamp-3 text-lg leading-relaxed mb-4">
                        Consigli per vivere meglio, tendenze lifestyle e suggerimenti per creare uno stile di vita equilibrato.
                      </p>
                      <div className="inline-block">
                        <span className="px-3 py-1 text-xs font-medium text-blog-terracotta bg-blog-terracotta/10 rounded-full">
                          Lifestyle
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </>
            )}
          </div>

          <div className="text-center">
            <Link to="/blog">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-12 py-4 text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 group">
                Leggi tutti gli Articoli
                <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Chi Siamo Section */}
      <section className="content-section bg-gradient-to-br from-blog-hero/5 to-blog-accent/5">
        <div className="container mx-auto max-w-5xl text-center">
          <h2 className="text-5xl md:text-6xl font-bold text-blog-hero mb-8">
            Chi Siamo
          </h2>
          <div className="max-w-4xl mx-auto">
            <p className="text-xl md:text-2xl text-muted-foreground mb-12 leading-relaxed">
              Sabadvance nasce dalla passione per la <strong className="text-blog-terracotta">conoscenza</strong> e dalla curiosità 
              verso tutto ciò che rende la vita più interessante e ricca di significato.
            </p>
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              <div className="p-6">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blog-accent/20 flex items-center justify-center">
                  <Mic className="h-8 w-8 text-white" />
                </div>
                 <h3 className="text-xl font-bold text-blog-hero mb-3">Interviste</h3>
                 <p className="text-muted-foreground">
                   Diamo voce a chi ha storie interessanti da raccontare, con conversazioni autentiche e coinvolgenti.
                 </p>
              </div>
              <div className="p-6">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blog-terracotta/20 flex items-center justify-center">
                  <ChefHat className="h-8 w-8 text-blog-hero" />
                </div>
                <h3 className="text-xl font-bold text-blog-hero mb-3">Passione</h3>
                <p className="text-muted-foreground">
                  Ogni articolo è scritto con amore e dedizione, perché crediamo nel potere delle storie ben raccontate.
                </p>
              </div>
              <div className="p-6">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blog-muted/20 flex items-center justify-center">
                  <Heart className="h-8 w-8 text-blog-hero" />
                </div>
                <h3 className="text-xl font-bold text-blog-hero mb-3">Autenticità</h3>
                <p className="text-muted-foreground">
                  Condividiamo contenuti genuini e utili, pensati per arricchire davvero la tua giornata.
                </p>
              </div>
            </div>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Il nostro obiettivo è creare un spazio dove la <strong className="text-blog-hero">curiosità incontra la qualità</strong>, 
              dove ogni lettore può trovare qualcosa di nuovo da scoprire, imparare o semplicemente apprezzare.
            </p>
          </div>
        </div>
      </section>

      {/* Visit Counter Section */}
      <section className="py-8 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <VisitCounter className="justify-center text-base" />
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;
