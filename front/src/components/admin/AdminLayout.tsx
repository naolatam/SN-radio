import { ReactNode, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  FileText, 
  Tag, 
  UserCog,
  Palette, 
  Menu,
  X,
  Settings,
  LogOut
} from 'lucide-react';
import { Button } from '../ui/button';
import { useThemeManager } from '../ThemeManagerContext';

interface AdminLayoutProps {
  children: ReactNode;
  activeSection: string;
  onSectionChange: (section: string) => void;
  onBack: () => void;
  onLogout: () => void;
}

const sections = [
  { id: 'articles', label: 'Articles', icon: FileText },
  { id: 'categories', label: 'Catégories', icon: Tag },
  { id: 'staff', label: 'Staff', icon: UserCog },
  { id: 'theme', label: 'Thème', icon: Palette },
];

export default function AdminLayout({ 
  children, 
  activeSection, 
  onSectionChange,
  onBack,
  onLogout 
}: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { theme } = useThemeManager();

  return (
    <div className="min-h-screen text-white" style={{ backgroundColor: theme.colors.background }}>
      {/* Top Header */}
      <div className="border-b backdrop-blur-sm sticky top-0 z-50" style={{ backgroundColor: `${theme.colors.primary}15`, borderBottomColor: `${theme.colors.primary}30` }}>
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="text-gray-400 hover:text-white lg:hidden"
              >
                {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onBack}
                className="text-gray-400 hover:text-white"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour au site
              </Button>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold">Administration SN-Radio</h1>
                <p className="text-sm text-gray-400">Panneau de gestion</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={onLogout}
              className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Déconnexion
            </Button>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed left-0 h-screen w-64 border-r z-50"
              style={{ backgroundColor: `${theme.colors.background}dd`, borderRightColor: `${theme.colors.primary}30` }}
            >
              <nav className="p-4 space-y-2">
                {sections.map((section) => {
                  const Icon = section.icon;
                  const isActive = activeSection === section.id;
                  
                  return (
                    <button
                      key={section.id}
                      onClick={() => onSectionChange(section.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                        isActive
                          ? 'text-white shadow-lg'
                          : 'text-gray-400 hover:text-white'
                      }`}
                      style={isActive ? { backgroundColor: theme.colors.primary } : {}}
                      onMouseEnter={(e) => !isActive && (e.currentTarget.style.backgroundColor = `${theme.colors.primary}20`)}
                      onMouseLeave={(e) => !isActive && (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="font-medium">{section.label}</span>
                    </button>
                  );
                })}
              </nav>

              {/* Sidebar Footer */}
              <div className="absolute bottom-0 left-0 right-0 p-4 border-t" style={{ borderTopColor: `${theme.colors.primary}30`, backgroundColor: `${theme.colors.background}dd` }}>
                <div className="flex items-center space-x-3 text-xs text-gray-500">
                  <Settings className="h-4 w-4" />
                  <span>v1.0.0</span>
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'lg:ml-0' : ''}`}>
          <div className="container mx-auto px-4 py-8">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
