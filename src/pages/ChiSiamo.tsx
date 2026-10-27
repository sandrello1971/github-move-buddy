import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Mic, ChefHat, Heart, Users, Target, BookOpen } from 'lucide-react';
import { SEO } from '@/components/SEO';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { useEffect, useState } from 'react';
import DOMPurify from 'dompurify';
import { supabase } from '@/integrations/supabase/client';
import { chiSiamoDefaults, mergeChiSiamo, ChiSiamoContent } from '@/data/chiSiamoDefaults';

const Html = ({ html, className }: { html: string; className?: string }) => (
  <div className={className} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(html) }} />
);


const missionIcons = [
  { Icon: Mic, bg: 'bg-blog-accent/20' },
  { Icon: ChefHat, bg: 'bg-blog-terracotta/20' },
  { Icon: Heart, bg: 'bg-blog-muted/20' },
];
const valueIcons = [
  { Icon: BookOpen, bg: 'bg-blog-accent', fg: 'text-blog-hero' },
  { Icon: Users, bg: 'bg-blog-terracotta', fg: 'text-background' },
  { Icon: Target, bg: 'bg-blog-muted', fg: 'text-blog-hero' },
];
const calendarIcons = [
  { Icon: Mic, bg: 'bg-blog-accent/20' },
  { Icon: BookOpen, bg: 'bg-blog-terracotta/20' },
  { Icon: Target, bg: 'bg-blog-muted/20' },
  { Icon: ChefHat, bg: 'bg-blog-accent/20' },
];

const ChiSiamo = () => {
  const [c, setC] = useState<ChiSiamoContent>(chiSiamoDefaults);

  useEffect(() => {
    supabase.from('site_content').select('content').eq('key', 'chi_siamo').maybeSingle()
      .then(({ data }) => { if (data?.content) setC(mergeChiSiamo(data.content as any)); });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Chi Siamo - Sabadvance"
        description="Scopri la storia, la missione e i valori che guidano Sabadvance nel suo viaggio attraverso curiosità, cultura e conoscenza. Conosci Sabrina Bertolani, fondatrice del magazine."
        keywords="chi siamo, sabadvance, sabrina bertolani, magazine italiano, mission, valori"
        canonical="/chi-siamo"
      />
      <Header />
      <div className="container mx-auto px-4 pt-4">
        <Breadcrumbs items={[{ label: 'Chi Siamo' }]} />
      </div>

      <section className="content-section-alt">
        <div className="container mx-auto max-w-5xl text-center hero-fade-in">
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold text-blog-hero mb-8 leading-tight">{c.heroTitle}</h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-16 max-w-3xl mx-auto leading-relaxed">{c.heroSubtitle}</p>
        </div>
      </section>

      <section className="content-section bg-gradient-to-br from-blog-accent/10 to-blog-muted/20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-blog-hero mb-6">{c.missionTitle}</h2>
            <Html html={c.missionIntro} className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed" />
          </div>
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {c.missionBoxes.map((b, i) => {
              const { Icon, bg } = missionIcons[i];
              return (
                <div key={i} className="p-6 text-center">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-full ${bg} flex items-center justify-center`}>
                    <Icon className="h-8 w-8 text-blog-hero" />
                  </div>
                  <h3 className="text-xl font-bold text-blog-hero mb-3">{b.title}</h3>
                  <p className="text-muted-foreground">{b.text}</p>
                </div>
              );
            })}
          </div>
          <Html html={c.missionClosing} className="text-center text-lg text-muted-foreground leading-relaxed max-w-4xl mx-auto" />
        </div>
      </section>

      <section className="content-section-alt bg-gradient-to-br from-blog-muted/5 to-blog-accent/5">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-bold text-blog-hero mb-6">{c.valuesTitle}</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">{c.valuesSubtitle}</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {c.values.map((v, i) => {
              const { Icon, bg, fg } = valueIcons[i];
              return (
                <Card key={i} className="border-0 shadow-lg card-hover h-full">
                  <CardContent className="p-8">
                    <div className={`w-16 h-16 mb-6 rounded-2xl ${bg} shadow-lg flex items-center justify-center`}>
                      <Icon className={`h-8 w-8 ${fg}`} />
                    </div>
                    <h3 className="text-2xl font-bold text-blog-hero mb-4">{v.title}</h3>
                    <p className="text-muted-foreground text-lg leading-relaxed">{v.text}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="content-section bg-gradient-to-br from-blog-terracotta/5 to-blog-muted/5">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-blog-hero mb-6">{c.presentationTitle}</h2>
          </div>
          <div className="prose prose-lg max-w-none text-lg text-muted-foreground leading-relaxed space-y-6">
            <Html html={c.presentationIntro} />
            <div className="my-12">
              <p className="mb-8 text-center">{c.calendarIntro}</p>
              <div className="grid md:grid-cols-2 gap-8 not-prose text-muted-foreground">
                {c.calendar.map((d, i) => {
                  const { Icon, bg } = calendarIcons[i];
                  return (
                    <Card key={i} className="border-0 shadow-lg card-hover">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <div className={`w-12 h-12 rounded-full ${bg} flex items-center justify-center`}>
                            <Icon className="h-6 w-6 text-blog-hero" />
                          </div>
                          <h4 className="text-xl font-bold text-blog-hero">{d.title}</h4>
                        </div>
                        <Html html={d.text} className="space-y-2 [&_small]:text-sm" />
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
            <Html html={c.presentationOutro} />
            <div className="mt-12">
              <h3 className="text-3xl font-bold text-blog-hero mb-6 text-center">{c.salottoTitle}</h3>
              <Html html={c.salottoText} />
            </div>
          </div>
        </div>
      </section>

      <section className="content-section bg-gradient-to-br from-blog-hero/5 to-blog-accent/5">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-blog-hero mb-6">{c.sabrinaTitle}</h2>
            <p className="text-xl text-muted-foreground mb-8">{c.sabrinaSubtitle}</p>
          </div>
          <div className="max-w-none">
            <img 
                src="/lovable-uploads/16aab4aa-5d80-4927-b8a5-bf9aa180f3a0.png" 
                alt="Sabrina Bertolani - Giornalista e fondatrice di Sabadvance" 
                loading="lazy"
                className="float-left w-80 h-auto rounded-2xl shadow-2xl mr-8 mb-6"
              />
            <Html html={c.sabrinaBio} className="prose prose-lg max-w-none text-lg text-muted-foreground leading-relaxed" />
            <div className="clear-both"></div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ChiSiamo;
