import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Shield, Users, Crown, Edit, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: string;
  email: string;
  full_name: string | null;
  created_at: string;
  roles: string[];
}

const ManageUsers = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editForm, setEditForm] = useState({ full_name: '' });
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    checkAdminStatus();
  }, [user, navigate]);

  const checkAdminStatus = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'admin')
        .single();

      if (data) {
        setIsAdmin(true);
        fetchUsers();
      } else {
        toast({
          title: "Accesso negato",
          description: "Solo gli admin possono gestire gli utenti",
          variant: "destructive",
        });
        navigate('/admin');
      }
    } catch (error) {
      console.error('Error checking admin status:', error);
      navigate('/admin');
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // Ottieni utenti con email tramite auth.users (solo admin può accedervi)
      const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
      
      if (authError) {
        // Fallback: usa solo i profili se non abbiamo accesso admin
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false });

        if (profilesError) throw profilesError;

        // Ottieni i ruoli
        const { data: roles, error: rolesError } = await supabase
          .from('user_roles')
          .select('user_id, role');

        if (rolesError) throw rolesError;

        const usersWithRoles = profiles?.map(profile => {
          const userRoles = roles?.filter(role => role.user_id === profile.user_id) || [];
          return {
            id: profile.user_id,
            email: 'Email non disponibile (accesso limitato)',
            full_name: profile.full_name,
            created_at: profile.created_at,
            roles: userRoles.map(r => r.role)
          };
        }) || [];

        setUsers(usersWithRoles);
      } else {
        // Se abbiamo accesso admin, ottieni anche i profili e ruoli
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('*');

        const { data: roles, error: rolesError } = await supabase
          .from('user_roles')
          .select('user_id, role');

        if (profilesError || rolesError) {
          throw profilesError || rolesError;
        }

        // Combina i dati con le email reali
        const usersWithRoles = authUsers.users.map(authUser => {
          const profile = profiles?.find(p => p.user_id === authUser.id);
          const userRoles = roles?.filter(role => role.user_id === authUser.id) || [];
          
          return {
            id: authUser.id,
            email: authUser.email || 'Email non disponibile',
            full_name: profile?.full_name || authUser.user_metadata?.full_name || 'Nome non disponibile',
            created_at: profile?.created_at || authUser.created_at,
            roles: userRoles.map(r => r.role)
          };
        }).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

        setUsers(usersWithRoles);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Errore",
        description: "Impossibile caricare gli utenti",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId: string, newRole: 'admin' | 'editor' | 'subscriber') => {
    try {
      // Prima rimuovi tutti i ruoli dell'utente
      await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId);

      // Poi aggiungi il nuovo ruolo
      const { error } = await supabase
        .from('user_roles')
        .insert({
          user_id: userId,
          role: newRole
        });

      if (error) throw error;

      toast({
        title: "Successo",
        description: `Ruolo aggiornato a ${newRole}`,
      });

      fetchUsers(); // Ricarica la lista
    } catch (error) {
      console.error('Error updating role:', error);
      toast({
        title: "Errore",
        description: "Impossibile aggiornare il ruolo",
        variant: "destructive",
      });
    }
  };

  const updateUserProfile = async (userId: string, updates: { full_name: string }) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: updates.full_name,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId);

      if (error) throw error;

      toast({
        title: "Successo",
        description: "Profilo utente aggiornato",
      });

      fetchUsers(); // Ricarica la lista
      setIsEditDialogOpen(false);
      setEditingUser(null);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Errore",
        description: "Impossibile aggiornare il profilo",
        variant: "destructive",
      });
    }
  };

  const deleteUser = async (userId: string) => {
    if (!confirm('Sei sicuro di voler eliminare questo utente? Questa azione non può essere annullata.')) {
      return;
    }

    try {
      // Prima elimina i ruoli dell'utente
      await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId);

      // Poi elimina il profilo
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('user_id', userId);

      if (error) throw error;

      toast({
        title: "Successo",
        description: "Utente eliminato",
      });

      fetchUsers(); // Ricarica la lista
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        title: "Errore",
        description: "Impossibile eliminare l'utente",
        variant: "destructive",
      });
    }
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setEditForm({ full_name: user.full_name || '' });
    setIsEditDialogOpen(true);
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'editor':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'subscriber':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Crown className="h-3 w-3" />;
      case 'editor':
        return <Shield className="h-3 w-3" />;
      case 'subscriber':
        return <Users className="h-3 w-3" />;
      default:
        return null;
    }
  };

  if (!user || !isAdmin) {
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
            <CardTitle className="text-2xl text-blog-hero flex items-center gap-2">
              <Users className="h-6 w-6" />
              Gestione Utenti
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">Caricamento utenti...</div>
            ) : (
              <div className="space-y-4">
                {users.map((userData) => (
                  <div key={userData.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="font-semibold">
                        {userData.full_name || 'Nome non disponibile'}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {userData.email}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Iscritto: {new Date(userData.created_at).toLocaleDateString('it-IT')}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="flex gap-1">
                        {userData.roles.map((role) => (
                          <Badge key={role} className={getRoleColor(role)}>
                            <div className="flex items-center gap-1">
                              {getRoleIcon(role)}
                              {role}
                            </div>
                          </Badge>
                        ))}
                        {userData.roles.length === 0 && (
                          <Badge variant="secondary">Nessun ruolo</Badge>
                        )}
                      </div>
                      
                      <Select
                        value={userData.roles[0] || 'subscriber'}
                        onValueChange={(value: 'admin' | 'editor' | 'subscriber') => 
                          updateUserRole(userData.id, value)
                        }
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="subscriber">Subscriber</SelectItem>
                          <SelectItem value="editor">Editor</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditUser(userData)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteUser(userData.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                
                {users.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    Nessun utente trovato
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifica Utente</DialogTitle>
          </DialogHeader>
          {editingUser && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="full_name">Nome Completo</Label>
                <Input
                  id="full_name"
                  value={editForm.full_name}
                  onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })}
                  placeholder="Nome completo"
                />
              </div>
              <div className="text-sm text-muted-foreground">
                <div>Email: {editingUser.email}</div>
                <div>Iscritto: {new Date(editingUser.created_at).toLocaleDateString('it-IT')}</div>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsEditDialogOpen(false)}
                >
                  Annulla
                </Button>
                <Button
                  onClick={() => updateUserProfile(editingUser.id, editForm)}
                >
                  Salva
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManageUsers;