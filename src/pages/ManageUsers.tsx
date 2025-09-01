import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Shield, Users, Crown } from 'lucide-react';
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
      // Prima ottieni utenti con i loro profili
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      // Poi ottieni i ruoli per ogni utente
      const { data: roles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role');

      if (rolesError) throw rolesError;

      // Combina i dati
      const usersWithRoles = profiles?.map(profile => {
        const userRoles = roles?.filter(role => role.user_id === profile.user_id) || [];
        return {
          id: profile.user_id,
          email: profile.user_id, // Dovremmo ottenere l'email dall'auth, per ora usiamo l'ID
          full_name: profile.full_name,
          created_at: profile.created_at,
          roles: userRoles.map(r => r.role)
        };
      }) || [];

      setUsers(usersWithRoles);
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
                        ID: {userData.id}
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
    </div>
  );
};

export default ManageUsers;