import { Card, CardContent } from './ui/card';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Mic } from 'lucide-react';

const teamMembers = [
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
    bio: `Toujours à l’écoute, KilusPro veille à ce que tout fonctionne pour les auditeurs. Il assure le support technique et aide la communauté au quotidien avec professionnalisme.`,
    image: 'https://zupimages.net/up/25/09/11tw.jpg'
  },
  {
    id: 3,
    name: 'Alex',
    role: 'Technicien et hébergement',
    bio: `Responsable des serveurs et de l’infrastructure, Alex garantit la stabilité et la sécurité du stream. Son travail en coulisses permet à SN-Radio de rester toujours en ligne.`,
    image: 'https://zupimages.net/up/25/38/uibz.png'
  }
];

export default function TeamSection() {
  return (
    <section id="equipe" className="py-16 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">Notre Équipe</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Découvrez les visages derrière SN-Radio
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member) => (
            <Card key={member.id} className="overflow-hidden transition-colors duration-300 hover:opacity-90" style={{backgroundColor: '#12171C80', borderColor: '#ffffff20'}}>
              <CardContent className="p-6 text-center">
                <div className="mb-4">
                  <div className="relative w-24 h-24 mx-auto mb-4">
                    <ImageWithFallback
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover rounded-full border-4"
                      style={{borderColor: '#007EFF'}}
                    />
                    <div className="absolute -bottom-1 -right-1 p-1.5 rounded-full" style={{background: 'linear-gradient(135deg, #007EFF, #FFBB62)'}}>
                      <Mic className="h-3 w-3 text-white" />
                    </div>
                  </div>
                </div>
                
                <h3 className="text-white font-semibold mb-1">{member.name}</h3>
                <p className="text-sm mb-3" style={{color: '#007EFF'}}>{member.role}</p>
                <p className="text-gray-400 text-sm line-clamp-4">
                  {member.bio}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
