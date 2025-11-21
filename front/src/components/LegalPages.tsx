import { motion } from 'motion/react';
import { ArrowLeft, FileText, Shield, Scale } from 'lucide-react';
import { Button } from './ui/button';

interface LegalPagesProps {
  currentPage: 'mentions' | 'privacy' | 'terms' | null;
  onBack: () => void;
}

export default function LegalPages({ currentPage, onBack }: LegalPagesProps) {
  if (!currentPage) return null;

  const pageConfig = {
    mentions: {
      title: 'Mentions légales',
      icon: FileText,
      content: <MentionsLegalesContent />
    },
    privacy: {
      title: 'Politique de confidentialité',
      icon: Shield,
      content: <PolitiqueConfidentialiteContent />
    },
    terms: {
      title: 'Conditions Générales d\'Utilisation',
      icon: Scale,
      content: <CGUContent />
    }
  };

  const config = pageConfig[currentPage];
  const IconComponent = config.icon;

  return (
    <div className="min-h-screen" style={{background: 'linear-gradient(135deg, #12171C 0%, #1a2025 50%, #12171C 100%)'}}>
      <div className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          {/* Header */}
          <div className="flex items-center mb-8">
            <Button
              variant="ghost"
              onClick={onBack}
              className="mr-4 text-gray-400 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
            <div className="flex items-center space-x-3">
              <IconComponent className="h-6 w-6" style={{ color: '#007EFF' }} />
              <h1 className="text-3xl font-bold text-white">{config.title}</h1>
            </div>
          </div>

          {/* Content */}
          <div 
            className="backdrop-blur-sm rounded-xl p-8 border"
            style={{ backgroundColor: '#12171C80', borderColor: '#ffffff20' }}
          >
            {config.content}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function MentionsLegalesContent() {
  return (
    <div className="text-gray-300 space-y-6">
      <section>
        <h2 className="text-xl font-semibold text-white mb-4" style={{ color: '#FFBB62' }}>
          1. Informations légales
        </h2>
        <div className="space-y-3">
          <p><strong className="text-white">Nom du site :</strong> SN-Radio</p>
          <p><strong className="text-white">Nature :</strong> Radio en ligne</p>
          <p><strong className="text-white">Propriétaire :</strong> SN-Radio</p>
          <p><strong className="text-white">Contact :</strong> sn-radio@outlook.fr</p>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-white mb-4" style={{ color: '#FFBB62' }}>
          2. Hébergement
        </h2>
        <p>
          Ce site est hébergé par un prestataire d'hébergement web. Les informations détaillées 
          concernant l'hébergeur peuvent être obtenues sur demande à l'adresse : sn-radio@outlook.fr
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-white mb-4" style={{ color: '#FFBB62' }}>
          3. Propriété intellectuelle
        </h2>
        <p>
          L'ensemble du contenu du site SN-Radio (textes, images, sons, vidéos, logo, etc.) est 
          protégé par les dispositions du Code de la propriété intellectuelle et appartient à SN-Radio 
          ou fait l'objet d'une autorisation d'utilisation.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-white mb-4" style={{ color: '#FFBB62' }}>
          4. Responsabilité
        </h2>
        <p>
          SN-Radio s'efforce de fournir des informations aussi précises que possible. Toutefois, 
          elle ne pourra être tenue responsable des omissions, des inexactitudes et des carences 
          dans la mise à jour, qu'elles soient de son fait ou du fait des tiers partenaires qui 
          lui fournissent ces informations.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-white mb-4" style={{ color: '#FFBB62' }}>
          5. Droit applicable
        </h2>
        <p>
          Les présentes mentions légales sont régies par le droit français. En cas de litige, 
          les tribunaux français seront seuls compétents.
        </p>
      </section>
    </div>
  );
}

function PolitiqueConfidentialiteContent() {
  return (
    <div className="text-gray-300 space-y-6">
      <section>
        <h2 className="text-xl font-semibold text-white mb-4" style={{ color: '#FFBB62' }}>
          1. Collecte des données
        </h2>
        <p>
          SN-Radio collecte certaines données personnelles dans le cadre de l'utilisation de ses services. 
          Ces données peuvent inclure :
        </p>
        <ul className="list-disc list-inside mt-3 space-y-1">
          <li>Données de connexion (adresse IP, type de navigateur)</li>
          <li>Données d'utilisation du site web</li>
          <li>Données de contact si vous nous contactez</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-white mb-4" style={{ color: '#FFBB62' }}>
          2. Utilisation des données
        </h2>
        <p>
          Les données collectées sont utilisées pour :
        </p>
        <ul className="list-disc list-inside mt-3 space-y-1">
          <li>Améliorer nos services et l'expérience utilisateur</li>
          <li>Analyser l'utilisation du site</li>
          <li>Répondre à vos demandes de contact</li>
          <li>Assurer la sécurité du site</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-white mb-4" style={{ color: '#FFBB62' }}>
          3. Conservation des données
        </h2>
        <p>
          Vos données personnelles sont conservées pendant la durée nécessaire aux finalités 
          pour lesquelles elles ont été collectées, dans le respect des obligations légales.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-white mb-4" style={{ color: '#FFBB62' }}>
          4. Vos droits
        </h2>
        <p>
          Conformément au RGPD, vous disposez des droits suivants :
        </p>
        <ul className="list-disc list-inside mt-3 space-y-1">
          <li>Droit d'accès à vos données personnelles</li>
          <li>Droit de rectification</li>
          <li>Droit à l'effacement</li>
          <li>Droit à la portabilité</li>
          <li>Droit d'opposition</li>
        </ul>
        <p className="mt-3">
          Pour exercer ces droits, contactez-nous à : sn-radio@outlook.fr
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-white mb-4" style={{ color: '#FFBB62' }}>
          5. Cookies
        </h2>
        <p>
          Notre site peut utiliser des cookies pour améliorer votre expérience de navigation. 
          Vous pouvez configurer votre navigateur pour refuser les cookies ou être alerté 
          lorsque des cookies sont envoyés.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-white mb-4" style={{ color: '#FFBB62' }}>
          6. Contact
        </h2>
        <p>
          Pour toute question concernant cette politique de confidentialité, vous pouvez nous 
          contacter à : sn-radio@outlook.fr
        </p>
      </section>
    </div>
  );
}

function CGUContent() {
  return (
    <div className="text-gray-300 space-y-6">
      <section>
        <h2 className="text-xl font-semibold text-white mb-4" style={{ color: '#FFBB62' }}>
          1. Objet
        </h2>
        <p>
          Les présentes Conditions Générales d'Utilisation (CGU) régissent l'utilisation du site 
          SN-Radio et de ses services. En accédant au site, vous acceptez ces conditions dans leur intégralité.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-white mb-4" style={{ color: '#FFBB62' }}>
          2. Accès au service
        </h2>
        <p>
          L'accès aux services de SN-Radio est gratuit. SN-Radio se réserve le droit de modifier, 
          suspendre ou interrompre tout ou partie de ses services à tout moment sans préavis.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-white mb-4" style={{ color: '#FFBB62' }}>
          3. Utilisation du service
        </h2>
        <p>
          L'utilisateur s'engage à :
        </p>
        <ul className="list-disc list-inside mt-3 space-y-1">
          <li>Utiliser le service de manière conforme à sa destination</li>
          <li>Ne pas porter atteinte aux droits de propriété intellectuelle</li>
          <li>Ne pas perturber le fonctionnement du service</li>
          <li>Respecter les lois et règlements en vigueur</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-white mb-4" style={{ color: '#FFBB62' }}>
          4. Propriété intellectuelle
        </h2>
        <p>
          Tous les contenus diffusés sur SN-Radio (musiques, émissions, logos, etc.) sont protégés 
          par le droit de la propriété intellectuelle. Toute reproduction, représentation, modification, 
          adaptation, traduction ou décompilation non autorisée est interdite.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-white mb-4" style={{ color: '#FFBB62' }}>
          5. Responsabilité
        </h2>
        <p>
          SN-Radio ne saurait être tenue responsable :
        </p>
        <ul className="list-disc list-inside mt-3 space-y-1">
          <li>Des interruptions de service</li>
          <li>Des dommages directs ou indirects résultant de l'utilisation du service</li>
          <li>Du contenu des sites externes vers lesquels nous pourrions rediriger</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-white mb-4" style={{ color: '#FFBB62' }}>
          6. Données personnelles
        </h2>
        <p>
          La collecte et le traitement des données personnelles sont régis par notre politique 
          de confidentialité, consultable sur cette même page.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-white mb-4" style={{ color: '#FFBB62' }}>
          7. Modification des CGU
        </h2>
        <p>
          SN-Radio se réserve le droit de modifier les présentes CGU à tout moment. 
          Les modifications entrent en vigueur dès leur publication sur le site.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-white mb-4" style={{ color: '#FFBB62' }}>
          8. Droit applicable et juridiction
        </h2>
        <p>
          Les présentes CGU sont régies par le droit français. En cas de litige, les tribunaux 
          français seront seuls compétents.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-white mb-4" style={{ color: '#FFBB62' }}>
          9. Contact
        </h2>
        <p>
          Pour toute question relative aux présentes CGU, vous pouvez nous contacter à : 
          sn-radio@outlook.fr
        </p>
      </section>
    </div>
  );
}