import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  category?: string;
  tags?: string[];
  noindex?: boolean;
  structuredData?: object;
}

export const SEO = ({
  title = "Sabadvance - Il Magazine che Nutre Mente e Spirito",
  description = "Scopri interviste esclusive, ricette gourmet, lifestyle e contenuti di qualità su Sabadvance. Il magazine che stimola curiosità e arricchisce la conoscenza.",
  keywords = "magazine, interviste, cucina, lifestyle, cultura, curiosità, sabadvance",
  canonical,
  ogImage = "https://nzpawvhmjetdxcvvbwbi.supabase.co/storage/v1/object/public/post-images/sabadvance-og-image.jpg",
  ogType = 'website',
  publishedTime,
  modifiedTime,
  author,
  category,
  tags = [],
  noindex = false,
  structuredData
}: SEOProps) => {
  const siteUrl = "https://sabadvance.it";
  const fullCanonical = canonical ? `${siteUrl}${canonical}` : undefined;
  
  // Costruisci il titolo completo
  const fullTitle = title.includes('Sabadvance') ? title : `${title} | Sabadvance`;
  
  // Structured Data per l'organizzazione
  const organizationStructuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Sabadvance",
    "url": siteUrl,
    "logo": `${siteUrl}/lovable-uploads/9afc0cc7-085e-45e9-8a5d-eaccf88663b6.png`,
    "description": "Magazine digitale che offre contenuti di qualità su interviste, cucina, lifestyle e cultura",
    "founder": {
      "@type": "Person",
      "name": "Sabrina Bertolani"
    },
    "sameAs": [
      "https://www.instagram.com/sabadvance/",
      "https://www.facebook.com/sabadvance/"
    ]
  };

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author || "Sabadvance"} />
      
      {/* Canonical URL */}
      {fullCanonical && <link rel="canonical" href={fullCanonical} />}
      
      {/* Robots */}
      <meta name="robots" content={noindex ? "noindex, nofollow" : "index, follow"} />
      <meta name="googlebot" content={noindex ? "noindex, nofollow" : "index, follow"} />
      
      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={fullCanonical || siteUrl} />
      <meta property="og:image" content={ogImage || "https://sabadvance.it/lovable-uploads/9afc0cc7-085e-45e9-8a5d-eaccf88663b6.png"} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="Sabadvance" />
      <meta property="og:locale" content="it_IT" />
      
      {/* Article specific OG tags */}
      {ogType === 'article' && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {ogType === 'article' && modifiedTime && (
        <meta property="article:modified_time" content={modifiedTime} />
      )}
      {ogType === 'article' && author && (
        <meta property="article:author" content={author} />
      )}
      {ogType === 'article' && category && (
        <meta property="article:section" content={category} />
      )}
      {ogType === 'article' && tags.map(tag => (
        <meta key={tag} property="article:tag" content={tag} />
      ))}
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage || "https://sabadvance.it/lovable-uploads/9afc0cc7-085e-45e9-8a5d-eaccf88663b6.png"} />
      <meta name="twitter:site" content="@sabadvance" />
      
      {/* Additional Meta Tags */}
      <meta name="theme-color" content="#00a693" />
      <meta name="msapplication-TileColor" content="#00a693" />
      
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(organizationStructuredData)}
      </script>
      
      {/* Custom Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};