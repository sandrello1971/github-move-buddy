import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Header } from '@/components/Header';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarDays, Lightbulb } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { SEO } from '@/components/SEO';
import { Breadcrumbs } from '@/components/Breadcrumbs';

interface Post {
  id: string;
  title: string;
  excerpt: string | null;
  slug: string;
  published_at: string;
  author_id: string;
  featured_image: string | null;
  post_categories: {
    categories: {
      name: string;
      slug: string;
    };
  }[];
}

export default function Blog() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryFilter = searchParams.get('category');
  const sortOrder = searchParams.get('sort') || 'newest';

  useEffect(() => {
    fetchPosts();
  }, [categoryFilter, sortOrder]);

  const fetchPosts = async () => {
    try {
      const ascending = sortOrder === 'oldest';
      
      let query = supabase
        .from('posts')
        .select(`
          *,
          post_categories(
            categories(name, slug)
          )
        `)
        .eq('status', 'published')
        .order('published_at', { ascending });

      // Per filtrare per categoria, devo usare un approccio diverso
      let data;
      if (categoryFilter) {
        // Prima ottieni tutti i post, poi filtra lato client
        const { data: allPosts, error } = await query;
        if (error) throw error;
        
        data = allPosts?.filter(post => 
          post.post_categories?.some(pc => pc.categories.slug === categoryFilter)
        );
      } else {
        const { data: allPosts, error } = await query;
        if (error) throw error;
        data = allPosts;
      }

      setPosts((data as unknown as Post[]) || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSortChange = (newSort: string) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('sort', newSort);
    setSearchParams(newParams);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('it-IT', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Caricamento...</div>
        </div>
      </div>
    );
  }

  const currentTitle = categoryFilter ? getCategoryTitle(categoryFilter) : 'Blog';
  const currentDescription = categoryFilter ? getCategoryDescription(categoryFilter) : 'Scopri tutti i nostri articoli su interviste, cucina, lifestyle e molto altro. Contenuti di qualità che nutrono mente e spirito.';
  const canonicalPath = categoryFilter ? `/blog?category=${categoryFilter}` : '/blog';

  const breadcrumbItems = categoryFilter 
    ? [{ label: 'Blog', href: '/blog' }, { label: getCategoryTitle(categoryFilter) }]
    : [{ label: 'Blog' }];

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={currentTitle}
        description={currentDescription}
        canonical={canonicalPath}
        keywords={`${currentTitle.toLowerCase()}, articoli, blog, sabadvance, magazine italiano`}
      />
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <Breadcrumbs items={breadcrumbItems} />
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-blog-hero mb-4">
            {categoryFilter ? getCategoryTitle(categoryFilter) : 'Blog'}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {categoryFilter ? getCategoryDescription(categoryFilter) : 'Scopri le nostre storie, approfondimenti e contenuti esclusivi'}
          </p>
        </div>

        <div className="flex justify-between items-center mb-8">
          <div className="text-sm text-muted-foreground">
            {posts.length} {posts.length === 1 ? 'articolo' : 'articoli'} {categoryFilter ? `in ${getCategoryTitle(categoryFilter)}` : ''}
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Ordina per:</span>
            <Select value={sortOrder} onValueChange={handleSortChange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Più recenti</SelectItem>
                <SelectItem value="oldest">Più vecchi</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-blog-muted/20 flex items-center justify-center">
              <Lightbulb className="h-10 w-10 text-blog-hero/50" />
            </div>
            <p className="text-xl text-muted-foreground">
              {categoryFilter ? `Non ci sono ancora post pubblicati in "${getCategoryTitle(categoryFilter)}"` : 'Non ci sono ancora post pubblicati.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <Link key={post.id} to={`/blog/${post.slug}`} className="group">
                <Card className="h-full hover:shadow-lg transition-shadow overflow-hidden">
                  {post.featured_image ? (
                    <div className="aspect-[4/3] overflow-hidden">
                      <img
                        src={post.featured_image}
                        alt={post.title}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ) : (
                    <div className="aspect-[4/3] bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                        <Lightbulb className="h-8 w-8 text-primary" />
                      </div>
                    </div>
                  )}
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex flex-wrap gap-1">
                        {post.post_categories && post.post_categories.length > 0 ? (
                          post.post_categories.map((pc, index) => (
                            <Badge 
                              key={index}
                              variant="secondary" 
                              className="text-xs"
                            >
                              {pc.categories.name}
                            </Badge>
                          ))
                        ) : null}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
                        <CalendarDays className="h-3 w-3" />
                        {formatDate(post.published_at)}
                      </div>
                    </div>
                    <CardTitle className="line-clamp-2 text-lg font-semibold group-hover:text-primary transition-colors">
                      {post.title}
                    </CardTitle>
                    {post.excerpt && (
                      <CardDescription className="line-clamp-3 text-sm leading-relaxed mt-2">
                        {post.excerpt}
                      </CardDescription>
                    )}
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

const getCategoryTitle = (slug: string): string => {
  const titles: { [key: string]: string } = {
    interviste: 'Interviste',
    curiosita: 'Curiosità',
    cucina: 'Cucina',
    lifestyle: 'Lifestyle',
    consigli: 'Consigli'
  };
  return titles[slug] || 'Blog';
};

const getCategoryDescription = (slug: string): string => {
  const descriptions: { [key: string]: string } = {
    interviste: 'Conversazioni approfondite e interviste esclusive con esperti e personalità di rilievo.',
    curiosita: 'Scopri fatti affascinanti, storie incredibili e fenomeni misteriosi che arricchiranno la tua conoscenza del mondo.',
    cucina: 'Dalle ricette tradizionali ai piatti innovativi, scopri i segreti della cucina italiana e internazionale.',
    lifestyle: 'Consigli di moda, arredamento e benessere per migliorare la vita quotidiana.',
    consigli: 'Suggerimenti pratici per migliorare la tua vita in tutti gli aspetti.'
  };
  return descriptions[slug] || 'Scopri le ultime novità, insights e innovazioni dal mondo di Sabadvance';
};