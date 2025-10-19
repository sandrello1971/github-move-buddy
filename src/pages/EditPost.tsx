import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate, useParams, Link } from 'react-router-dom';
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
import { ArrowLeft, Save, Eye, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  featured_image: string | null;
  status: string;
  published_at: string | null;
  post_categories: {
    categories: {
      id: string;
      name: string;
      slug: string;
    };
  }[];
}

const EditPost = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  
  const [post, setPost] = useState<Post | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [featuredImage, setFeaturedImage] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [status, setStatus] = useState<'draft' | 'published'>('draft');
  const [publishedDate, setPublishedDate] = useState<Date | undefined>(undefined);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    if (id) {
      fetchPost();
      fetchCategories();
    }
  }, [user, navigate, id]);

  const fetchPost = async () => {
    if (!id) return;
    
    try {
      // Verifica se l'utente è admin
      const { data: userRole } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user?.id)
        .maybeSingle();

      const isAdmin = userRole?.role === 'admin';

      // Se è admin, non filtra per author_id
      let query = supabase
        .from('posts')
        .select(`
          *,
          post_categories(
            categories(id, name, slug)
          )
        `)
        .eq('id', id);

      if (!isAdmin) {
        query = query.eq('author_id', user?.id);
      }

      const { data, error } = await query.single();

      if (error) throw error;
      
      setPost(data);
      setTitle(data.title);
      setContent(data.content);
      setExcerpt(data.excerpt || '');
      setFeaturedImage(data.featured_image || '');
      setSelectedCategories(data.post_categories?.map(pc => pc.categories.id) || []);
      setStatus(data.status as 'draft' | 'published');
      setPublishedDate(data.published_at ? new Date(data.published_at) : undefined);
    } catch (error) {
      console.error('Error fetching post:', error);
      toast({
        title: "Errore",
        description: "Post non trovato o non autorizzato",
        variant: "destructive",
      });
      navigate('/admin');
    } finally {
      setInitialLoading(false);
    }
  };

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
    if (!user || !post) return;

    setLoading(true);
    try {
      const slug = generateSlug(title);
      const wasPublished = post.status === 'published';
      const isBeingPublished = status === 'published';
      const publishedAt = isBeingPublished 
        ? (publishedDate ? publishedDate.toISOString() : 
           (wasPublished && post.published_at ? post.published_at : new Date().toISOString()))
        : null;

      const { error: updateError } = await supabase
        .from('posts')
        .update({
          title,
          slug,
          content,
          excerpt,
          featured_image: featuredImage || null,
          status,
          published_at: publishedAt,
        })
        .eq('id', post.id);

      if (updateError) throw updateError;

      // Aggiorna le categorie
      // Prima rimuovi tutte le categorie esistenti
      const { error: deleteError } = await supabase
        .from('post_categories')
        .delete()
        .eq('post_id', post.id);

      if (deleteError) throw deleteError;

      // Poi aggiungi le nuove categorie selezionate
      if (selectedCategories.length > 0) {
        const { error: insertError } = await supabase
          .from('post_categories')
          .insert(
            selectedCategories.map(categoryId => ({
              post_id: post.id,
              category_id: categoryId
            }))
          );

        if (insertError) throw insertError;
      }

      toast({
        title: "Successo",
        description: "Post aggiornato con successo",
      });

      navigate('/admin');
    } catch (error) {
      console.error('Error updating post:', error);
      toast({
        title: "Errore",
        description: "Impossibile aggiornare il post",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!post) return;

    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', post.id);

      if (error) throw error;

      toast({
        title: "Successo",
        description: "Post eliminato con successo",
      });

      navigate('/admin');
    } catch (error) {
      console.error('Error deleting post:', error);
      toast({
        title: "Errore",
        description: "Impossibile eliminare il post",
        variant: "destructive",
      });
    }
  };

  if (!user || initialLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">Caricamento...</div>
        </main>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">Post non trovato</div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6 flex justify-between items-center">
          <Link to="/admin">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Torna all'Admin
            </Button>
          </Link>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">
                <Trash2 className="h-4 w-4 mr-2" />
                Elimina Post
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Sei sicuro?</AlertDialogTitle>
                <AlertDialogDescription>
                  Questa azione non può essere annullata. Il post verrà eliminato permanentemente.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annulla</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  Elimina
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-blog-hero">Modifica Post</CardTitle>
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
                
                <div>
                  <DatePicker
                    date={publishedDate}
                    onDateChange={setPublishedDate}
                    label="Data di pubblicazione"
                    placeholder="Seleziona data"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <Button type="submit" disabled={loading}>
                  <Save className="h-4 w-4 mr-2" />
                  {loading ? 'Salvando...' : 'Salva Modifiche'}
                </Button>
                
                {post.slug && (
                  <Button type="button" variant="outline" onClick={() => {
                    window.open(`/blog/${post.slug}`, '_blank');
                  }}>
                    <Eye className="h-4 w-4 mr-2" />
                    Visualizza
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

export default EditPost;