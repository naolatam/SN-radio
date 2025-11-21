import { useState } from 'react';
import { motion } from 'motion/react';
import { Palette, Eye, Settings as SettingsIcon } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader } from '../ui/card';
import { useTheme, Theme } from '../ThemeContext';
import { toast } from 'sonner';

export default function ThemeSection() {
  const { theme, setTheme } = useTheme();
  const [isChanging, setIsChanging] = useState(false);

  const handleThemeChange = async (newTheme: Theme) => {
    setIsChanging(true);
    try {
      await setTheme(newTheme);
      const themeLabel = newTheme === 'halloween' ? 'Halloween' : 'Défaut';
      toast.success(`Thème changé vers ${themeLabel}`);
    } catch (error) {
      console.error('Error changing theme:', error);
      toast.error('Erreur lors du changement de thème');
    } finally {
      setIsChanging(false);
    }
  };

  const themes = [
    {
      id: 'default' as Theme,
      name: 'Thème Défaut',
      description: 'Bleu et Orange classique de SN-Radio',
      colors: [
        { label: 'Bleu primaire', value: '#007EFF' },
        { label: 'Orange secondaire', value: '#FFBB62' },
        { label: 'Arrière-plan sombre', value: '#12171C' },
      ],
    },
    {
      id: 'halloween' as Theme,
      name: 'Thème Halloween',
      description: 'Orange citrouille et jaune spooky',
      colors: [
        { label: 'Orange citrouille', value: '#FF6600' },
        { label: 'Jaune khaki', value: '#F0E68C' },
        { label: 'Arrière-plan sombre', value: '#1A0E0E' },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Gestion des Thèmes</h2>
          <p className="text-sm text-gray-400 mt-1">
            Thème actuel: {theme === 'halloween' ? 'Halloween' : 'Défaut'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {themes.map((themeOption) => {
          const isActive = theme === themeOption.id;
          
          return (
            <motion.div
              key={themeOption.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Card className={`bg-gray-800 border-gray-700 transition-all duration-200 ${
                isActive ? 'ring-2 ring-blue-500' : ''
              }`}>
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full ${
                      themeOption.id === 'default' 
                        ? 'bg-gradient-to-r from-blue-500 to-orange-400'
                        : 'bg-gradient-to-r from-orange-600 to-yellow-400'
                    }`}></div>
                    <div>
                      <h3 className="font-semibold text-white">{themeOption.name}</h3>
                      <p className="text-sm text-gray-400">{themeOption.description}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 mb-4">
                    {themeOption.colors.map((color, idx) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: color.value }}
                        ></div>
                        <span className="text-sm text-gray-300">
                          {color.label} <code className="text-xs">({color.value})</code>
                        </span>
                      </div>
                    ))}
                  </div>
                  
                  <Button
                    onClick={() => handleThemeChange(themeOption.id)}
                    disabled={isActive || isChanging}
                    className={`w-full ${
                      isActive 
                        ? 'bg-green-600 hover:bg-green-700' 
                        : themeOption.id === 'halloween'
                        ? 'bg-orange-600 hover:bg-orange-700'
                        : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                  >
                    {isChanging ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="mr-2"
                      >
                        <SettingsIcon className="h-4 w-4" />
                      </motion.div>
                    ) : isActive ? (
                      <>
                        <Eye className="h-4 w-4 mr-2" />
                        Thème Actuel
                      </>
                    ) : (
                      <>
                        <Palette className="h-4 w-4 mr-2" />
                        Activer ce Thème
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <SettingsIcon className="h-5 w-5 text-blue-400 mt-0.5" />
          <div>
            <h3 className="font-medium text-blue-300 mb-1">Information importante</h3>
            <p className="text-sm text-blue-200">
              Le changement de thème est <strong>global</strong> et affecte tous les visiteurs du site immédiatement. 
              Les utilisateurs connectés verront le nouveau thème se mettre à jour automatiquement.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
