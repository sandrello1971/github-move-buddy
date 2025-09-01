import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { X, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
}

export function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true, // Always true, cannot be disabled
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    // Check if user has already made a choice
    const cookieConsent = localStorage.getItem('cookie-consent');
    if (!cookieConsent) {
      // Show banner after a short delay for better UX
      const timer = setTimeout(() => setShowBanner(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const acceptAll = () => {
    const allAccepted = {
      necessary: true,
      analytics: true,
      marketing: true,
      timestamp: Date.now(),
    };
    localStorage.setItem('cookie-consent', JSON.stringify(allAccepted));
    setShowBanner(false);
  };

  const acceptNecessaryOnly = () => {
    const necessaryOnly = {
      necessary: true,
      analytics: false,
      marketing: false,
      timestamp: Date.now(),
    };
    localStorage.setItem('cookie-consent', JSON.stringify(necessaryOnly));
    setShowBanner(false);
  };

  const savePreferences = () => {
    const savedPreferences = {
      ...preferences,
      timestamp: Date.now(),
    };
    localStorage.setItem('cookie-consent', JSON.stringify(savedPreferences));
    setShowBanner(false);
  };

  const handlePreferenceChange = (type: keyof CookiePreferences) => {
    if (type === 'necessary') return; // Cannot disable necessary cookies
    
    setPreferences(prev => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
      <Card className="mx-auto max-w-4xl bg-background border shadow-lg">
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-semibold text-blog-hero">
                🍪 Utilizziamo i Cookie
              </h3>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={acceptNecessaryOnly}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <p className="text-muted-foreground mb-4">
            Utilizziamo cookie per migliorare la tua esperienza di navigazione, analizzare il traffico del sito 
            e personalizzare i contenuti. Puoi scegliere quali categorie di cookie accettare.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            <div className="flex gap-2">
              <Button onClick={acceptAll} className="bg-blog-hero hover:bg-blog-hero/90">
                Accetta Tutti
              </Button>
              
              <Button variant="outline" onClick={acceptNecessaryOnly}>
                Solo Necessari
              </Button>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Settings className="h-4 w-4 mr-2" />
                    Personalizza
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Preferenze Cookie</DialogTitle>
                    <DialogDescription>
                      Scegli quali tipi di cookie vuoi accettare.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="necessary" className="font-medium">
                          Cookie Necessari
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Richiesti per il funzionamento del sito
                        </p>
                      </div>
                      <Switch
                        id="necessary"
                        checked={true}
                        disabled={true}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="analytics" className="font-medium">
                          Cookie di Analisi
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Ci aiutano a migliorare il sito
                        </p>
                      </div>
                      <Switch
                        id="analytics"
                        checked={preferences.analytics}
                        onCheckedChange={() => handlePreferenceChange('analytics')}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="marketing" className="font-medium">
                          Cookie di Marketing
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Per contenuti personalizzati
                        </p>
                      </div>
                      <Switch
                        id="marketing"
                        checked={preferences.marketing}
                        onCheckedChange={() => handlePreferenceChange('marketing')}
                      />
                    </div>
                  </div>
                  
                  <Button onClick={savePreferences} className="w-full mt-4">
                    Salva Preferenze
                  </Button>
                </DialogContent>
              </Dialog>
            </div>
            
            <div className="text-sm text-muted-foreground">
              <Link to="/privacy" className="underline hover:text-blog-hero">
                Privacy Policy
              </Link>
              {' | '}
              <Link to="/cookies" className="underline hover:text-blog-hero">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}