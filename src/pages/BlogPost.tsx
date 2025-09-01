import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Header } from '@/components/Header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CalendarDays, User, ArrowLeft } from 'lucide-react';
import { sanitizeHtml } from '@/utils/sanitizeHtml';
import { SEO } from '@/components/SEO';
import { Breadcrumbs } from '@/components/Breadcrumbs';

interface Post {
  id: string;
  title: string;
  content: string;
  excerpt: string | null;
  slug: string;
  published_at: string;
  updated_at?: string;
  author_id: string;
  featured_image: string | null;
  post_categories: {
    categories: {
      name: string;
    };
  }[];
}

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [authorName, setAuthorName] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      fetchPost();
    }
  }, [slug]);

  const fetchPost = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          post_categories(
            categories(name)
          )
        `)
        .eq('slug', slug)
        .eq('status', 'published')
        .single();

      if (error) {
        console.error('Error fetching post:', error);
        return;
      }

      setPost(data as unknown as Post);
      
      // Fetch author name separately
      if (data.author_id) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('user_id', data.author_id)
          .single();
        
        if (profileData) {
          setAuthorName(profileData.full_name || 'Autore sconosciuto');
        }
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
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

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <SEO title="Post non trovato" noindex={true} />
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Post non trovato</h1>
            <Link to="/blog">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Torna al blog
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const postCategories = post.post_categories?.map(pc => pc.categories.name) || [];
  const breadcrumbItems = [
    { label: 'Blog', href: '/blog' },
    { label: post.title }
  ];

  const articleStructuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title,
    "description": post.excerpt || post.title,
    "image": post.featured_image || "https://sabadvance.it/lovable-uploads/9afc0cc7-085e-45e9-8a5d-eaccf88663b6.png",
    "author": {
      "@type": "Person",
      "name": authorName || "Sabadvance"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Sabadvance",
      "logo": "https://sabadvance.it/lovable-uploads/9afc0cc7-085e-45e9-8a5d-eaccf88663b6.png"
    },
    "datePublished": post.published_at,
    "dateModified": post.updated_at || post.published_at,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://sabadvance.it/blog/${post.slug}`
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={post.title}
        description={post.excerpt || `${post.title} - Leggi l'articolo completo su Sabadvance`}
        canonical={`/blog/${post.slug}`}
        ogType="article"
        ogImage={post.featured_image}
        publishedTime={post.published_at}
        modifiedTime={post.updated_at || post.published_at}
        author={authorName}
        category={postCategories[0]}
        tags={postCategories}
        keywords={`${post.title}, ${postCategories.join(', ')}, sabadvance, magazine`}
        structuredData={articleStructuredData}
      />
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <Breadcrumbs items={breadcrumbItems} />
        <div className="max-w-4xl mx-auto">
          <Link to="/blog" className="inline-block mb-6">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Torna al blog
            </Button>
          </Link>

          <article>
            {post.featured_image && (
              <div className="aspect-video overflow-hidden rounded-lg mb-8">
                <img
                  src={post.featured_image}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <header className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                {post.post_categories && post.post_categories.length > 0 && (
                  post.post_categories.map((pc, index) => (
                    <Badge key={index} variant="secondary">{pc.categories.name}</Badge>
                  ))
                )}
              </div>
              
              <h1 className="text-4xl font-bold text-blog-hero mb-4">{post.title}</h1>
              
              {post.excerpt && (
                <p className="text-xl text-muted-foreground mb-6">{post.excerpt}</p>
              )}

              <div className="flex items-center gap-6 text-sm text-muted-foreground border-b pb-6">
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4" />
                  {formatDate(post.published_at)}
                </div>
                {authorName && (
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    {authorName}
                  </div>
                )}
              </div>
            </header>

            <div 
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(post.content) }}
            />
          </article>
        </div>
      </main>
    </div>
  );
}