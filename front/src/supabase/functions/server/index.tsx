import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import { createClient } from 'jsr:@supabase/supabase-js@2';
import * as kv from './kv_store.tsx';

const app = new Hono();

// Configuration CORS et middleware
app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}));

app.use('*', logger(console.log));

// Client Supabase avec service role key pour les opérations admin
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') || '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
);

// Client Supabase avec anon key pour les opérations publiques
const publicAnonKey = Deno.env.get('SUPABASE_ANON_KEY') || '';
const supabaseClient = createClient(
  Deno.env.get('SUPABASE_URL') || '',
  publicAnonKey
);

// Middleware pour vérifier l'authentification
async function requireAuth(c: any, next: any) {
  const accessToken = c.req.header('Authorization')?.split(' ')[1];
  if (!accessToken || accessToken === publicAnonKey) {
    return c.json({ error: 'Token d\'authentification requis' }, 401);
  }

  const { data: { user }, error } = await supabase.auth.getUser(accessToken);
  if (error || !user) {
    console.log('Erreur d\'authentification:', error);
    return c.json({ error: 'Non autorisé' }, 401);
  }

  c.set('user', user);
  await next();
}

// Middleware pour vérifier les droits admin
async function requireAdmin(c: any, next: any) {
  const user = c.get('user');
  if (!user) {
    return c.json({ error: 'Utilisateur non trouvé' }, 401);
  }

  // Vérifier si l'utilisateur est admin
  const userProfile = await kv.get(`user_profile:${user.id}`);
  if (!userProfile || userProfile.role !== 'admin') {
    return c.json({ error: 'Accès admin requis' }, 403);
  }

  await next();
}

// Routes pour l'authentification

// Inscription
app.post('/make-server-cbe3875e/auth/signup', async (c) => {
  try {
    const { email, password, name } = await c.req.json();
    console.log('Tentative d\'inscription pour:', email);

    // Vérifier si l'utilisateur existe déjà
    const allProfiles = await kv.getByPrefix('user_profile:');
    const existingUser = allProfiles.find(profile => profile.value.email === email);
    
    if (existingUser) {
      console.log('Utilisateur existe déjà:', email);
      return c.json({ error: 'Un compte existe déjà avec cet email' }, 400);
    }

    // Créer l'utilisateur avec Supabase Auth
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name },
      // Confirmer automatiquement l'email car pas de serveur email configuré
      email_confirm: true
    });

    if (error) {
      console.log('Erreur lors de la création de l\'utilisateur Supabase:', error);
      return c.json({ error: error.message }, 400);
    }

    if (!data.user) {
      console.log('Aucun utilisateur retourné par Supabase lors de l\'inscription');
      return c.json({ error: 'Erreur lors de la création du compte' }, 500);
    }

    console.log('Utilisateur Supabase créé avec succès:', data.user.id);

    // Déterminer le rôle (admin pour riverfreeztv.pro@gmail.com)
    const role = email === 'riverfreeztv.pro@gmail.com' ? 'admin' : 'user';

    // Sauvegarder le profil utilisateur
    const profile = {
      id: data.user.id,
      email,
      name,
      role,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString()
    };

    await kv.set(`user_profile:${data.user.id}`, profile);
    console.log('Profil utilisateur créé avec le rôle:', role);

    return c.json({ 
      success: true, 
      user: profile
    });
  } catch (error) {
    console.log('Erreur serveur lors de l\'inscription:', error);
    return c.json({ error: 'Erreur serveur' }, 500);
  }
});

