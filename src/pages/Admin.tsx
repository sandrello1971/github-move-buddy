import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

interface Post {
  id: string;
  title: string;
  slug: string;
  status: string;
  published_at: string | null;
  created_at: string;
  post_categories: {
    categories: {
      name: string;
    };
  }[];
}

export default function Admin() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
      return;
    }

    if (user) {
      fetchPosts();
    }
  }, [user, authLoading, navigate]);

  const fetchPosts = async () => {
    try {
      // Verifica se l'utente è admin
      const { data: userRole } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user?.id)
        .single();

      const isAdmin = userRole?.role === 'admin';

      // Se è admin, mostra tutti i post, altrimenti solo i propri
      let query = supabase
        .from('posts')
        .select(`
          id,
          title,
          slug,
          status,
          published_at,
          created_at,
          post_categories(
            categories(name)
          )
        `);

      if (!isAdmin) {
        query = query.eq('author_id', user?.id);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching posts:', error);
        toast({
          title: "Errore",
          description: "Impossibile caricare i post",
          variant: "destructive",
        });
        return;
      }

      setPosts((data as unknown as Post[]) || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const deletePost = async (id: string) => {
    if (!confirm('Sei sicuro di voler eliminare questo post?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', id);

      if (error) {
        toast({
          title: "Errore",
          description: "Impossibile eliminare il post",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Successo",
        description: "Post eliminato con successo",
      });

      fetchPosts();
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('it-IT', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'archived':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'published':
        return 'Pubblicato';
      case 'draft':
        return 'Bozza';
      case 'archived':
        return 'Archiviato';
      default:
        return status;
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Caricamento...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-blog-hero">Pannello Amministrazione</h1>
            <p className="text-muted-foreground mt-2">Gestisci i tuoi post e le categorie del blog</p>
          </div>
          <div className="flex gap-2">
            <Link to="/admin/users">
              <Button variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Gestisci Utenti
              </Button>
            </Link>
            <Link to="/admin/categories">
              <Button variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Gestisci Categorie
              </Button>
            </Link>
            <Link to="/admin/create-post">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nuovo Post
              </Button>
            </Link>
          </div>
        </div>

        {posts.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <h3 className="text-lg font-semibold mb-2">Nessun post trovato</h3>
              <p className="text-muted-foreground mb-4">Inizia creando il tuo primo post</p>
              <Link to="/admin/create-post">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Crea il primo post
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <Card key={post.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={getStatusColor(post.status)}>
                          {getStatusText(post.status)}
                        </Badge>
                        {post.post_categories.map((pc, index) => (
                          <Badge key={index} variant="outline">{pc.categories.name}</Badge>
                        ))}
                      </div>
                      <CardTitle className="text-xl">{post.title}</CardTitle>
                      <CardDescription>
                        Creato il {formatDate(post.created_at)}
                        {post.published_at && (
                          <> • Pubblicato il {formatDate(post.published_at)}</>
                        )}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      {post.status === 'published' && (
                        <Link to={`/blog/${post.slug}`} target="_blank">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                      )}
                      <Link to={`/admin/edit-post/${post.id}`}>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => deletePost(post.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}