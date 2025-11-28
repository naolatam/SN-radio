import { useState } from 'react';
import { motion } from 'motion/react';
import { X, LogIn, Mail, Lock, User as UserIcon, Eye, EyeOff } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent } from './ui/card';
import { toast } from 'sonner';
import { useAuth } from './AuthContext';
import { useThemeManager } from './ThemeManagerContext';

interface UserAuthProps {
  onBack: () => void;
  onSuccess?: () => void;
}

export default function UserAuth({ onBack, onSuccess }: UserAuthProps) {
  const { login, loginWithGoogle, register } = useAuth();
  const { theme } = useThemeManager();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLogin, setIsLogin] = useState(true);

  // États pour le formulaire de connexion
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  // États pour le formulaire d'inscription
  const [registerData, setRegisterData] = useState({
    pseudo: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRegisterData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!loginData.email || !loginData.password) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }

    setIsLoading(true);

    try {
      const result = await login(loginData.email, loginData.password);
      
      if (result.success) {
        toast.success('Connexion réussie !', {
          description: 'Bienvenue sur SN-Radio'
        });
        onSuccess?.();
      } else {
        toast.error(result.error || 'Identifiants incorrects', {
          description: 'Vérifiez votre email et mot de passe'
        });
      }
    } catch (error) {
      toast.error('Erreur de connexion', {
        description: 'Veuillez réessayer plus tard'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!registerData.pseudo || !registerData.email || !registerData.password || !registerData.confirmPassword) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }

    if (registerData.password !== registerData.confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }

    if (registerData.password.length < 6) {
      toast.error('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    if (registerData.pseudo.length < 3) {
      toast.error('Le pseudo doit contenir au moins 3 caractères');
      return;
    }

    setIsLoading(true);

    try {
      const result = await register(registerData.pseudo, registerData.email, registerData.password);
      
      if (result.success) {
        toast.success('Inscription réussie !', {
          description: 'Bienvenue dans la communauté SN-Radio'
        });
        onSuccess?.();
      } else {
        toast.error(result.error || 'Erreur lors de l\'inscription', {
          description: 'Veuillez vérifier vos informations'
        });
      }
    } catch (error) {
      toast.error('Erreur lors de l\'inscription', {
        description: 'Veuillez réessayer plus tard'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      await loginWithGoogle();
    } catch (error) {
      toast.error('Erreur de connexion', {
        description: 'Veuillez réessayer plus tard'
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-md"
      >
        <Card 
          className="overflow-hidden"
          style={{ 
            background: theme.colors.background,
            borderColor: theme.colors.border 
          }}
        >
          {/* Gradient Header with Avatar */}
          <div 
            className="relative h-40 flex items-center justify-center"
            style={{
              background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.secondary} 100%)`
            }}
          >
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="absolute top-4 right-4 text-white/80 hover:text-white hover:bg-white/10"
            >
              <X className="h-5 w-5" />
            </Button>

            <div className="text-center">
              <div 
                className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-3"
              >
                <span className="text-4xl font-bold text-white">R</span>
              </div>
              <h2 className="text-2xl font-bold text-white mb-1">
                {isLogin ? 'Connexion' : 'Inscription'}
              </h2>
              <p className="text-white/80 text-sm">
                {isLogin ? 'Accédez à votre compte' : 'Créez votre compte'}
              </p>
            </div>
          </div>

          <CardContent className="p-6 space-y-4">
            {isLogin ? (
              /* Login Form */
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" style={{ color: theme.colors.text.secondary }} />
                    <Input
                      name="email"
                      type="email"
                      value={loginData.email}
                      onChange={handleLoginChange}
                      placeholder="Email"
                      className="pl-10"
                      style={{ 
                        backgroundColor: `${theme.colors.button.primary}20`,
                        borderColor: theme.colors.border,
                        color: theme.colors.text.primary 
                      }}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" style={{ color: theme.colors.text.secondary }} />
                    <Input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={loginData.password}
                      onChange={handleLoginChange}
                      placeholder="Mot de passe"
                      className="pl-10 pr-10"
                      style={{ 
                        backgroundColor: `${theme.colors.button.primary}20`,
                        borderColor: theme.colors.border,
                        color: theme.colors.text.primary 
                      }}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-0 mr-2 top-1/2 transform -translate-y-1/2"
                    >
                      {showPassword ? 
                        <EyeOff className="h-4 w-4" style={{ color: theme.colors.text.secondary }} /> : 
                        <Eye className="h-4 w-4" style={{ color: theme.colors.text.secondary }} />
                      }
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full text-white font-semibold"
                  style={{ 
                    background: 'linear-gradient(135deg, #FF9A3C 0%, #FF7A1C 100%)'
                  }}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <motion.div
                      className="h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                  ) : (
                    <LogIn className="h-4 w-4 mr-2" />
                  )}
                  {isLoading ? 'Connexion...' : 'Se connecter'}
                </Button>
              </form>
            ) : (
              /* Register Form */
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" style={{ color: theme.colors.text.secondary }} />
                    <Input
                      name="pseudo"
                      type="text"
                      value={registerData.pseudo}
                      onChange={handleRegisterChange}
                      placeholder="Pseudo"
                      className="pl-10"
                      style={{ 
                        backgroundColor: `${theme.colors.button.primary}20`,
                        borderColor: theme.colors.border,
                        color: theme.colors.text.primary 
                      }}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" style={{ color: theme.colors.text.secondary }} />
                    <Input
                      name="email"
                      type="email"
                      value={registerData.email}
                      onChange={handleRegisterChange}
                      placeholder="Email"
                      className="pl-10"
                      style={{ 
                        backgroundColor: `${theme.colors.button.primary}20`,
                        borderColor: theme.colors.border,
                        color: theme.colors.text.primary 
                      }}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" style={{ color: theme.colors.text.secondary }} />
                    <Input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={registerData.password}
                      onChange={handleRegisterChange}
                      placeholder="Mot de passe"
                      className="pl-10 pr-10"
                      style={{ 
                        backgroundColor: `${theme.colors.button.primary}20`,
                        borderColor: theme.colors.border,
                        color: theme.colors.text.primary 
                      }}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-0 mr-2 top-1/2 transform -translate-y-1/2"
                    >
                      {showPassword ? 
                        <EyeOff className="h-4 w-4" style={{ color: theme.colors.text.secondary }} /> : 
                        <Eye className="h-4 w-4" style={{ color: theme.colors.text.secondary }} />
                      }
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" style={{ color: theme.colors.text.secondary }} />
                    <Input
                      name="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      value={registerData.confirmPassword}
                      onChange={handleRegisterChange}
                      placeholder="Confirmer le mot de passe"
                      className="pl-10"
                      style={{ 
                        backgroundColor: `${theme.colors.button.primary}20`,
                        borderColor: theme.colors.border,
                        color: theme.colors.text.primary 
                      }}
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full text-white font-semibold"
                  style={{ 
                    background: 'linear-gradient(135deg, #FF9A3C 0%, #FF7A1C 100%)'
                  }}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <motion.div
                      className="h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                  ) : (
                    <UserIcon className="h-4 w-4 mr-2" />
                  )}
                  {isLoading ? 'Inscription...' : 'S\'inscrire'}
                </Button>
              </form>
            )}

            {/* Divider */}
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" style={{ borderColor: theme.colors.border }} />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="px-2 text-xs" style={{ backgroundColor: theme.colors.background, color: theme.colors.text.secondary }}>
                  Ou
                </span>
              </div>
            </div>

            {/* Google Login Button */}
            <Button
              onClick={handleGoogleLogin}
              variant="outline"
              className="w-full"
              style={{ 
                borderColor: theme.colors.border,
                color: theme.colors.text.primary
              }}
              disabled={isLoading}
            >
              <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continuer avec Google
            </Button>

            {/* Toggle between login and register */}
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm hover:underline"
                style={{ color: theme.colors.text.secondary }}
              >
                {isLogin ? "Pas encore de compte ? S'inscrire" : "Déjà un compte ? Se connecter"}
              </button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