// Connexion (géré côté client avec Supabase)
app.post('/make-server-cbe3875e/auth/signin', async (c) => {
  try {
    const { email, password } = await c.req.json();
    console.log('Tentative de connexion pour:', email);

    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      console.log('Erreur de connexion Supabase:', error);
      return c.json({ error: 'Email ou mot de passe incorrect' }, 401);
    }

    if (!data.user) {
      console.log('Aucun utilisateur retourné par Supabase');
      return c.json({ error: 'Erreur d\'authentification' }, 401);
    }

    console.log('Connexion Supabase réussie pour l\'utilisateur:', data.user.id);

    // Récupérer ou créer le profil utilisateur
    let profile = await kv.get(`user_profile:${data.user.id}`);
    
    if (!profile) {
      console.log('Profil non trouvé, création d\'un nouveau profil...');
      // Créer un profil pour cet utilisateur
      const role = email === 'riverfreeztv.pro@gmail.com' ? 'admin' : 'user';
      profile = {
        id: data.user.id,
        email: data.user.email || email,
        name: data.user.user_metadata?.name || email.split('@')[0],
        role,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      };
      await kv.set(`user_profile:${data.user.id}`, profile);
      console.log('Nouveau profil créé avec le rôle:', role);
    } else {
      // Mettre à jour lastLogin
      await kv.set(`user_profile:${data.user.id}`, {
        ...profile,
        lastLogin: new Date().toISOString()
      });
      console.log('Profil existant mis à jour, rôle:', profile.role);
    }

    return c.json({ 
      success: true,
      session: data.session,
      user: data.user,
      profile
    });
  } catch (error) {
    console.log('Erreur serveur lors de la connexion:', error);
    return c.json({ error: 'Erreur serveur' }, 500);
  }
});

// Obtenir le profil utilisateur
app.get('/make-server-cbe3875e/auth/profile', requireAuth, async (c) => {
  try {
    const user = c.get('user');
    const profile = await kv.get(`user_profile:${user.id}`);
    
    if (!profile) {
      return c.json({ error: 'Profil non trouvé' }, 404);
    }

    return c.json({ profile });
  } catch (error) {
    console.log('Erreur lors de la récupération du profil:', error);
    return c.json({ error: 'Erreur serveur' }, 500);
  }
});

// Obtenir les articles likés par un utilisateur
app.get('/make-server-cbe3875e/users/:userId/likes', requireAuth, async (c) => {
  try {
    const userId = c.req.param('userId');
    const currentUser = c.get('user');
    
    // Vérifier que l'utilisateur demande ses propres likes ou est admin
    if (currentUser.id !== userId) {
      const profile = await kv.get(`user_profile:${currentUser.id}`);
      if (!profile || profile.role !== 'admin') {
        return c.json({ error: 'Accès non autorisé' }, 403);
      }
    }

    // Récupérer tous les articles
    const articlesData = await kv.getByPrefix('article:');
    const likedArticles = articlesData
      .map(item => item.value)
      .filter(article => article && article.id && article.likedBy?.includes(userId))
      .map(article => ({
        ...article,
        title: article.title || 'Titre non disponible',
        content: article.content || 'Contenu non disponible',
        category: article.category || 'non-classé',
        authorName: article.authorName || 'Auteur inconnu',
        createdAt: article.createdAt || new Date().toISOString(),
        likes: article.likes || 0,
        likedBy: article.likedBy || [],
        tags: article.tags || []
      }))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    return c.json({ 
      likes: likedArticles,
      count: likedArticles.length 
    });
  } catch (error) {
    console.log('Erreur lors de la récupération des likes:', error);
    return c.json({ error: 'Erreur serveur' }, 500);
  }
});

// Routes pour la gestion des thèmes

// Obtenir le thème actuel
app.get('/make-server-cbe3875e/theme', async (c) => {
  try {
    const theme = await kv.get('site_theme') || 'default';
    return c.json({ theme });
  } catch (error) {
    console.log('Erreur lors de la récupération du thème:', error);
    return c.json({ error: 'Erreur serveur' }, 500);
  }
});

// Changer le thème (admin uniquement)
app.post('/make-server-cbe3875e/theme', requireAuth, requireAdmin, async (c) => {
  try {
    const { theme } = await c.req.json();
    
    if (!['default', 'halloween'].includes(theme)) {
      return c.json({ error: 'Thème invalide' }, 400);
    }

    await kv.set('site_theme', theme);
    return c.json({ success: true, theme });
  } catch (error) {
    console.log('Erreur lors du changement de thème:', error);
    return c.json({ error: 'Erreur serveur' }, 500);
  }
});

