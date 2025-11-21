import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Plus, Edit2, Trash2, AlertTriangle, Save, X } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardHeader } from '../ui/card';
import { categoryService } from '@/services/category.service';
import { Category, CreateCategoryDTO, UpdateCategoryDTO } from '@/types/shared.types';
import { toast } from 'sonner';

export default function CategoriesSection() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState<CreateCategoryDTO>({ name: '', slug: '', color: '#6b7280' });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setIsLoading(true);
    try {
      const data = await categoryService.getAll();
      setCategories(data);
    } catch (error) {
      console.error('Error loading categories:', error);
      toast.error('Erreur lors du chargement des catégories');
    } finally {
      setIsLoading(false);
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleNameChange = (name: string) => {
    setFormData({
      ...formData,
      name,
      slug: generateSlug(name),
    });
  };

  const handleCreate = async () => {
    if (!formData.name.trim() || !formData.slug.trim() || !formData.color.trim()) {
      toast.error('Le nom, le slug et la couleur sont requis');
      return;
    }

    setIsSaving(true);
    try {
      const response = await categoryService.create(formData);
      if (response.success) {
        toast.success('Catégorie créée avec succès');
        setFormData({ name: '', slug: '', color: '#6b7280' });
        setIsCreating(false);
        await loadCategories();
      } else {
        toast.error(response.error || 'Erreur lors de la création');
      }
    } catch (error) {
      console.error('Error creating category:', error);
      toast.error('Erreur lors de la création de la catégorie');
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdate = async (id: string) => {
    if (!formData.name.trim() || !formData.slug.trim() || !formData.color.trim()) {
      toast.error('Le nom, le slug et la couleur sont requis');
      return;
    }

    setIsSaving(true);
    try {
      const updateData: UpdateCategoryDTO = {
        name: formData.name,
        slug: formData.slug,
        color: formData.color,
      };
      const response = await categoryService.update(id, updateData);
      if (response.success) {
        toast.success('Catégorie mise à jour avec succès');
        setEditingId(null);
        setFormData({ name: '', slug: '', color: '#6b7280' });
        await loadCategories();
      } else {
        toast.error(response.error || 'Erreur lors de la mise à jour');
      }
    } catch (error) {
      console.error('Error updating category:', error);
      toast.error('Erreur lors de la mise à jour de la catégorie');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer la catégorie "${name}" ?\n\nCette action est irréversible et échouera si des articles sont associés à cette catégorie.`)) {
      return;
    }

    try {
      const response = await categoryService.delete(id);
      if (response.success) {
        toast.success('Catégorie supprimée avec succès');
        await loadCategories();
      } else {
        toast.error(response.error || 'Impossible de supprimer cette catégorie');
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error('Erreur lors de la suppression de la catégorie');
    }
  };

  const startEdit = (category: Category) => {
    setEditingId(category.id);
    setFormData({ name: category.name, slug: category.slug, color: category.color });
    setIsCreating(false);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setIsCreating(false);
    setFormData({ name: '', slug: '', color: '#6b7280' });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-400">Chargement des catégories...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Gestion des Catégories</h2>
          <p className="text-sm text-gray-400 mt-1">
            {categories.length} catégorie{categories.length > 1 ? 's' : ''} disponible{categories.length > 1 ? 's' : ''}
          </p>
        </div>
        <Button
          onClick={() => {
            setIsCreating(true);
            setEditingId(null);
            setFormData({ name: '', slug: '', color: '#6b7280' });
          }}
          disabled={isCreating}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle Catégorie
        </Button>
      </div>

      {/* Create Form */}
      {isCreating && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">Créer une Nouvelle Catégorie</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={cancelEdit}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="create-name" className="text-white">Nom de la catégorie *</Label>
                  <Input
                    id="create-name"
                    value={formData.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="Ex: Actualités"
                    className="bg-gray-700 border-gray-600 text-white"
                    disabled={isSaving}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="create-slug" className="text-white">Slug *</Label>
                  <Input
                    id="create-slug"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="Ex: actualites"
                    className="bg-gray-700 border-gray-600 text-white"
                    disabled={isSaving}
                  />
                  <p className="text-xs text-gray-500">Généré automatiquement depuis le nom</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="create-color" className="text-white">Couleur *</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="create-color"
                      type="color"
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      className="h-10 w-20 bg-gray-700 border-gray-600 cursor-pointer"
                      disabled={isSaving}
                    />
                    <Input
                      type="text"
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      placeholder="#6b7280"
                      className="flex-1 bg-gray-700 border-gray-600 text-white"
                      disabled={isSaving}
                    />
                  </div>
                  <p className="text-xs text-gray-500">Format hexadécimal (ex: #007EFF)</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button
                  onClick={handleCreate}
                  disabled={isSaving || !formData.name.trim()}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isSaving ? 'Création...' : 'Créer la Catégorie'}
                </Button>
                <Button
                  variant="outline"
                  onClick={cancelEdit}
                  disabled={isSaving}
                  className="border-gray-600 text-gray-300"
                >
                  Annuler
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Categories List */}
      <div className="grid gap-4">
        {categories.map((category) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden"
          >
            {editingId === category.id ? (
              <div className="p-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`edit-name-${category.id}`} className="text-white">Nom de la catégorie *</Label>
                      <Input
                        id={`edit-name-${category.id}`}
                        value={formData.name}
                        onChange={(e) => handleNameChange(e.target.value)}
                        className="bg-gray-700 border-gray-600 text-white"
                        disabled={isSaving}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`edit-slug-${category.id}`} className="text-white">Slug *</Label>
                      <Input
                        id={`edit-slug-${category.id}`}
                        value={formData.slug}
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                        className="bg-gray-700 border-gray-600 text-white"
                        disabled={isSaving}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`edit-color-${category.id}`} className="text-white">Couleur *</Label>
                      <div className="flex items-center space-x-2">
                        <Input
                          id={`edit-color-${category.id}`}
                          type="color"
                          value={formData.color}
                          onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                          className="h-10 w-20 bg-gray-700 border-gray-600 cursor-pointer"
                          disabled={isSaving}
                        />
                        <Input
                          type="text"
                          value={formData.color}
                          onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                          placeholder="#6b7280"
                          className="flex-1 bg-gray-700 border-gray-600 text-white"
                          disabled={isSaving}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => handleUpdate(category.id)}
                      disabled={isSaving || !formData.name.trim()}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {isSaving ? 'Enregistrement...' : 'Enregistrer'}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={cancelEdit}
                      disabled={isSaving}
                      className="border-gray-600 text-gray-300"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Annuler
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 flex-1">
                    <div 
                      className="w-12 h-12 rounded-lg border-2 border-gray-600"
                      style={{ backgroundColor: category.color }}
                      title={category.color}
                    />
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-1">{category.name}</h3>
                      <p className="text-sm text-gray-400">
                        Slug: <code className="bg-gray-700 px-2 py-1 rounded">{category.slug}</code>
                        <span className="ml-3">Couleur: <code className="bg-gray-700 px-2 py-1 rounded">{category.color}</code></span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => startEdit(category)}
                      className="text-blue-400 hover:text-blue-300 hover:bg-blue-900/20"
                    >
                      <Edit2 className="h-4 w-4 mr-2" />
                      Modifier
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(category.id, category.name)}
                      className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Supprimer
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        ))}

        {categories.length === 0 && !isCreating && (
          <div className="text-center py-12">
            <AlertTriangle className="h-12 w-12 text-gray-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-400 mb-2">
              Aucune catégorie trouvée
            </h3>
            <p className="text-gray-500 mb-4">
              Commencez par créer votre première catégorie d'articles.
            </p>
            <Button
              onClick={() => {
                setIsCreating(true);
                setFormData({ name: '', slug: '', color: '#6b7280' });
              }}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Créer une Catégorie
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
