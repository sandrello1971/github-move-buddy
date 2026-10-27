import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RichTextEditor } from '@/components/RichTextEditor';
import { toast } from '@/hooks/use-toast';
import { chiSiamoDefaults, mergeChiSiamo, ChiSiamoContent, SITE_COLOR_MAP } from '@/data/chiSiamoDefaults';

type BoxKey = 'missionBoxes' | 'values' | 'calendar';

const EditChiSiamo = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [c, setC] = useState<ChiSiamoContent>(chiSiamoDefaults);
  const [ready, setReady] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!user) { navigate('/auth'); return; }
    (async () => {
      const { data: role } = await supabase.from('user_roles').select('role')
        .eq('user_id', user.id).eq('role', 'admin').maybeSingle();
      if (!role) { navigate('/admin'); return; }
      const { data } = await supabase.from('site_content').select('content').eq('key', 'chi_siamo').maybeSingle();
      setC(mergeChiSiamo(data?.content as any));
      setReady(true);
    })();
  }, [user, loading, navigate]);

  const set = <K extends keyof ChiSiamoContent>(k: K, v: ChiSiamoContent[K]) => setC((p) => ({ ...p, [k]: v }));
  const setBox = (k: BoxKey, i: number, field: 'title' | 'text', v: string) =>
    setC((p) => ({ ...p, [k]: p[k].map((b, j) => (j === i ? { ...b, [field]: v } : b)) }));

  const save = async () => {
    setSaving(true);
    const { error } = await supabase.from('site_content')
      .upsert({ key: 'chi_siamo', content: c as any }, { onConflict: 'key' });
    setSaving(false);
    toast(error ? { title: 'Errore nel salvataggio', description: error.message, variant: 'destructive' }
      : { title: 'Pagina Chi Siamo salvata' });
  };

  const text = (label: string, k: keyof ChiSiamoContent, long = false) => (
    <div className="space-y-1">
      <Label>{label}</Label>
      {long
        ? <Textarea value={c[k] as string} onChange={(e) => set(k, e.target.value as any)} />
        : <Input value={c[k] as string} onChange={(e) => set(k, e.target.value as any)} />}
    </div>
  );
  const rich = (label: string, k: keyof ChiSiamoContent, compact = true) => (
    <RichTextEditor label={label} value={c[k] as string} onChange={(v) => set(k, v as any)}
      colorMap={SITE_COLOR_MAP} compact={compact} />
  );
  const boxes = (k: BoxKey, richText = false) => (
    <div className="grid md:grid-cols-2 gap-4">
      {c[k].map((b, i) => (
        <div key={i} className="border rounded-lg p-4 space-y-2">
          <Label>Titolo riquadro {i + 1}</Label>
          <Input value={b.title} onChange={(e) => setBox(k, i, 'title', e.target.value)} />
          {richText
            ? <RichTextEditor label="Testo" value={b.text} onChange={(v) => setBox(k, i, 'text', v)} colorMap={SITE_COLOR_MAP} compact />
            : <><Label>Testo</Label><Textarea value={b.text} onChange={(e) => setBox(k, i, 'text', e.target.value)} /></>}
        </div>
      ))}
    </div>
  );

  if (!ready) return <div className="min-h-screen bg-background"><Header /><p className="p-8">Caricamento…</p></div>;

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <Card><CardHeader><CardTitle className="text-blog-hero">{title}</CardTitle></CardHeader>
      <CardContent className="space-y-4">{children}</CardContent></Card>
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-5xl space-y-6">
        <div className="flex flex-wrap justify-between items-center gap-2 sticky top-0 z-10 bg-background py-3">
          <div>
            <h1 className="text-3xl font-bold text-blog-hero">Modifica Chi Siamo</h1>
            <p className="text-sm text-muted-foreground">Font, dimensioni e colori dei titoli restano quelli del sito. Nei testi puoi evidenziare parole con i colori della palette.</p>
          </div>
          <div className="flex gap-2">
            <Link to="/admin"><Button variant="ghost">Indietro</Button></Link>
            <Link to="/chi-siamo" target="_blank"><Button variant="outline">Vedi pagina</Button></Link>
            <Button onClick={save} disabled={saving}>{saving ? 'Salvataggio…' : 'Salva'}</Button>
          </div>
        </div>

        {Section({ title: 'Intestazione', children: <>{text('Titolo', 'heroTitle')}{text('Sottotitolo', 'heroSubtitle', true)}</> })}
        {Section({ title: 'La Nostra Missione', children: <>
          {text('Titolo', 'missionTitle')}{rich('Introduzione', 'missionIntro')}{boxes('missionBoxes')}{rich('Frase finale', 'missionClosing')}
        </> })}
        {Section({ title: 'I Nostri Valori', children: <>
          {text('Titolo', 'valuesTitle')}{text('Sottotitolo', 'valuesSubtitle')}{boxes('values')}
        </> })}
        {Section({ title: 'Presentazione di Sabadvance', children: <>
          {text('Titolo', 'presentationTitle')}{rich('Testo introduttivo', 'presentationIntro', false)}
          {text('Introduzione calendario', 'calendarIntro', true)}{boxes('calendar', true)}
          {rich('Testo dopo il calendario', 'presentationOutro')}
          {text('Titolo "Il Salotto"', 'salottoTitle')}{rich('Testo "Il Salotto"', 'salottoText')}
        </> })}
        {Section({ title: 'Sabrina Bertolani', children: <>
          {text('Titolo', 'sabrinaTitle')}{text('Sottotitolo', 'sabrinaSubtitle')}{rich('Biografia', 'sabrinaBio', false)}
        </> })}
      </main>
    </div>
  );
};

export default EditChiSiamo;
