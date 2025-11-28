import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Palette,
  Plus,
  Edit2,
  Trash2,
  Copy,
  Check,
  X,
  Power,
  Save,
  Sparkles,
  Image as ImageIcon,
  AlertCircle,
} from 'lucide-react';
import { Card, CardContent, CardHeader } from '../ui/card';
import { useThemeManager } from '../ThemeManagerContext';
import { themeService } from '@/services/theme.service';
import type { Theme, CreateThemeDTO } from '@/types/shared.types';

export default function ThemeSection() {
  const { refreshTheme } = useThemeManager();
  const [themes, setThemes] = useState<Theme[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingTheme, setEditingTheme] = useState<Theme | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    loadThemes();
  }, []);

  const loadThemes = async () => {
    try {
      setIsLoading(true);
      const data = await themeService.getAllThemes();
      setThemes(data);
    } catch (error) {
      console.error('Error loading themes:', error);
      showMessage('error', 'Erreur lors du chargement des thèmes');
    } finally {
      setIsLoading(false);
    }
  };

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleActivateTheme = async (id: string) => {
    try {
      await themeService.activateTheme(id);
      await loadThemes();
      await refreshTheme();
      showMessage('success', 'Thème activé avec succès!');
    } catch (error) {
      showMessage('error', 'Erreur lors de l\'activation du thème');
    }
  };

  const handleDeleteTheme = async (id: string, name: string) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer le thème "${name}" ?`)) {
      return;
    }

    try {
      await themeService.deleteTheme(id);
      await loadThemes();
      showMessage('success', 'Thème supprimé avec succès!');
    } catch (error) {
      showMessage('error', 'Impossible de supprimer le thème actif');
    }
  };

  const handleDuplicateTheme = async (theme: Theme) => {
    const newName = prompt(`Nom du nouveau thème (copie de "${theme.name}"):`, `${theme.name} - Copie`);
    if (!newName) return;

    const newSlug = newName.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    try {
      await themeService.duplicateTheme(theme.id, newName, newSlug);
      await loadThemes();
      showMessage('success', 'Thème dupliqué avec succès!');
    } catch (error) {
      showMessage('error', 'Erreur lors de la duplication');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-purple-400" />
            Gestion des Thèmes
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            Créez et gérez plusieurs thèmes pour votre site (Noël, Classique, etc.)
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Nouveau Thème
        </button>
      </div>

      {/* Status Message */}
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`p-4 rounded-lg flex items-center gap-3 ${
              message.type === 'success'
                ? 'bg-green-500/10 border border-green-500/20 text-green-400'
                : 'bg-red-500/10 border border-red-500/20 text-red-400'
            }`}
          >
            {message.type === 'success' ? <Check className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
            <span>{message.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Themes Grid */}
      {isLoading ? (
        <div className="text-center py-12 text-gray-400">Chargement...</div>
      ) : themes.length === 0 ? (
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-12 text-center">
            <Palette className="h-16 w-16 mx-auto text-gray-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Aucun thème</h3>
            <p className="text-gray-400 mb-4">Créez votre premier thème pour personnaliser votre site</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              Créer un Thème
            </button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {themes.map((theme, index) => (
            <ThemeCard
              key={theme.id}
              theme={theme}
              index={index}
              onActivate={handleActivateTheme}
              onEdit={setEditingTheme}
              onDelete={handleDeleteTheme}
              onDuplicate={handleDuplicateTheme}
            />
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {(showCreateModal || editingTheme) && (
          <ThemeModal
            theme={editingTheme}
            onClose={() => {
              setShowCreateModal(false);
              setEditingTheme(null);
            }}
            onSave={async () => {
              await loadThemes();
              await refreshTheme();
              setShowCreateModal(false);
              setEditingTheme(null);
              showMessage('success', editingTheme ? 'Thème modifié!' : 'Thème créé!');
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// Theme Card Component
interface ThemeCardProps {
  theme: Theme;
  index: number;
  onActivate: (id: string) => void;
  onEdit: (theme: Theme) => void;
  onDelete: (id: string, name: string) => void;
  onDuplicate: (theme: Theme) => void;
}

function ThemeCard({ theme, index, onActivate, onEdit, onDelete, onDuplicate }: ThemeCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className={`bg-gray-800 border-2 ${theme.isActive ? 'border-green-500' : 'border-gray-700'} relative overflow-hidden`}>
        {/* Active Badge */}
        {theme.isActive && (
          <div className="absolute top-2 right-2 z-10">
            <div className="px-2 py-1 bg-green-500 text-white text-xs font-semibold rounded-full flex items-center gap-1">
              <Check className="h-3 w-3" />
              ACTIF
            </div>
          </div>
        )}

        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-lg font-semibold">{theme.name}</h3>
              {theme.description && (
                <p className="text-sm text-gray-400 mt-1">{theme.description}</p>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Color Preview */}
          <div>
            <p className="text-xs text-gray-400 mb-2">Palette de couleurs</p>
            <div className="flex gap-2">
              <div
                className="flex-1 h-16 rounded border border-gray-600"
                style={{ backgroundColor: theme.primaryColor }}
                title={theme.primaryColor}
              />
              <div
                className="flex-1 h-16 rounded border border-gray-600"
                style={{ backgroundColor: theme.secondaryColor }}
                title={theme.secondaryColor}
              />
              <div
                className="flex-1 h-16 rounded border border-gray-600"
                style={{ backgroundColor: theme.backgroundColor }}
                title={theme.backgroundColor}
              />
            </div>
          </div>

          {/* Logo Preview */}
          {theme.logo && (
            <div>
              <p className="text-xs text-gray-400 mb-2">Logo</p>
              <div className="bg-gray-900 p-3 rounded flex items-center justify-center h-16">
                <img src={theme.logo} alt={theme.name} className="h-full object-contain" onError={(e) => e.currentTarget.style.display = 'none'} />
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            {!theme.isActive && (
              <button
                onClick={() => onActivate(theme.id)}
                className="flex-1 px-3 py-2 bg-green-600 hover:bg-green-700 rounded text-sm transition-colors flex items-center justify-center gap-1"
                title="Activer ce thème"
              >
                <Power className="h-3 w-3" />
                Activer
              </button>
            )}
            <button
              onClick={() => onEdit(theme)}
              className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded text-sm transition-colors"
              title="Modifier"
            >
              <Edit2 className="h-4 w-4" />
            </button>
            <button
              onClick={() => onDuplicate(theme)}
              className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded text-sm transition-colors"
              title="Dupliquer"
            >
              <Copy className="h-4 w-4" />
            </button>
            {!theme.isActive && (
              <button
                onClick={() => onDelete(theme.id, theme.name)}
                className="px-3 py-2 bg-red-600 hover:bg-red-700 rounded text-sm transition-colors"
                title="Supprimer"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Theme Modal Component
interface ThemeModalProps {
  theme: Theme | null;
  onClose: () => void;
  onSave: () => void;
}

function ThemeModal({ theme, onClose, onSave }: ThemeModalProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<CreateThemeDTO>({
    name: theme?.name || '',
    slug: theme?.slug || '',
    description: theme?.description || '',
    primaryColor: theme?.primaryColor || '#007EFF',
    secondaryColor: theme?.secondaryColor || '#FFBB62',
    backgroundColor: theme?.backgroundColor || '#12171C',
    favicon: theme?.favicon || '/favicon.ico',
    icon: theme?.icon || '/icon.png',
    logo: theme?.logo || '/logo.png',
    siteName: theme?.siteName || 'SN-Radio',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      if (theme) {
        await themeService.updateTheme(theme.id, formData);
      } else {
        await themeService.createTheme(formData);
      }
      onSave();
    } catch (error) {
      console.error('Error saving theme:', error);
      alert('Erreur lors de l\'enregistrement du thème');
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (field: keyof CreateThemeDTO, value: string) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };
      // Auto-generate slug from name if creating new theme
      if (field === 'name' && !theme) {
        updated.slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      }
      return updated;
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-gray-800 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto"
      >
        <form onSubmit={handleSubmit}>
          {/* Header */}
          <div className="sticky top-0 bg-gray-800 border-b border-gray-700 p-6 flex items-center justify-between z-10">
            <h3 className="text-xl font-semibold">
              {theme ? 'Modifier le Thème' : 'Créer un Nouveau Thème'}
            </h3>
            <button type="button" onClick={onClose} className="p-2 hover:bg-gray-700 rounded transition-colors">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Form Content */}
          <div className="p-6 space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Nom du Thème *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Thème de Noël"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Slug *</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => handleInputChange('slug', e.target.value)}
                  required
                  pattern="[a-z0-9-]+"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="theme-noel"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={2}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Thème festif pour la période de Noël"
              />
            </div>

            {/* Colors */}
            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Palette className="h-5 w-5 text-blue-400" />
                Couleurs
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Primaire *</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={formData.primaryColor}
                      onChange={(e) => handleInputChange('primaryColor', e.target.value)}
                      className="w-16 h-10 rounded border border-gray-600 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={formData.primaryColor}
                      onChange={(e) => handleInputChange('primaryColor', e.target.value)}
                      className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg font-mono text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Secondaire *</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={formData.secondaryColor}
                      onChange={(e) => handleInputChange('secondaryColor', e.target.value)}
                      className="w-16 h-10 rounded border border-gray-600 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={formData.secondaryColor}
                      onChange={(e) => handleInputChange('secondaryColor', e.target.value)}
                      className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg font-mono text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Fond *</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={formData.backgroundColor}
                      onChange={(e) => handleInputChange('backgroundColor', e.target.value)}
                      className="w-16 h-10 rounded border border-gray-600 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={formData.backgroundColor}
                      onChange={(e) => handleInputChange('backgroundColor', e.target.value)}
                      className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg font-mono text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Branding */}
            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <ImageIcon className="h-5 w-5 text-purple-400" />
                Identité Visuelle
              </h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Nom du Site *</label>
                  <input
                    type="text"
                    value={formData.siteName}
                    onChange={(e) => handleInputChange('siteName', e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Favicon URL</label>
                    <input
                      type="text"
                      value={formData.favicon}
                      onChange={(e) => handleInputChange('favicon', e.target.value)}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-sm"
                      placeholder="/favicon.ico"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Icône URL</label>
                    <input
                      type="text"
                      value={formData.icon}
                      onChange={(e) => handleInputChange('icon', e.target.value)}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-sm"
                      placeholder="/icon.png"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Logo URL</label>
                    <input
                      type="text"
                      value={formData.logo}
                      onChange={(e) => handleInputChange('logo', e.target.value)}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-sm"
                      placeholder="/logo.png"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Preview */}
            <div>
              <h4 className="font-semibold mb-3">Aperçu</h4>
              <div className="p-6 rounded-lg" style={{ backgroundColor: formData.backgroundColor }}>
                <div className="flex gap-3">
                  <button
                    type="button"
                    className="px-4 py-2 rounded font-medium"
                    style={{ backgroundColor: formData.primaryColor }}
                  >
                    Primaire
                  </button>
                  <button
                    type="button"
                    className="px-4 py-2 rounded font-medium"
                    style={{ backgroundColor: formData.secondaryColor }}
                  >
                    Secondaire
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-gray-800 border-t border-gray-700 p-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Enregistrement...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Enregistrer
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
