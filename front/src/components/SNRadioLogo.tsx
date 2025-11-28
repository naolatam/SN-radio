import { useThemeManager } from './ThemeManagerContext';

interface SNRadioLogoProps {
  className?: string;
  size?: number;
}

export default function SNRadioLogo({ className = "", size = 24 }: SNRadioLogoProps) {
  const { theme } = useThemeManager();

  // Use the logo from theme branding
  const logoSrc = theme.branding.logo;
  return (
    <img
      src={logoSrc}
      alt={theme.branding.siteName}
      width={size}
      height={size}
      className={className}
      style={{ objectFit: 'contain' }}
    />
  );
}