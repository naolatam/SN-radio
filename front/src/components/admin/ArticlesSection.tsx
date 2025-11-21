import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Plus, Edit2, Trash2, Eye, FileText, Save, X, Image as ImageIcon } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Card, CardContent, CardHeader } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useArticles } from '@/hooks/useArticles';
import { categoryService } from '@/services/category.service';
import { articlesService } from '@/services/articlesService';
import { Article, Category } from '@/types/shared.types';
import { toast } from 'sonner';
import { ImageWithFallback } from '../figma/ImageWithFallback';

interface ArticleFormData {
  title: string;
  resume: string;
  content: string;
  categoryIds: string[];
  pictureUrl: string;
  isHeadline: boolean;
}

export default function ArticlesSection() {
  const { articles, isLoading, refetch } = useArticles();
  const [categories, setCategories] = useState<Category[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState<ArticleFormData>({
    title: '',
    resume: '',
    content: '',
    categoryIds: [],
    pictureUrl: '',
    isHeadline: false,
  });
  const [isSaving, setIsSaving] = useState(false);
  useEffect(() => {
    loadCategories();
  }, []);
  
  const loadCategories = async () => {
    try {
      const data = await categoryService.getAll();
      setCategories(data);
    } catch (error) {
      console.error('Error loading categories:', error);
      toast.error('Erreur lors du chargement des catégories');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      resume: '',
      content: '',
      categoryIds: [],
      pictureUrl: '',
      isHeadline: false,
    });
    setEditingId(null);
    setIsCreating(false);
  };

  const handleCreate = async () => {
    if (!formData.title.trim() || !formData.resume.trim() || !formData.content.trim()) {
      toast.error('Le titre, le résumé et le contenu sont requis');
      return;
    }

    if (formData.categoryIds.length === 0) {
      toast.error('Veuillez sélectionner au moins une catégorie');
      return;
    }

    setIsSaving(true);
    try {
      const result = await articlesService.createArticle({
        title: formData.title,
        content: formData.content,
        resume: formData.resume,
        pictureUrl: formData.pictureUrl || undefined,
        categoryIds: formData.categoryIds,
        isHeadline: formData.isHeadline,
      });

      if (result.success) {
        toast.success('Article publié avec succès !');
        resetForm();
        await refetch();
      } else {
        toast.error(result.error || 'Erreur lors de la création de l\'article');
      }
    } catch (error) {
      console.error('Error creating article:', error);
      toast.error('Erreur lors de la création de l\'article');
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdate = async (id: string) => {
    if (!formData.title.trim() || !formData.resume.trim() || !formData.content.trim()) {
      toast.error('Le titre, le résumé et le contenu sont requis');
      return;
    }

    setIsSaving(true);
    try {
      const result = await articlesService.updateArticle(id, {
        title: formData.title,
        content: formData.content,
        resume: formData.resume,
        pictureUrl: formData.pictureUrl || undefined,
        categoryIds: formData.categoryIds,
        isHeadline: formData.isHeadline,
      });

      if (result.success) {
        toast.success('Article mis à jour avec succès !');
        resetForm();
        await refetch();
      } else {
        toast.error(result.error || 'Erreur lors de la mise à jour');
      }
    } catch (error) {
      console.error('Error updating article:', error);
      toast.error('Erreur lors de la mise à jour de l\'article');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer l'article "${title}" ?\n\nCette action est irréversible.`)) {
      return;
    }

    try {
      const result = await articlesService.deleteArticle(id);
      if (result.success) {
        toast.success('Article supprimé avec succès');
        await refetch();
      } else {
        toast.error(result.error || 'Erreur lors de la suppression');
      }
    } catch (error) {
      console.error('Error deleting article:', error);
      toast.error('Erreur lors de la suppression de l\'article');
    }
  };

  const startEdit = (article: Article) => {
    setEditingId(article.id);
    setFormData({
      title: article.title,
      resume: article.resume,
      content: article.content,
      categoryIds: article.categories.map(c => c.id),
      pictureUrl: article.pictureUrl || '',
      isHeadline: article.isHeadline,
    });
    setIsCreating(false);
  };

  const startCreate = () => {
    resetForm();
    setIsCreating(true);
  };
  console.log(articles)

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
        <span className="ml-2 text-gray-400">Chargement des articles...</span>
      </div>
    );
  }

  const renderForm = (isEdit: boolean, articleId?: string) => (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">
            {isEdit ? 'Modifier l\'Article' : 'Créer un Nouvel Article'}
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={resetForm}
            className="text-gray-400 hover:text-white"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Title */}
        <div className="space-y-2">
          <Label htmlFor="title" className="text-white flex items-center">
            <FileText className="h-4 w-4 mr-2" />
            Titre de l'article *
          </Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Entrez le titre de l'article"
            className="bg-gray-700 border-gray-600 text-white"
            disabled={isSaving}
          />
        </div>

        {/* Resume */}
        <div className="space-y-2">
          <Label htmlFor="resume" className="text-white flex items-center">
            <Eye className="h-4 w-4 mr-2" />
            Résumé *
          </Label>
          <Textarea
            id="resume"
            value={formData.resume}
            onChange={(e) => setFormData({ ...formData, resume: e.target.value })}
            placeholder="Un court résumé de l'article"
            className="bg-gray-700 border-gray-600 text-white min-h-[80px]"
            disabled={isSaving}
          />
        </div>

        {/* Content */}
        <div className="space-y-2">
          <Label htmlFor="content" className="text-white flex items-center">
            <FileText className="h-4 w-4 mr-2" />
            Contenu de l'article *
          </Label>
          <Textarea
            id="content"
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            placeholder="Rédigez le contenu complet de l'article (Markdown supporté)..."
            className="bg-gray-700 border-gray-600 text-white min-h-[200px]"
            disabled={isSaving}
          />
        </div>

        {/* Categories */}
        <div className="space-y-2">
          <Label htmlFor="categories" className="text-white">Catégories *</Label>
          <Select
            value={formData.categoryIds[0]}
            onValueChange={(value: string) => setFormData({ ...formData, categoryIds: [value] })}
            disabled={isSaving}
          >
            <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
              <SelectValue placeholder="Sélectionnez une catégorie" />
            </SelectTrigger>
            <SelectContent>
              {categories.filter(cat => cat.id && cat.id.trim() !== '').map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Picture URL */}
        <div className="space-y-2">
          <Label htmlFor="picture" className="text-white flex items-center">
            <ImageIcon className="h-4 w-4 mr-2" />
            URL de l'image (optionnel)
          </Label>
          <Input
            id="picture"
            value={formData.pictureUrl}
            onChange={(e) => setFormData({ ...formData, pictureUrl: e.target.value })}
            placeholder="https://exemple.com/image.jpg"
            className="bg-gray-700 border-gray-600 text-white"
            type="url"
            disabled={isSaving}
          />
          {formData.pictureUrl && (
            <div className="border border-gray-600 rounded-lg p-4 bg-gray-700">
              <ImageWithFallback
                src={formData.pictureUrl}
                alt="Aperçu"
                className="max-w-full h-32 object-cover rounded"
              />
            </div>
          )}
        </div>

        {/* Headline checkbox */}
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="headline"
            checked={formData.isHeadline}
            onChange={(e) => setFormData({ ...formData, isHeadline: e.target.checked })}
            className="rounded bg-gray-700 border-gray-600"
            disabled={isSaving}
          />
          <Label htmlFor="headline" className="text-white">
            Mettre cet article à la une
          </Label>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2 pt-4">
          <Button
            onClick={() => (isEdit && articleId ? handleUpdate(articleId) : handleCreate())}
            disabled={isSaving || !formData.title.trim() || !formData.categoryIds.length}
            className="bg-green-600 hover:bg-green-700"
          >
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? (isEdit ? 'Modification...' : 'Publication...') : (isEdit ? 'Mettre à Jour' : 'Publier')}
          </Button>
          <Button
            variant="outline"
            onClick={resetForm}
            disabled={isSaving}
            className="border-gray-600 text-gray-300"
          >
            <X className="h-4 w-4 mr-2" />
            Annuler
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Gestion des Articles</h2>
          <p className="text-sm text-gray-400 mt-1">
            {Array.isArray(articles) ? articles.length : 0} article{(Array.isArray(articles) && articles.length > 1) ? 's' : ''} publié{(Array.isArray(articles) && articles.length > 1) ? 's' : ''}
          </p>
        </div>
        <Button
          onClick={startCreate}
          disabled={isCreating || editingId !== null}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nouvel Article
        </Button>
      </div>

      {/* Create/Edit Form */}
      {isCreating && renderForm(false)}


      {/* Articles List */}
      <div className="grid gap-4">
        {Array.isArray(articles) && articles.map((article) => (
          <motion.div
            key={article.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden"
          >
            {editingId === article.id ? (
              <div className="p-6">{renderForm(true, article.id)}</div>
            ) : (
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="text-xs text-gray-500">{formatDate(article.publishedAt)}</span>
                      {article.isHeadline && (
                        <span className="px-2 py-1 bg-yellow-600 text-white text-xs rounded">À la une</span>
                      )}
                      <div className="flex items-center space-x-1">
                        {article.categories.map((cat) => (
                          <span key={cat.id} className="px-2 py-1 bg-blue-600/20 text-blue-400 text-xs rounded">
                            {cat.name}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-white mb-2">{article.title}</h3>
                    <p className="text-gray-400 text-sm mb-3 line-clamp-2">{article.resume}</p>
                    
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span>Par {article.author.pseudo}</span>
                      <span>❤️ {article.likes} j'aime</span>
                    </div>
                  </div>
                  
                  {article.pictureUrl && (
                    <div className="ml-4 flex-shrink-0">
                      <ImageWithFallback
                        src={article.pictureUrl}
                        alt={article.title}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                    </div>
                  )}
                </div>
                
                <div className="flex items-center justify-end mt-4 pt-4 border-t border-gray-700 space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => startEdit(article)}
                    className="text-blue-400 hover:text-blue-300 hover:bg-blue-900/20"
                  >
                    <Edit2 className="h-4 w-4 mr-2" />
                    Modifier
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(article.id, article.title)}
                    className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Supprimer
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        ))}

        {(!articles || articles.length === 0) && !isCreating && (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-400 mb-2">Aucun article trouvé</h3>
            <p className="text-gray-500 mb-4">Commencez par créer votre premier article.</p>
            <Button onClick={startCreate} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Créer un Article
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
