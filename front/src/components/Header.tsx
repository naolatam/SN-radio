/**
 * Header - Single Responsibility: Display navigation header
 * Following KISS principle - uses React Router for navigation
 * Dependency Inversion: Depends on navigation abstraction (useNavigation hook)
 */
import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useLocation } from 'react-router-dom';
import { Menu, X, Lock, User, LogIn, Axe } from 'lucide-react';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import SNRadioLogo from './SNRadioLogo';

import { useAuth } from './AuthContext';
import { useTheme } from './ThemeContext';
import { useNavigation } from '@/hooks/useNavigation';
import UserProfile from './UserProfile';
import { UserRole } from '@/types/shared.types';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const { themeColors } = useTheme();
  const { goHome, goToNews, goToAuth, scrollToSection } = useNavigation();
  const location = useLocation();
  const isStaff = user?.role === UserRole.ADMIN || user?.role === UserRole.STAFF;
  
  const isHomePage = location.pathname === '/';
  
  const handleTeamClick = () => {
    if (isHomePage) {
      // Already on home page, just scroll
      const element = document.getElementById('equipe');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // Navigate to home and scroll
      scrollToSection('equipe');
    }
  };
  
  const navItems = [
    { name: 'Accueil', action: goHome },
    { name: 'Actualités', action: goToNews },
    { name: 'Équipe', action: handleTeamClick },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-sm border-b" style={{backgroundColor: `${themeColors.background}95`, borderBottomColor: themeColors.border}}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            className="flex items-center space-x-2 md:space-x-3 cursor-pointer"
            onClick={goHome}
          >
            <div className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center">
              <SNRadioLogo 
                size={40}
                className="text-white"
              />
            </div>
            <span className="text-xl md:text-2xl font-bold" style={{color: themeColors.text.primary}}>
              SN-Radio
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4 lg:space-x-8">
            <nav className="flex space-x-4 lg:space-x-8">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={item.action}
                  className="text-gray-300 hover:text-white transition-colors duration-200 cursor-pointer"
                >
                  {item.name}
                </button>
              ))}
            </nav>
            
            {/* User Auth Section */}
            <div className="flex items-center space-x-3">
              {isAuthenticated && user ? (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowUserProfile(true)}
                  className="text-gray-300 hover:text-white flex items-center space-x-2 border border-transparent hover:border-gray-600"
                >
                  <Avatar className="h-7 w-7">
                    <AvatarImage src={user.image || undefined} alt={user.name || 'User Avatar'} />
                    <AvatarFallback 
                      className="text-xs font-medium"
                      style={{ background: themeColors.button.primary }}
                    >
                      {user.name?.charAt(0)?.toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden lg:inline">{user.name}</span>
                  {isStaff ? (
                    <Axe className="h-3 w-3" style={{ color: themeColors.secondary }} />
                  ) : (
                    <User className="h-3 w-3" style={{ color: themeColors.primary }} />
                  )}
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={goToAuth}
                  className="text-gray-300 hover:text-white border border-gray-600 hover:border-gray-400"
                >
                  <LogIn className="h-4 w-4 mr-2" />
                  <span className="hidden lg:inline">Connexion</span>
                </Button>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-gray-300 hover:text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t" style={{borderTopColor: '#ffffff20'}}>
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => {
                  item.action?.();
                  setIsMenuOpen(false);
                }}
                className="block py-2 text-gray-300 hover:text-white transition-colors duration-200 w-full text-left"
              >
                {item.name}
              </button>
            ))}
            
            {/* Mobile User Auth */}
            {isAuthenticated && user ? (
              <button
                onClick={() => {
                  setShowUserProfile(true);
                  setIsMenuOpen(false);
                }}
                className="flex items-center py-2 text-gray-300 hover:text-white transition-colors duration-200 w-full text-left"
              >
                <Avatar className="h-5 w-5 mr-2">
                  <AvatarFallback 
                    className="text-xs"
                    style={{ background: themeColors.button.primary }}
                  >
                    {user.name?.charAt(0)?.toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                {user.name}
                {isStaff ? (
                  <Lock className="h-3 w-3 ml-2" style={{ color: themeColors.secondary }} />
                ) : (
                  <User className="h-3 w-3 ml-2" style={{ color: themeColors.primary }} />
                )}
              </button>
            ) : (
              <button
                onClick={() => {
                  goToAuth();
                  setIsMenuOpen(false);
                }}
                className="flex items-center py-2 text-gray-300 hover:text-white transition-colors duration-200 w-full text-left"
              >
                <LogIn className="h-4 w-4 mr-2" />
                Se connecter
              </button>
            )}
          </nav>
        )}
      </div>

      {/* User Profile Modal - Rendered via Portal */}
      {showUserProfile && createPortal(
        <UserProfile 
          onClose={() => setShowUserProfile(false)}
        />,
        document.body
      )}
    </header>
  );
}