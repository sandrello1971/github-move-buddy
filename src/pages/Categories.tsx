import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Plus, Edit, Trash2, Save, X } from 'lucide-react';
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
  description: string | null;
  created_at: string;
}

const Categories = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [newCategory, setNewCategory] = useState({ name: '', description: '' });
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editForm, setEditForm] = useState({ name: '', description: '' });
  const [submitting, setSubmitting] = useState(false);

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
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.name.trim()) return;

    setSubmitting(true);
    try {
      const slug = generateSlug(newCategory.name);
      
      const { error } = await supabase
        .from('categories')
        .insert({
          name: newCategory.name.trim(),
          slug,
          description: newCategory.description.trim() || null,
        });

      if (error) throw error;

      toast({
        title: "Successo",
        description: "Categoria creata con successo",
      });

      setNewCategory({ name: '', description: '' });
      fetchCategories();
    } catch (error) {
      console.error('Error creating category:', error);
      toast({
        title: "Errore",
        description: "Impossibile creare la categoria",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory || !editForm.name.trim()) return;

    setSubmitting(true);
    try {
      const slug = generateSlug(editForm.name);
      
      const { error } = await supabase
        .from('categories')
        .update({
          name: editForm.name.trim(),
          slug,
          description: editForm.description.trim() || null,
        })
        .eq('id', editingCategory.id);

      if (error) throw error;

      toast({
        title: "Successo",
        description: "Categoria aggiornata con successo",
      });

      setEditingCategory(null);
      setEditForm({ name: '', description: '' });
      fetchCategories();
    } catch (error) {
      console.error('Error updating category:', error);
      toast({
        title: "Errore",
        description: "Impossibile aggiornare la categoria",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', categoryId);

      if (error) throw error;

      toast({
        title: "Successo",
        description: "Categoria eliminata con successo",
      });

      fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
      toast({
        title: "Errore",
        description: "Impossibile eliminare la categoria",
        variant: "destructive",
      });
    }
  };

  const startEdit = (category: Category) => {
    setEditingCategory(category);
    setEditForm({ name: category.name, description: category.description || '' });
  };

  const cancelEdit = () => {
    setEditingCategory(null);
    setEditForm({ name: '', description: '' });
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

        <div className="grid gap-6">
          {/* Crea nuova categoria */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-blog-hero flex items-center">
                <Plus className="h-5 w-5 mr-2" />
                Crea Nuova Categoria
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateCategory} className="space-y-4">
                <div>
                  <Label htmlFor="new-name">Nome *</Label>
                  <Input
                    id="new-name"
                    value={newCategory.name}
                    onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                    placeholder="Nome della categoria"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="new-description">Descrizione</Label>
                  <Input
                    id="new-description"
                    value={newCategory.description}
                    onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                    placeholder="Breve descrizione della categoria"
                  />
                </div>
                <Button type="submit" disabled={submitting}>
                  <Plus className="h-4 w-4 mr-2" />
                  {submitting ? 'Creazione...' : 'Crea Categoria'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Lista categorie */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-blog-hero">Categorie Esistenti</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-4">Caricamento...</div>
              ) : categories.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Nessuna categoria trovata. Crea la prima categoria usando il form sopra.
                </div>
              ) : (
                <div className="space-y-4">
                  {categories.map((category) => (
                    <div key={category.id} className="border rounded-lg p-4">
                      {editingCategory?.id === category.id ? (
                        <form onSubmit={handleEditCategory} className="space-y-4">
                          <div>
                            <Label htmlFor="edit-name">Nome</Label>
                            <Input
                              id="edit-name"
                              value={editForm.name}
                              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="edit-description">Descrizione</Label>
                            <Input
                              id="edit-description"
                              value={editForm.description}
                              onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                            />
                          </div>
                          <div className="flex gap-2">
                            <Button type="submit" size="sm" disabled={submitting}>
                              <Save className="h-4 w-4 mr-2" />
                              Salva
                            </Button>
                            <Button type="button" variant="outline" size="sm" onClick={cancelEdit}>
                              <X className="h-4 w-4 mr-2" />
                              Annulla
                            </Button>
                          </div>
                        </form>
                      ) : (
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold text-lg">{category.name}</h3>
                            {category.description && (
                              <p className="text-muted-foreground">{category.description}</p>
                            )}
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant="secondary">/{category.slug}</Badge>
                              <span className="text-xs text-muted-foreground">
                                Creata il {new Date(category.created_at).toLocaleDateString('it-IT')}
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => startEdit(category)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="destructive" size="sm">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Elimina categoria</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Sei sicuro di voler eliminare la categoria "{category.name}"? 
                                    Questa azione non può essere annullata.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Annulla</AlertDialogCancel>
                                  <AlertDialogAction 
                                    onClick={() => handleDeleteCategory(category.id)}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  >
                                    Elimina
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Categories;