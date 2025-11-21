/**
 * UserProfile - Single Responsibility: Display and manage user profile
 * Following Dependency Inversion: Uses navigation abstraction
 */
import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { X, Calendar, Shield, LogOut, Edit2, Check, Heart, Headphones } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Input } from './ui/input';
import { useAuth } from './AuthContext';
import { useTheme } from './ThemeContext';
import { useNavigation } from '@/hooks/useNavigation';
import { toast } from 'sonner';
import { UserRole, UserProfile as UserProfileType } from '@/types/shared.types';
import { userService } from '@/services/user.service';

interface UserProfileProps {
  onClose: () => void;
}

export default function UserProfile({ onClose }: UserProfileProps) {
  const { user, logout, refreshProfile } = useAuth();
  const { themeColors } = useTheme();
  const { goToAdmin } = useNavigation();
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(user?.name || '');
  const [editedImage, setEditedImage] = useState(user?.image || '');
  const [isSaving, setIsSaving] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfileType | null>(null);
  const isStaff = user?.role === UserRole.ADMIN || user?.role === UserRole.STAFF;
  // Fetch full user profile with stats on mount
  useEffect(() => {
    const fetchProfile = async () => {
      const profile = await userService.getProfile();
      if (profile) {
        setUserProfile(profile as UserProfileType);
      }
    };
    fetchProfile();
  }, []);

  const handleLogout = () => {
    logout();
    toast.success('Déconnexion réussie');
    onClose();
  };

  const handleAdminAccess = () => {
    if (user?.role === UserRole.MEMBER) return;
    goToAdmin();
    onClose();
  };

  const handleSaveProfile = async () => {
    if (!editedName.trim()) {
      toast.error('Le nom ne peut pas être vide');
      return;
    }

    setIsSaving(true);
    try {
      const response = await userService.updateProfile({
        name: editedName,
        image: editedImage || null,
      });

      if (response.success) {
        await refreshProfile();
        toast.success('Profil mis à jour avec succès');
        setIsEditing(false);
      } else {
        toast.error(response.error || 'Erreur lors de la mise à jour du profil');
      }
    } catch (error) {
      toast.error('Erreur lors de la mise à jour du profil');
      console.error('Profile update error:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setEditedName(user?.name || '');
    setEditedImage(user?.image || '');
    setIsEditing(false);
  };

  if (!user) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-md"
      >
        <Card 
          className="overflow-hidden"
          style={{ 
            backgroundColor: themeColors.background,
            borderColor: themeColors.border 
          }}
        >
          {/* Gradient Header with Avatar */}
          <div 
            className="relative flex flex-col items-center justify-center "
            style={{
              background: 'linear-gradient(135deg, #FF9A3C 35%, #007EFF 100%)'
            }}
          >
            {/* Edit / Save Buttons / Close */}
            <div className="relative w-full">
              <div className="absolute top-2 right-0 flex items-center space-x-2 mr-2">
              {isEditing ? (
                <>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleSaveProfile}
                    disabled={isSaving}
                    className="flex items-center space-x-1"
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleCancelEdit}
                    disabled={isSaving}
                    className="flex items-center space-x-1"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setIsEditing(true)}
                    className="flex items-center space-x-1"
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={onClose}
                    className="flex items-center space-x-1"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div> 
            </div> 
            {/* Avatar */}
            <Avatar className="w-24 h-24 mb-3 border-4 mt-2 border-white/20">
              <AvatarImage src={isEditing ? editedImage : user.image || undefined} alt={user.name} />
              <AvatarFallback 
                className="text-3xl font-bold"
                style={{ background: 'rgba(255, 255, 255, 0.2)', color: 'white' }}
              >
                {user.name?.charAt(0)?.toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>

            {/* User Info */}
            
              <div className="text-center mb-2">
                <h2 className="text-2xl font-bold text-white mb-1">
                  {user.name}
                </h2>
                <p className="text-white/80 text-sm">{user.email}</p>
                {user.role === UserRole.ADMIN && (
                  <div className="flex items-center justify-center mt-2 gap-1 bg-white/20 rounded-full px-3 py-1">
                    <Shield className="h-3 w-3 text-white" />
                    <span className="text-xs text-white font-medium">
                      Administrateur SN-Radio
                    </span>
                  </div>
                )}
                {user.role === UserRole.STAFF && (
                  <div className="flex items-center justify-center mt-2 gap-1 bg-white/20 rounded-full px-3 py-1">
                    <Shield className="h-3 w-3 text-white" />
                    <span className="text-xs text-white font-medium">
                      Staff SN-Radio
                    </span>
                  </div>
                )}
              </div>
          </div>

          <CardContent className="p-6 space-y-4">
            {/* Statistics Cards */}
            <div 
              className="flex items-center justify-between p-4 rounded-lg gap-1"

            >
              {/* Articles aimés */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  if (onViewLikedArticles) {
                    onViewLikedArticles();
                    onClose();
                  }
                }}
                className="flex flex-col items-center cursor-pointer w-full p-2 rounded-lg border"
                              style={{
                background: `${themeColors.button.ghost}`,
              }}
              >
                <Heart
                  className="h-6 w-6 mb-1"
                  style={{ color: '#FF6B9D' }}
                  fill="#FF6B9D"
                />
                <p className="text-xl font-bold mb-0.5" style={{ color: themeColors.text.primary }}>
                  {userProfile?.likesCount ?? 0}
                </p>
                <p className="text-xs" style={{ color: themeColors.text.secondary }}>
                  Article aimé
                </p>
              </motion.div>

              {/* Divider */}
              <div 
                className="h-12 w-px"
                style={{ backgroundColor: themeColors.border }}
              />

              {/* Jours */}
              <motion.div 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              className="flex flex-col items-center cursor-pointer w-full p-2 rounded-lg border"
                  style={{
                    background: `${themeColors.button.ghost}`,
                    }}
                >
                <Calendar
                  className="h-6 w-6 mb-1"
                  style={{ color: '#FFB84D' }}
                />
                <p className="text-xl font-bold mb-0.5" style={{ color: themeColors.text.primary }}>
                  {user.createdAt ? Math.floor((new Date().getTime() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24)) : 0}
                </p>
                <p className="text-xs" style={{ color: themeColors.text.secondary }}>
                  Jours
                </p>
              </motion.div>

             
            </div>

            {/* Membre depuis */}
            {user.createdAt && (
              <div 
                className="flex items-center gap-2 p-3 rounded-lg"
                style={{ background: `${themeColors.button.ghost}` }}
              >
                <Calendar className="h-4 w-4" style={{ color: themeColors.text.secondary }} />
                <div>
                  <p className="text-xs" style={{ color: themeColors.text.secondary }}>
                    Membre depuis
                  </p>
                  <p className="text-sm font-medium" style={{ color: themeColors.text.primary }}>
                    {new Date(user.createdAt).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            )}

            
            {/* Mes articles favoris Button */}
            {onViewLikedArticles && (
              <Button
                onClick={() => {
                  onViewLikedArticles();
                  onClose();
                }}
                className="w-full text-white font-semibold"
                style={{ 
                  background: 'linear-gradient(135deg, #FF9A3C 0%, #FF7A1C 100%)'
                }}
              >
                <Heart className="h-4 w-4 mr-2" />
                Mes articles favoris
              </Button>
            )}
            {/* Admin Button */}
            {isStaff && onAdminAccess && (
              <Button
                onClick={handleAdminAccess}
                className="w-full font-semibold"
                style={{ 
                  backgroundColor: `${themeColors.secondary}20`,
                  color: themeColors.secondary,
                  borderColor: themeColors.secondary,
                  borderWidth: '1px'
                }}
              >
                <Shield className="h-4 w-4 mr-2" />
                Créer des actualités
              </Button>
            )}

            {/* Logout Button */}
            <Button
              onClick={handleLogout}
              className="w-full font-semibold"
              style={{ 
                backgroundColor: 'transparent',
                color: '#EF4444',
                borderColor: '#EF4444',
                borderWidth: '1px'
              }}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Se déconnecter
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
