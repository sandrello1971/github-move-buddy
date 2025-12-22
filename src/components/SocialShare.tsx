import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Facebook, Twitter, Link2, MessageCircle, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface SocialShareProps {
  slug: string;
  title: string;
}

export function SocialShare({ slug, title }: SocialShareProps) {
  const { toast } = useToast();
  const [ogPageUrl, setOgPageUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const storageOgUrl = `https://nzpawvhmjetdxcvvbwbi.supabase.co/storage/v1/object/public/og-pages/${slug}.html`;

  // Generate OG page on mount
  useEffect(() => {
    // Use deterministic Storage URL immediately; generation just ensures the file exists/updates.
    setOgPageUrl(storageOgUrl);
    generateOgPage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  const generateOgPage = async () => {
    try {
      setIsGenerating(true);
      const { data, error } = await supabase.functions.invoke('generate-og-page', {
        body: { slug },
      });

      if (error) {
        console.error('Error generating OG page:', error);
        toast({
          title: 'Errore',
          description: 'Impossibile preparare l’anteprima per la condivisione.',
          variant: 'destructive',
        });
        return;
      }

      if (data?.url) {
        setOgPageUrl(data.url);
        console.log('OG page URL:', data.url);
      }
    } catch (error) {
      console.error('Error calling generate-og-page:', error);
      toast({
        title: 'Errore',
        description: 'Impossibile preparare l’anteprima per la condivisione.',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Always prefer the Storage OG page (WhatsApp reads OG tags from HTML served as text/html)
  const shareUrl = ogPageUrl || storageOgUrl;
  const handleWhatsApp = () => {
    const text = `${title} - ${shareUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      '_blank',
      'width=600,height=400'
    );
  };

  const handleTwitter = () => {
    const text = title;
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`,
      '_blank',
      'width=600,height=400'
    );
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast({
        title: "Link copiato!",
        description: "Il link è stato copiato negli appunti",
      });
    } catch (error) {
      toast({
        title: "Errore",
        description: "Impossibile copiare il link",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground mr-1">
        {isGenerating ? (
          <span className="flex items-center gap-1">
            <Loader2 className="h-3 w-3 animate-spin" />
            Preparazione...
          </span>
        ) : (
          'Condividi:'
        )}
      </span>
      <Button
        variant="outline"
        size="icon"
        onClick={handleWhatsApp}
        disabled={isGenerating}
        className="h-8 w-8 hover:bg-green-500 hover:text-white hover:border-green-500 transition-colors"
        title="Condividi su WhatsApp"
      >
        <MessageCircle className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={handleFacebook}
        disabled={isGenerating}
        className="h-8 w-8 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-colors"
        title="Condividi su Facebook"
      >
        <Facebook className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={handleTwitter}
        disabled={isGenerating}
        className="h-8 w-8 hover:bg-black hover:text-white hover:border-black transition-colors"
        title="Condividi su X (Twitter)"
      >
        <Twitter className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={handleCopyLink}
        disabled={isGenerating}
        className="h-8 w-8 hover:bg-primary hover:text-primary-foreground transition-colors"
        title="Copia link"
      >
        <Link2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
