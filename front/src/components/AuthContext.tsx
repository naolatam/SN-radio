import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '../services/auth.service';
import { userService } from '../services/user.service';
import { UserRole, User } from '@/types/shared.types';


interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: () => Promise<void>;
  register: (pseudo: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  getAllUsers: () => Promise<User[]>;
  deleteUser: (userId: string) => Promise<boolean>;
  updateUserRole: (userId: string, role: UserRole) => Promise<boolean>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fonction pour rafraîchir le profil utilisateur
  const refreshProfile = async () => {
    try {
      const session = await authService.getSession();
      if (session?.user) {
        // Better Auth doesn't have role by default, we need to get it from user service
        const userProfile = await userService.getProfile();
        setUser({
          id: session.user.id,
          name: session.user.name,
          email: session.user.email,
          emailVerified: session.user.emailVerified,
          image: session.user.image ?? null,
          role: userProfile?.role || UserRole.MEMBER,
          createdAt: session.user.createdAt,
          updatedAt: session.user.updatedAt,
        });
      } else {
        setUser(null);
      }
    } catch (error) {
      console.log('Erreur lors du rafraîchissement du profil:', error);
      setUser(null);
    }
  };

  // Vérifier la session au chargement
  useEffect(() => {
    const initAuth = async () => {
      try {
        await refreshProfile();
      } catch (error) {
        console.log('Aucune session active:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const result = await authService.signIn({ email, password });
      
      if (result.success) {
        await refreshProfile();
        return { success: true };
      }

      return { success: false, error: result.error || 'Email ou mot de passe incorrect' };
    } catch (error) {
      console.log('Erreur lors de la connexion:', error);
      return { success: false, error: 'Erreur de connexion' };
    }
  };

  const loginWithGoogle = async (): Promise<void> => {
    try {
      await authService.signInWithGoogle();
    } catch (error) {
      console.log('Erreur lors de la connexion Google:', error);
      throw error;
    }
  };

  const register = async (pseudo: string, email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const result = await authService.signUp({
        name: pseudo,
        email,
        password,
      });

      if (result.success) {
        // Connecter automatiquement l'utilisateur après l'inscription
        await refreshProfile();
        return { success: true };
      }

      return { success: false, error: result.error || 'Erreur lors de la création du compte' };
    } catch (error) {
      console.log('Erreur lors de l\'inscription:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la création du compte';
      return { success: false, error: errorMessage };
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await authService.signOut();
      setUser(null);
    } catch (error) {
      console.log('Erreur lors de la déconnexion:', error);
      setUser(null);
    }
  };

  const getAllUsers = async (): Promise<User[]> => {
    try {
      const users = await userService.getAll();
      return users;
    } catch (error) {
      console.log('Erreur lors de la récupération des utilisateurs:', error);
      return [];
    }
  };

  const deleteUser = async (userId: string): Promise<boolean> => {
    try {
      const response = await userService.delete(userId);
      return response.success;
    } catch (error) {
      console.log('Erreur lors de la suppression de l\'utilisateur:', error);
      return false;
    }
  };

  const updateUserRole = async (userId: string, role: UserRole): Promise<boolean> => {
    try {
      const response = await userService.updateRole(userId, role);
      return response.success;
    } catch (error) {
      console.log('Erreur lors du changement de rôle:', error);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      loginWithGoogle,
      register,
      logout,
      getAllUsers,
      deleteUser,
      updateUserRole,
      refreshProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}