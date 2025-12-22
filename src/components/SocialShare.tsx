import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Facebook, Twitter, Link2, MessageCircle } from 'lucide-react';

interface SocialShareProps {
  slug: string;
  title: string;
}

export function SocialShare({ slug, title }: SocialShareProps) {
  const { toast } = useToast();
  
  // URL dell'edge function per i meta tag OG corretti
  const ogMetaUrl = `https://nzpawvhmjetdxcvvbwbi.supabase.co/functions/v1/og-meta?slug=${slug}`;
  
  const handleWhatsApp = () => {
    const text = `${title} - ${ogMetaUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(ogMetaUrl)}`,
      '_blank',
      'width=600,height=400'
    );
  };

  const handleTwitter = () => {
    const text = title;
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(ogMetaUrl)}`,
      '_blank',
      'width=600,height=400'
    );
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(ogMetaUrl);
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
      <span className="text-sm text-muted-foreground mr-1">Condividi:</span>
      <Button
        variant="outline"
        size="icon"
        onClick={handleWhatsApp}
        className="h-8 w-8 hover:bg-green-500 hover:text-white hover:border-green-500 transition-colors"
        title="Condividi su WhatsApp"
      >
        <MessageCircle className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={handleFacebook}
        className="h-8 w-8 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-colors"
        title="Condividi su Facebook"
      >
        <Facebook className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={handleTwitter}
        className="h-8 w-8 hover:bg-black hover:text-white hover:border-black transition-colors"
        title="Condividi su X (Twitter)"
      >
        <Twitter className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={handleCopyLink}
        className="h-8 w-8 hover:bg-primary hover:text-primary-foreground transition-colors"
        title="Copia link"
      >
        <Link2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
