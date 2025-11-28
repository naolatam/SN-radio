import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  AlertTriangle, 
  UserPlus, 
  Edit, 
  ArrowUp, 
  ArrowDown,
  X,
  Save,
  Search
} from 'lucide-react';
import { Button } from '../ui/button';
import { UserRole, StaffPresenterDTO, User } from '@/types/shared.types';
import { toast } from 'sonner';
import { staffService } from '@/services/staff.service';
import { userService } from '@/services/user.service';
import { useAuth } from '../AuthContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';

export default function StaffSection() {
  const { user: currentUser } = useAuth();
  const [staffMembers, setStaffMembers] = useState<StaffPresenterDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<StaffPresenterDTO | null>(null);
  
  // Form states
  const [searchUsername, setSearchUsername] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [staffRole, setStaffRole] = useState('');
  const [staffDescription, setStaffDescription] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const staff = await staffService.getAll();
      setStaffMembers(staff);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Erreur lors du chargement des données');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchUsers = async () => {
    if (!searchUsername.trim()) {
      setSearchResults([]);
      toast.error('Veuillez entrer un nom d\'utilisateur');
      return;
    }

    const query = searchUsername.toLowerCase();
    const results = await userService.getByName(query);
    
    if (results.length === 0) {
      toast.info('Aucun utilisateur trouvé');
    }
    
    setSearchResults(results);
  };

  const selectUser = (user: User) => {
    setSelectedUser(user);
    setSearchResults([]);
  };

  const handleAddStaff = async () => {
    if (!selectedUser || !staffRole) {
      toast.error('Veuillez sélectionner un utilisateur et un rôle');
      return;
    }

    try {
      const response = await staffService.create({
        userId: selectedUser.id,
        role: staffRole,
        description: staffDescription || undefined,
      });

      if (response.success) {
        toast.success('Membre ajouté au staff avec succès');
        setIsAddDialogOpen(false);
        resetForm();
        await loadData();
      } else {
        toast.error(response.error || 'Erreur lors de l\'ajout au staff');
      }
    } catch (error) {
      console.error('Error adding staff:', error);
      toast.error('Erreur lors de l\'ajout au staff');
    }
  };

  const handleEditStaff = async () => {
    if (!selectedStaff || !staffRole) {
      toast.error('Veuillez renseigner un rôle');
      return;
    }

    try {
      const response = await staffService.update(selectedStaff.id, {
        role: staffRole,
        description: staffDescription || undefined,
      });

      if (response.success) {
        toast.success('Membre du staff modifié avec succès');
        setIsEditDialogOpen(false);
        setSelectedStaff(null);
        resetForm();
        await loadData();
      } else {
        toast.error(response.error || 'Erreur lors de la modification');
      }
    } catch (error) {
      console.error('Error updating staff:', error);
      toast.error('Erreur lors de la modification du staff');
    }
  };

  const handlePromoteToStaff = async (user: User) => {
    try {
      const response = await userService.updateRole(user.id, UserRole.STAFF);
      if (response.success) {
        toast.success(`${user.name} promu au rôle STAFF`);
        await loadData();
        // Clear search results to refresh the list
        setSearchResults([]);
        if (searchUsername) {
          handleSearchUsers();
        }
      } else {
        toast.error(response.error || 'Erreur lors de la promotion');
      }
    } catch (error) {
      console.error('Error promoting user:', error);
      toast.error('Erreur lors de la promotion');
    }
  };

  const handleDemoteToMember = async (staff: StaffPresenterDTO) => {
    if (!confirm(`Êtes-vous sûr de vouloir rétrograder "${staff.user.name}" au rôle MEMBRE ?\n\nCela retirera également l'utilisateur du staff.`)) {
      return;
    }

    try {
      const roleResponse = await userService.updateRole(staff.user.id, UserRole.MEMBER);
      if (roleResponse.success) {
        await staffService.delete(staff.id);
        toast.success(`${staff.user.name} rétrogradé au rôle MEMBRE`);
        await loadData();
      } else {
        toast.error(roleResponse.error || 'Erreur lors de la rétrogradation');
      }
    } catch (error) {
      console.error('Error demoting user:', error);
      toast.error('Erreur lors de la rétrogradation');
    }
  };

  const openAddDialog = () => {
    resetForm();
    setSearchResults([]);
    setIsAddDialogOpen(true);
  };

  const openEditDialog = (staff: StaffPresenterDTO) => {
    setSelectedStaff(staff);
    setStaffRole(staff.role);
    setStaffDescription(staff.description || '');
    setIsEditDialogOpen(true);
  };

  const resetForm = () => {
    setSelectedUser(null);
    setStaffRole('');
    setStaffDescription('');
    setSearchUsername('');
    setSearchResults([]);
  };

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
        case UserRole.ADMIN:
        return <span className="px-2 py-1 bg-red-600 text-white text-xs rounded">Admin</span>;
      case UserRole.STAFF:
        return <span className="px-2 py-1 bg-yellow-600 text-white text-xs rounded">Staff</span>;
      case UserRole.MEMBER:
        return <span className="px-2 py-1 bg-gray-600 text-white text-xs rounded">Membre</span>;
      default:
        return null;
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
        <span className="ml-2 text-gray-400">Chargement du staff...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Gestion du Staff</h2>
          <p className="text-sm text-gray-400 mt-1">
            {staffMembers.length} membre{staffMembers.length > 1 ? 's' : ''} du staff
          </p>
        </div>
        <Button
          onClick={openAddDialog}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Ajouter au staff
        </Button>
      </div>

      {/* Staff Members List */}
      <div className="grid gap-4">
        {staffMembers.map((staff) => (
          <motion.div
            key={staff.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <div className="w-12 h-12 rounded-full bg-yellow-600 flex items-center justify-center text-white font-bold text-lg shrink-0">
                    {staff.user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-lg font-semibold text-white">{staff.user.name}</h3>
                      {getRoleBadge(staff.user.role)}
                    </div>
                    <p className="text-sm text-gray-400 mt-1">{staff.user.email}</p>
                    <div className="mt-2">
                      <p className="text-sm font-medium text-blue-400">{staff.role}</p>
                      {staff.description && (
                        <p className="text-sm text-gray-300 mt-1">{staff.description}</p>
                      )}
                    </div>
                    <div className="flex items-center space-x-3 mt-2">
                      <span className="text-xs text-gray-500">
                        Ajouté le {formatDate(staff.createdAt)}
                      </span>
                      {staff.updatedAt !== staff.createdAt && (
                        <span className="text-xs text-gray-500">
                          • Modifié le {formatDate(staff.updatedAt)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  <Button
                    onClick={() => openEditDialog(staff)}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Modifier
                  </Button>
                  {currentUser?.role === UserRole.ADMIN && staff.user.role === UserRole.STAFF && (
                    <Button 
                      onClick={() => handleDemoteToMember(staff)}
                      className="bg-yellow-600 hover:bg-yellow-700 text-white"
                    >
                      <ArrowDown className="h-4 w-4 mr-2" />
                      Rétrograder
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}

        {staffMembers.length === 0 && (
          <div className="text-center py-12 bg-gray-800 rounded-lg border border-gray-700">
            <AlertTriangle className="h-12 w-12 text-gray-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-400 mb-2">
              Aucun membre du staff
            </h3>
            <p className="text-gray-500 mb-4">
              Ajoutez des membres au staff pour commencer.
            </p>
            <Button
              onClick={openAddDialog}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Ajouter le premier membre
            </Button>
          </div>
        )}
      </div>

      {/* Add Staff Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="bg-gray-900 text-white border-gray-700 max-w-2xl">
          <DialogHeader>
            <DialogTitle>Ajouter un membre au staff</DialogTitle>
            <DialogDescription className="text-gray-400">
              Recherchez un utilisateur par son nom et définissez son rôle dans l'équipe.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="search">Rechercher un utilisateur</Label>
              <div className="flex space-x-2">
                <Input
                  id="search"
                  value={searchUsername}
                  onChange={(e) => setSearchUsername(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearchUsers()}
                  placeholder="Entrez un nom d'utilisateur..."
                  className="bg-gray-800 border-gray-700 flex-1"
                />
                <Button
                  onClick={handleSearchUsers}
                  className="bg-gray-700 hover:bg-gray-600"
                >
                  <Search className="h-4 w-4 mr-2" />
                  Rechercher
                </Button>
              </div>
              
              {searchResults.length > 0 && (
                <div className="mt-2 space-y-1 max-h-60 overflow-y-auto border border-gray-700 rounded-lg p-2">
                  <p className="text-xs text-gray-400 px-2 py-1">
                    {searchResults.length} résultat{searchResults.length > 1 ? 's' : ''} trouvé{searchResults.length > 1 ? 's' : ''}
                  </p>
                  {searchResults.map((user) => (
                    <button
                      key={user.id}
                      onClick={() => selectUser(user)}
                      className={`w-full flex items-center space-x-3 p-3 rounded-lg border text-left transition-colors ${
                        selectedUser?.id === user.id
                          ? 'bg-blue-900/50 border-blue-600'
                          : 'bg-gray-800 border-gray-700 hover:bg-gray-700'
                      }`}
                    >
                      <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-white">{user.name}</p>
                        <p className="text-xs text-gray-400">{user.email}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getRoleBadge(user.role)}
                        
                      </div>
                    </button>
                  ))}
                </div>
              )}
              
              {selectedUser && (
                <div className="mt-2 p-3 bg-blue-900/30 border border-blue-700/50 rounded-lg">
                  <p className="text-sm text-blue-300">
                    ✓ Utilisateur sélectionné: <span className="font-semibold">
                      {selectedUser.name}
                    </span>
                  </p>
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="role">Rôle dans le staff *</Label>
              <Input
                id="role"
                value={staffRole}
                onChange={(e) => setStaffRole(e.target.value)}
                placeholder="ex: Développeur, Designer, Rédacteur..."
                className="bg-gray-800 border-gray-700"
              />
              <p className="text-xs text-gray-500">Le titre ou poste du membre dans l'équipe</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description (optionnel)</Label>
              <Textarea
                id="description"
                value={staffDescription}
                onChange={(e) => setStaffDescription(e.target.value)}
                placeholder="Spécialité, responsabilités, compétences..."
                className="bg-gray-800 border-gray-700 min-h-[100px]"
              />
            </div>
            
            <div className="flex justify-end space-x-2 mt-6 pt-4 border-t border-gray-700">
              <Button
                onClick={() => setIsAddDialogOpen(false)}
                className="bg-gray-700 hover:bg-gray-600 text-white"
              >
                <X className="h-4 w-4 mr-2" />
                Annuler
              </Button>
              <Button
                onClick={handleAddStaff}
                disabled={!selectedUser || !staffRole}
                className="bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
              >
                <Save className="h-4 w-4 mr-2" />
                Ajouter au staff
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Staff Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-gray-900 text-white border-gray-700">
          <DialogHeader>
            <DialogTitle>Modifier un membre du staff</DialogTitle>
            <DialogDescription className="text-gray-400">
              Modifiez le rôle et la description de {selectedStaff?.user.name}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="edit-role">Rôle dans le staff</Label>
              <Input
                id="edit-role"
                value={staffRole}
                onChange={(e) => setStaffRole(e.target.value)}
                placeholder="ex: Développeur, Designer, Rédacteur..."
                className="bg-gray-800 border-gray-700"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description (optionnel)</Label>
              <Textarea
                id="edit-description"
                value={staffDescription}
                onChange={(e) => setStaffDescription(e.target.value)}
                placeholder="Spécialité, responsabilités..."
                className="bg-gray-800 border-gray-700 min-h-[100px]"
              />
            </div>
            <div className="flex justify-end space-x-2 mt-6">
              <Button
                onClick={() => setIsEditDialogOpen(false)}
                className="bg-gray-700 hover:bg-gray-600 text-white"
              >
                <X className="h-4 w-4 mr-2" />
                Annuler
              </Button>
              <Button
                onClick={handleEditStaff}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Save className="h-4 w-4 mr-2" />
                Enregistrer
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
