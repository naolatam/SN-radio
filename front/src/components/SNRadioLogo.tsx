import { useTheme } from './ThemeContext';
import defaultLogo from 'figma:asset/2139041d24232c172eb80f7428131e88b26c339b.png';
import halloweenLogo from 'figma:asset/e8935341036215cabd4e31c16801031840c23543.png';

interface SNRadioLogoProps {
  className?: string;
  size?: number;
}

export default function SNRadioLogo({ className = "", size = 24 }: SNRadioLogoProps) {
  const { theme } = useTheme();

  // Si c'est le thème Halloween, utiliser l'image Halloween
  if (theme === 'halloween') {
    return (
      <img
        src={halloweenLogo}
        alt="SN-Radio Halloween"
        width={size}
        height={size}
        className={className}
        style={{ objectFit: 'contain' }}
      />
    );
  }

  // Utiliser le logo personnalisé par défaut
  return (
    <img
      src={defaultLogo}
      alt="SN-Radio"
      width={size}
      height={size}
      className={className}
      style={{ objectFit: 'contain' }}
    />
  );
}