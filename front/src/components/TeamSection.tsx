import { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Mic } from 'lucide-react';
import { useThemeManager } from './ThemeManagerContext';
import { staffService } from '@/services/staff.service';
import { StaffPresenterDTO } from '@/types/shared.types';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

const defaultTeamMembers = [
  {
    id: 1,
    name: 'RiverFreez',
    role: 'Producteur et Fondateur',
    bio: `Visionnaire et passionné de radio numérique, RiverFreez est à l'origine de SN-Radio. Il pilote le projet avec énergie, créativité et une attention particulière à l'expérience auditeur.`,
    image: 'https://zupimages.net/up/25/18/j935.png'
  },
  {
    id: 2,
    name: 'KilusPro',
    role: 'Assistent support',
    bio: `Toujours à l'écoute, KilusPro veille à ce que tout fonctionne pour les auditeurs. Il assure le support technique et aide la communauté au quotidien avec professionnalisme.`,
    image: 'https://zupimages.net/up/25/09/11tw.jpg'
  },
  {
    id: 3,
    name: 'Alex',
    role: 'Technicien et hébergement',
    bio: `Responsable des serveurs et de l'infrastructure, Alex garantit la stabilité et la sécurité du stream. Son travail en coulisses permet à SN-Radio de rester toujours en ligne.`,
    image: 'https://zupimages.net/up/25/38/uibz.png'
  }
];

export default function TeamSection() {
  const { theme } = useThemeManager();
  const [staffMembers, setStaffMembers] = useState<StaffPresenterDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStaff = async () => {
      try {
        const staff = await staffService.getAll();
        setStaffMembers(staff);
      } catch (error) {
        console.error('Error loading staff:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStaff();
  }, []);

  // Use staff from API if available, otherwise use default team members
  const displayMembers = staffMembers.length > 0 
    ? staffMembers.map(staff => ({
        id: staff.id,
        name: staff.user.name,
        role: staff.role,
        bio: staff.description || '',
        image: staff.user.image
      }))
    : defaultTeamMembers;
  
  return (
    <section id="equipe" className="py-16 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">Notre Équipe</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Découvrez les visages derrière SN-Radio
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-400">Chargement de l'équipe...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayMembers.map((member) => (
              <Card key={member.id} className="overflow-hidden transition-all duration-300 hover:opacity-90" style={{backgroundColor: `${theme.colors.background}cc`, borderColor: `${theme.colors.primary}40`}}>
                <CardContent className="p-6 text-center">
                  <div className="mb-4">
                    <div className="relative w-24 h-24 mx-auto mb-4">
                      <Avatar className="w-24 h-24 mb-3 border-4 mt-2 border-white/20">
                        <AvatarImage 
                          src={member.image || undefined} 
                          alt={member.name}
                          loading="lazy"
                          fetchpriority="low"
                        />
                        <AvatarFallback 
                          className="text-3xl font-bold"
                          style={{ background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.secondary} 100%)` }}
                        >
                          {member.name?.charAt(0)?.toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-1 -right-1 p-1.5 rounded-full" style={{backgroundColor: theme.colors.primary}}>
                        <Mic className="h-3 w-3 text-white" />
                      </div>
                    </div>
                  </div>
                  
                  <h3 className="text-white font-semibold mb-1">{member.name}</h3>
                  <p className="text-sm mb-3" style={{color: theme.colors.primary}}>{member.role}</p>
                  {member.bio && (
                    <p className="text-gray-400 text-sm line-clamp-4">
                      {member.bio}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
