import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export const Breadcrumbs = ({ items }: BreadcrumbsProps) => {
  const breadcrumbStructuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://sabadvance.it"
      },
      ...items.map((item, index) => ({
        "@type": "ListItem",
        "position": index + 2,
        "name": item.label,
        ...(item.href && { "item": `https://sabadvance.it${item.href}` })
      }))
    ]
  };

  return (
    <>
      <script type="application/ld+json">
        {JSON.stringify(breadcrumbStructuredData)}
      </script>
      <nav aria-label="Breadcrumb" className="py-4">
        <ol className="flex items-center space-x-2 text-sm text-muted-foreground">
          <li>
            <Link 
              to="/" 
              className="flex items-center hover:text-foreground transition-colors"
              aria-label="Torna alla homepage"
            >
              <Home className="h-4 w-4" />
              <span className="sr-only">Home</span>
            </Link>
          </li>
          
          {items.map((item, index) => (
            <li key={index} className="flex items-center">
              <ChevronRight className="h-4 w-4 mx-2" />
              {item.href && index < items.length - 1 ? (
                <Link 
                  to={item.href} 
                  className="hover:text-foreground transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <span 
                  className={index === items.length - 1 ? "text-foreground font-medium" : ""}
                  aria-current={index === items.length - 1 ? "page" : undefined}
                >
                  {item.label}
                </span>
              )}
            </li>
        ))}
      </ol>
    </nav>
    </>
  );
};