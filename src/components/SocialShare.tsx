import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Facebook, Twitter, Link2, MessageCircle } from 'lucide-react';

interface SocialShareProps {
  slug: string;
  title: string;
  /**
   * Versione per bustare la cache delle preview (es. updated_at o published_at).
   * Cambiandola, WhatsApp è più propenso a rigenerare l'anteprima.
   */
  shareVersion?: string;
}

export function SocialShare({ slug, title, shareVersion }: SocialShareProps) {
  const { toast } = useToast();

  // Usa il dominio principale per la condivisione (Cloudflare Pages Function)
  // Questo endpoint /share/{slug} restituisce HTML con i meta tag OG corretti
  // per i crawler dei social media e reindirizza gli utenti alla pagina dell'articolo
  const siteUrl = import.meta.env.VITE_SITE_URL || 'https://sabadvance.it';
  const shareUrl = `${siteUrl}/share/${encodeURIComponent(slug)}${shareVersion ? `?v=${encodeURIComponent(shareVersion)}` : ''}`;

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
