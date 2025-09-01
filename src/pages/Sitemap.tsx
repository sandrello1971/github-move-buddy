import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface SitemapEntry {
  loc: string;
  lastmod: string;
  changefreq: string;
  priority: string;
}

export default function Sitemap() {
  const [sitemapXml, setSitemapXml] = useState<string>('');

  useEffect(() => {
    generateSitemap();
  }, []);

  const generateSitemap = async () => {
    const baseUrl = 'https://sabadvance.it';
    const entries: SitemapEntry[] = [];
    
    // Static pages
    entries.push({
      loc: baseUrl,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'daily',
      priority: '1.0'
    });
    
    entries.push({
      loc: `${baseUrl}/blog`,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'daily',
      priority: '0.9'
    });
    
    entries.push({
      loc: `${baseUrl}/chi-siamo`,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'monthly',
      priority: '0.8'
    });
    
    entries.push({
      loc: `${baseUrl}/privacy`,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'yearly',
      priority: '0.3'
    });
    
    entries.push({
      loc: `${baseUrl}/cookies`,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'yearly',
      priority: '0.3'
    });

    try {
      // Fetch all published posts
      const { data: posts } = await supabase
        .from('posts')
        .select('slug, published_at, updated_at')
        .eq('status', 'published')
        .order('published_at', { ascending: false });

      if (posts) {
        posts.forEach(post => {
          entries.push({
            loc: `${baseUrl}/blog/${post.slug}`,
            lastmod: (post.updated_at || post.published_at).split('T')[0],
            changefreq: 'weekly',
            priority: '0.7'
          });
        });
      }

      // Fetch all categories
      const { data: categories } = await supabase
        .from('categories')
        .select('slug')
        .order('name');

      if (categories) {
        categories.forEach(category => {
          entries.push({
            loc: `${baseUrl}/blog?category=${category.slug}`,
            lastmod: new Date().toISOString().split('T')[0],
            changefreq: 'weekly',
            priority: '0.6'
          });
        });
      }
    } catch (error) {
      console.error('Error generating sitemap:', error);
    }

    // Generate XML
    const xml = generateSitemapXml(entries);
    setSitemapXml(xml);
  };

  const generateSitemapXml = (entries: SitemapEntry[]): string => {
    const urlElements = entries.map(entry => `
  <url>
    <loc>${entry.loc}</loc>
    <lastmod>${entry.lastmod}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`).join('');

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlElements}
</urlset>`;
  };

  // Set content type for XML
  useEffect(() => {
    if (sitemapXml) {
      const blob = new Blob([sitemapXml], { type: 'application/xml' });
      const url = URL.createObjectURL(blob);
      
      // Download sitemap
      const link = document.createElement('a');
      link.href = url;
      link.download = 'sitemap.xml';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  }, [sitemapXml]);

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-6">Sitemap Generator</h1>
        <p className="text-muted-foreground mb-4">
          La sitemap è stata generata e scaricata automaticamente.
        </p>
        
        {sitemapXml && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Anteprima Sitemap XML:</h2>
            <pre className="bg-muted p-4 rounded-lg overflow-auto text-sm">
              {sitemapXml}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}