// Routes pour les articles

// Obtenir tous les articles
app.get('/make-server-cbe3875e/articles', async (c) => {
  try {
    const articlesData = await kv.getByPrefix('article:');
    const articles = articlesData
      .map(item => item.value)
      .filter(article => article && article.id && typeof article.id === 'string')
      .map(article => ({
        ...article,
        title: article.title || 'Titre non disponible',
        content: article.content || 'Contenu non disponible',
        category: article.category || 'non-classé',
        authorName: article.authorName || 'Auteur inconnu',
        createdAt: article.createdAt || new Date().toISOString(),
        updatedAt: article.updatedAt || new Date().toISOString(),
        likes: article.likes || 0,
        likedBy: article.likedBy || [],
        tags: article.tags || []
      }))
      .sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    
    return c.json({ articles });
  } catch (error) {
    console.log('Erreur lors de la récupération des articles:', error);
    return c.json({ error: 'Erreur serveur' }, 500);
  }
});

// Créer un article (admin uniquement)
app.post('/make-server-cbe3875e/articles', requireAuth, requireAdmin, async (c) => {
  try {
    const { title, content, imageUrl, category, tags } = await c.req.json();
    const user = c.get('user');
    
    const articleId = crypto.randomUUID();
    const article = {
      id: articleId,
      title,
      content,
      imageUrl,
      category,
      tags: tags || [],
      authorId: user.id,
      authorName: (await kv.get(`user_profile:${user.id}`))?.name || 'Administrateur',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      likes: 0,
      likedBy: []
    };

    await kv.set(`article:${articleId}`, article);
    return c.json({ success: true, article });
  } catch (error) {
    console.log('Erreur lors de la création de l\'article:', error);
    return c.json({ error: 'Erreur serveur' }, 500);
  }
});

// Supprimer un article (admin uniquement)
app.delete('/make-server-cbe3875e/articles/:id', requireAuth, requireAdmin, async (c) => {
  try {
    const articleId = c.req.param('id');
    await kv.del(`article:${articleId}`);
    return c.json({ success: true });
  } catch (error) {
    console.log('Erreur lors de la suppression de l\'article:', error);
    return c.json({ error: 'Erreur serveur' }, 500);
  }
});

// Liker/unliker un article
app.post('/make-server-cbe3875e/articles/:id/like', requireAuth, async (c) => {
  try {
    const articleId = c.req.param('id');
    const user = c.get('user');
    
    const article = await kv.get(`article:${articleId}`);
    if (!article) {
      return c.json({ error: 'Article non trouvé' }, 404);
    }

    const likedBy = article.likedBy || [];
    const hasLiked = likedBy.includes(user.id);
    
    if (hasLiked) {
      // Retirer le like
      article.likedBy = likedBy.filter(id => id !== user.id);
      article.likes = Math.max(0, article.likes - 1);
    } else {
      // Ajouter le like
      article.likedBy = [...likedBy, user.id];
      article.likes = article.likes + 1;
    }

    await kv.set(`article:${articleId}`, article);
    return c.json({ 
      success: true, 
      liked: !hasLiked, 
      likes: article.likes 
    });
  } catch (error) {
    console.log('Erreur lors du like/unlike:', error);
    return c.json({ error: 'Erreur serveur' }, 500);
  }
});

// Gestion des utilisateurs (admin uniquement)

// Obtenir tous les utilisateurs
app.get('/make-server-cbe3875e/admin/users', requireAuth, requireAdmin, async (c) => {
  try {
    const usersData = await kv.getByPrefix('user_profile:');
    const users = usersData
      .map(item => item.value)
      .filter(user => user && user.id && typeof user.id === 'string')
      .map(user => ({
        ...user,
        name: user.name || 'Utilisateur sans nom',
        email: user.email || 'Email non disponible',
        role: user.role || 'user',
        createdAt: user.createdAt || new Date().toISOString()
      }));
    
    return c.json({ users });
  } catch (error) {
    console.log('Erreur lors de la récupération des utilisateurs:', error);
    return c.json({ error: 'Erreur serveur' }, 500);
  }
});

