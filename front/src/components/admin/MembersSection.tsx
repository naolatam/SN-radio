import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Shield, UserX, AlertTriangle } from 'lucide-react';
import { Button } from '../ui/button';
import { UserRole } from '@/types/shared.types';
import { httpClient } from '@/lib/http.client';
import { toast } from 'sonner';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
  lastLogin?: string;
}

export default function MembersSection() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const response = await httpClient.get<{ users: UserProfile[] }>('/users');
      if (response.success && response.data) {
        setUsers(response.data.users || []);
      }
    } catch (error) {
      console.error('Error loading users:', error);
      toast.error('Erreur lors du chargement des utilisateurs');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer l'utilisateur "${userName}" ?\n\nCette action est irréversible.`)) {
      return;
    }

    try {
      const response = await httpClient.delete(`/users/${userId}`);
      if (response.success) {
        toast.success(`Utilisateur ${userName} supprimé avec succès`);
        await loadUsers();
      } else {
        toast.error(response.error || 'Erreur lors de la suppression');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Erreur lors de la suppression de l\'utilisateur');
    }
  };

  const handleChangeUserRole = async (userId: string, newRole: UserRole, userName: string) => {
    try {
      const response = await httpClient.put(`/users/${userId}/role`, { role: newRole });
      if (response.success) {
        const roleLabel = newRole === UserRole.ADMIN ? 'Administrateur' : newRole === UserRole.STAFF ? 'Staff' : 'Membre';
        toast.success(`Rôle de ${userName} changé vers ${roleLabel}`);
        await loadUsers();
      } else {
        toast.error(response.error || 'Erreur lors du changement de rôle');
      }
    } catch (error) {
      console.error('Error changing user role:', error);
      toast.error('Erreur lors du changement de rôle');
    }
  };

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case UserRole.ADMIN:
        return <span className="px-2 py-1 bg-red-600 text-white text-xs rounded">Administrateur</span>;
      case UserRole.STAFF:
        return <span className="px-2 py-1 bg-yellow-600 text-white text-xs rounded">Staff</span>;
      default:
        return <span className="px-2 py-1 bg-gray-600 text-white text-xs rounded">Membre</span>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-400">Chargement des membres...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Gestion des Membres</h2>
          <p className="text-sm text-gray-400 mt-1">
            {users.length} membre{users.length > 1 ? 's' : ''} inscrit{users.length > 1 ? 's' : ''}
          </p>
        </div>
      </div>

      <div className="grid gap-4">
        {users.map((user) => (
          <motion.div
            key={user.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{user.name}</h3>
                    <p className="text-sm text-gray-400">{user.email}</p>
                    <div className="flex items-center space-x-3 mt-1">
                      {getRoleBadge(user.role)}
                      <span className="text-xs text-gray-500">
                        Inscrit le {formatDate(user.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {user.role !== UserRole.ADMIN ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleChangeUserRole(user.id, UserRole.ADMIN, user.name)}
                      className="text-green-400 hover:text-green-300 hover:bg-green-900/20"
                    >
                      <Shield className="h-4 w-4 mr-2" />
                      Promouvoir Admin
                    </Button>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleChangeUserRole(user.id, UserRole.MEMBER, user.name)}
                      className="text-yellow-400 hover:text-yellow-300 hover:bg-yellow-900/20"
                    >
                      <Shield className="h-4 w-4 mr-2" />
                      Rétrograder Membre
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteUser(user.id, user.name)}
                    className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                  >
                    <UserX className="h-4 w-4 mr-2" />
                    Supprimer
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}

        {users.length === 0 && (
          <div className="text-center py-12">
            <AlertTriangle className="h-12 w-12 text-gray-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-400 mb-2">
              Aucun membre trouvé
            </h3>
            <p className="text-gray-500">
              Les membres inscrits apparaîtront ici.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
