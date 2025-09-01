import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RichTextEditor } from '@/components/RichTextEditor';
import { ImageUpload } from '@/components/ImageUpload';
import { DatePicker } from '@/components/DatePicker';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Save, Eye } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Category {
  id: string;
  name: string;
  slug: string;
}

const CreatePost = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [featuredImage, setFeaturedImage] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [status, setStatus] = useState<'draft' | 'published'>('draft');
  const [publishedDate, setPublishedDate] = useState<Date | undefined>(undefined);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    fetchCategories();
  }, [user, navigate]);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast({
        title: "Errore",
        description: "Impossibile caricare le categorie",
        variant: "destructive",
      });
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const slug = generateSlug(title);
      const publishedAt = status === 'published' 
        ? (publishedDate ? publishedDate.toISOString() : new Date().toISOString())
        : null;

      const { data: newPost, error } = await supabase
        .from('posts')
        .insert({
          title,
          slug,
          content,
          excerpt,
          featured_image: featuredImage || null,
          author_id: user.id,
          status,
          published_at: publishedAt,
        })
        .select()
        .single();

      if (error) throw error;

      // Aggiungi le categorie selezionate
      if (selectedCategories.length > 0) {
        const { error: categoriesError } = await supabase
          .from('post_categories')
          .insert(
            selectedCategories.map(categoryId => ({
              post_id: newPost.id,
              category_id: categoryId
            }))
          );

        if (categoriesError) throw categoriesError;
      }

      toast({
        title: "Successo",
        description: `Post ${status === 'published' ? 'pubblicato' : 'salvato come bozza'} con successo`,
      });

      navigate('/admin');
    } catch (error) {
      console.error('Error creating post:', error);
      toast({
        title: "Errore",
        description: "Impossibile salvare il post",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link to="/admin">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Torna all'Admin
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-blog-hero">Crea Nuovo Post</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="title">Titolo *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Inserisci il titolo del post"
                  required
                />
              </div>

              <div>
                <Label htmlFor="excerpt">Estratto</Label>
                <Textarea
                  id="excerpt"
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Breve descrizione del post"
                  rows={3}
                />
              </div>

              <ImageUpload
                onImageUploaded={setFeaturedImage}
                currentImage={featuredImage}
              />

              <div>
                <Label>Categorie</Label>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  {categories.map((category) => (
                    <div key={category.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={category.id}
                        checked={selectedCategories.includes(category.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedCategories([...selectedCategories, category.id]);
                          } else {
                            setSelectedCategories(selectedCategories.filter(id => id !== category.id));
                          }
                        }}
                      />
                      <Label htmlFor={category.id} className="text-sm font-normal cursor-pointer">
                        {category.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <RichTextEditor
                  id="content"
                  label="Contenuto *"
                  value={content}
                  onChange={setContent}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="status">Stato</Label>
                  <Select value={status} onValueChange={(value: 'draft' | 'published') => setStatus(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Bozza</SelectItem>
                      <SelectItem value="published">Pubblicato</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {status === 'published' && (
                  <div>
                    <DatePicker
                      date={publishedDate}
                      onDateChange={setPublishedDate}
                      label="Data di pubblicazione"
                      placeholder="Seleziona data (default: oggi)"
                    />
                  </div>
                )}
              </div>

              <div className="flex gap-4">
                <Button type="submit" disabled={loading}>
                  <Save className="h-4 w-4 mr-2" />
                  {loading ? 'Salvando...' : 'Salva Post'}
                </Button>
                
                {status === 'published' && (
                  <Button type="button" variant="outline" onClick={() => {
                    const slug = generateSlug(title);
                    if (slug) {
                      window.open(`/blog/${slug}`, '_blank');
                    }
                  }}>
                    <Eye className="h-4 w-4 mr-2" />
                    Anteprima
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default CreatePost;