// Supprimer un utilisateur
app.delete('/make-server-cbe3875e/admin/users/:id', requireAuth, requireAdmin, async (c) => {
  try {
    const userId = c.req.param('id');
    
    // Supprimer le profil
    await kv.del(`user_profile:${userId}`);
    
    // Supprimer l'utilisateur de Supabase Auth
    const { error } = await supabase.auth.admin.deleteUser(userId);
    if (error) {
      console.log('Erreur lors de la suppression Supabase:', error);
    }
    
    return c.json({ success: true });
  } catch (error) {
    console.log('Erreur lors de la suppression de l\'utilisateur:', error);
    return c.json({ error: 'Erreur serveur' }, 500);
  }
});

// Changer le rôle d'un utilisateur
app.put('/make-server-cbe3875e/admin/users/:id/role', requireAuth, requireAdmin, async (c) => {
  try {
    const userId = c.req.param('id');
    const { role } = await c.req.json();
    
    if (!['user', 'admin'].includes(role)) {
      return c.json({ error: 'Rôle invalide' }, 400);
    }
    
    const profile = await kv.get(`user_profile:${userId}`);
    if (!profile) {
      return c.json({ error: 'Utilisateur non trouvé' }, 404);
    }
    
    await kv.set(`user_profile:${userId}`, {
      ...profile,
      role
    });
    
    return c.json({ success: true });
  } catch (error) {
    console.log('Erreur lors du changement de rôle:', error);
    return c.json({ error: 'Erreur serveur' }, 500);
  }
});

// Initialisation : créer l'admin par défaut si il n'existe pas
async function initializeAdmin() {
  try {
    // Vérifier si l'admin existe déjà en cherchant par email
    const allProfiles = await kv.getByPrefix('user_profile:');
    const adminExists = allProfiles.some(profile => 
      profile.value.email === 'riverfreeztv.pro@gmail.com' && profile.value.role === 'admin'
    );

    if (!adminExists) {
      console.log('Création de l\'utilisateur admin par défaut...');
      
      // Créer l'utilisateur admin par défaut
      const { data, error } = await supabase.auth.admin.createUser({
        email: 'riverfreeztv.pro@gmail.com',
        password: 'snradio2025',
        user_metadata: { name: 'RiverFreez-TV' },
        email_confirm: true
      });

      if (error) {
        console.log('Erreur lors de la création de l\'admin:', error);
        // Si l'utilisateur existe déjà dans Supabase Auth, essayer de le récupérer
        if (error.message.includes('already exists') || error.message.includes('already been registered')) {
          console.log('L\'utilisateur admin existe déjà dans Supabase Auth, création du profil...');
          // Pour l'instant, on va créer un profil avec un ID générique
          // Dans un vrai cas, il faudrait récupérer l'ID depuis Supabase
          const userId = crypto.randomUUID();
          await kv.set(`user_profile:${userId}`, {
            id: userId,
            email: 'riverfreeztv.pro@gmail.com',
            name: 'RiverFreez-TV',
            role: 'admin',
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString()
          });
          console.log('Profil admin créé avec succès');
        }
      } else if (data.user) {
        await kv.set(`user_profile:${data.user.id}`, {
          id: data.user.id,
          email: 'riverfreeztv.pro@gmail.com',
          name: 'RiverFreez-TV',
          role: 'admin',
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString()
        });
        console.log('Utilisateur admin par défaut créé avec succès');
      }
    } else {
      console.log('Utilisateur admin existe déjà');
    }

    // Initialiser le thème par défaut
    const currentTheme = await kv.get('site_theme');
    if (!currentTheme) {
      await kv.set('site_theme', 'default');
      console.log('Thème par défaut initialisé');
    }
  } catch (error) {
    console.log('Erreur lors de l\'initialisation:', error);
  }
}

// Initialiser au démarrage
initializeAdmin();

// Route de santé
app.get('/make-server-cbe3875e/health', (c) => {
  return c.json({ status: 'OK', timestamp: new Date().toISOString() });
});

Deno.serve(app.fetch);