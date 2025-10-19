import { Link } from 'react-router-dom';
import sabadvanceLogo from '/lovable-uploads/4de97660-9f7c-40a6-8be9-59c6c29972b1.png';

export function Footer() {
  return (
    <footer className="bg-gradient-to-br from-blog-hero to-blog-hero/90 text-background mt-auto">
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-4 gap-12">
          <div className="col-span-2">
            <img src={sabadvanceLogo} alt="Sabadvance - Magazine Italiano" loading="lazy" className="h-16 mb-4" />
            <p className="text-background/80 text-lg leading-relaxed mb-6">
              Esplorando argomenti da tutto il mondo con curiosità, passione e una prospettiva unica.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold text-lg mb-4">Esplora</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/blog" className="text-background/80 hover:text-background transition-colors text-base hover:underline">
                  Tutti gli Articoli
                </Link>
              </li>
              <li>
                <Link to="/admin" className="text-background/80 hover:text-background transition-colors text-base hover:underline">
                  Amministrazione
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-lg mb-4">Informazioni</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/privacy" className="text-background/80 hover:text-background transition-colors text-base hover:underline">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/cookies" className="text-background/80 hover:text-background transition-colors text-base hover:underline">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-background/20 mt-12 pt-8 text-center">
          <p className="text-background/60">
            © {new Date().getFullYear()} Sabadvance. Tutti i diritti riservati.
          </p>
        </div>
      </div>
    </footer>
  );
}