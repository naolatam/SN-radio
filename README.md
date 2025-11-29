# Documentation Complète - Site Web SN-Radio

## 📋 Table des Matières

1. [Vue d'Ensemble](#vue-densemble)
2. [Architecture Technique](#architecture-technique)
3. [Fonctionnalités Détaillées](#fonctionnalités-détaillées)
4. [Installation et Déploiement](#installation-et-déploiement)
5. [Configuration Google OAuth](#configuration-google-oauth)

---

## 🎯 Vue d'Ensemble

SN-Radio est une plateforme web moderne de streaming radio et de gestion d'actualités, construite avec les technologies les plus récentes. Le projet est structuré en deux parties distinctes : un backend API REST et un frontend SPA (Single Page Application).

### Technologies Principales

**Backend:**
- Node.js + TypeScript
- Express.js (Framework web)
- Prisma ORM (Gestion base de données)
- MySQL
- Better Auth (Authentification moderne)
- Swagger (Documentation API)

**Frontend:**
- React 18 + TypeScript
- Vite (Build tool ultra-rapide)
- React Router v6 (Navigation)
- Tailwind CSS v4 (Styling)
- Shadcn UI + Radix UI (Composants)
- Motion (Animations fluides)
- Better Auth Client (OAuth)

---

## 🏗️ Architecture Technique

### Architecture Globale

Le projet suit une **architecture en couches (Layered Architecture)** avec séparation claire des responsabilités :

```
┌─────────────────────────────────────────┐
│           FRONTEND (SPA)                │
│  React + TypeScript + Vite              │
│  ┌───────────────────────────────────┐  │
│  │ Pages (Routing)                   │  │
│  │ Components (UI)                   │  │
│  │ Services (Domain Logic)           │  │
│  │ Hooks (Reusable Logic)            │  │
│  │ Stores (State Management)         │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
                    ↕ HTTP/HTTPS
┌─────────────────────────────────────────┐
│           BACKEND (API REST)            │
│  Node.js + Express + Prisma             │
│  ┌───────────────────────────────────┐  │
│  │ Routes (Endpoints)                │  │
│  │ Middlewares (Auth, Errors)        │  │
│  │ Controllers (HTTP Handlers)       │  │
│  │ Services (Business Logic)         │  │
│  │ Repositories (Data Access)        │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
                    ↕
┌─────────────────────────────────────────┐
│         DATABASE (MySQL)     │
└─────────────────────────────────────────┘
```

### Structure Backend (Layered Architecture)

```
back/
├── src/
│   ├── config/              # Configuration
│   │   ├── auth.config.ts      # Better Auth setup
│   │   ├── database.config.ts  # Prisma client
│   │   ├── env.config.ts       # Variables d'environnement
│   │   └── swagger.config.ts   # Documentation API
│   │
│   ├── controllers/         # Couche Présentation
│   │   ├── article.controller.ts
│   │   ├── category.controller.ts
│   │   ├── staff.controller.ts
│   │   ├── theme.controller.ts
│   │   └── user.controller.ts
│   │
│   ├── services/            # Couche Métier
│   │   ├── article.service.ts
│   │   ├── category.service.ts
│   │   ├── staff.service.ts
│   │   ├── theme.service.ts
│   │   └── user.service.ts
│   │
│   ├── repositories/        # Couche Accès Données
│   │   ├── article.repository.ts
│   │   ├── category.repository.ts
│   │   ├── like.repository.ts
│   │   ├── staff.repository.ts
│   │   ├── theme.repository.ts
│   │   └── user.repository.ts
│   │
│   ├── middlewares/         # Middlewares Express
│   │   ├── auth.middleware.ts    # Authentification
│   │   └── error.middleware.ts   # Gestion erreurs
│   │
│   ├── routes/              # Définition routes API
│   │   ├── index.ts
│   │   ├── article.routes.ts
│   │   ├── category.routes.ts
│   │   ├── staff.routes.ts
│   │   ├── theme.routes.ts
│   │   └── user.routes.ts
│   │
│   ├── types/               # Définitions TypeScript
│   │   ├── api.types.ts
│   │   ├── auth.types.ts
│   │   ├── controller.types.ts
│   │   ├── middleware.types.ts
│   │   ├── repository.types.ts
│   │   ├── service.types.ts
│   │   └── shared.types.ts
│   │
│   ├── utils/               # Utilitaires
│   │   └── contentSanitizer.ts
│   │
│   └── server.ts            # Point d'entrée
│
├── prisma/
│   ├── schema.prisma        # Schéma base de données
│   ├── migrations/          # Migrations SQL
│   └── seed-themes.ts       # Données initiales
│
└── package.json
```

### Structure Frontend (Domain-Driven Design)

```
front/
├── src/
│   ├── config/              # Configuration
│   │   ├── env.config.ts       # Variables d'environnement
│   │   └── routes.config.ts    # Routes centralisées
│   │
│   ├── lib/                 # Infrastructure
│   │   ├── auth.client.ts      # Client Better Auth
│   │   └── http.client.ts      # Client HTTP
│   │
│   ├── services/            # Services métier
│   │   ├── auth.service.ts
│   │   ├── article.service.ts
│   │   ├── category.service.ts
│   │   ├── staff.service.ts
│   │   ├── theme.service.ts
│   │   └── user.service.ts
│   │
│   ├── hooks/               # Custom React Hooks
│   │   ├── useNavigation.ts
│   │   ├── useArticles.ts
│   │   └── useLikes.ts
│   │
│   ├── pages/               # Pages (Routing)
│   │   ├── HomePage.tsx
│   │   ├── NewsListPage.tsx
│   │   ├── ArticlePage.tsx
│   │   ├── AuthPage.tsx
│   │   ├── AdminPanelPage.tsx
│   │   ├── LegalPage.tsx
│   │   ├── LikedArticlesPage.tsx
│   │   └── OAuthCallbackPage.tsx
│   │
│   ├── layouts/             # Layouts
│   │   ├── MainLayout.tsx      # Header + Footer
│   │   └── MinimalLayout.tsx   # Sans navigation
│   │
│   ├── components/          # Composants UI
│   │   ├── admin/              # Panneau d'administration
│   │   │   ├── AdminLayout.tsx
│   │   │   ├── ArticlesSection.tsx
│   │   │   ├── CategoriesSection.tsx
│   │   │   ├── StaffSection.tsx
│   │   │   └── ThemeSection.tsx
│   │   │
│   │   ├── ui/                 # Composants Shadcn/Radix
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   └── ... (50+ composants)
│   │   │
│   │   ├── routing/            # Guards de routes
│   │   │   └── ProtectedRoute.tsx
│   │   │
│   │   ├── AudioPlayer.tsx
│   │   ├── FloatingPlayer.tsx
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── NewsSection.tsx
│   │   ├── UserAuth.tsx
│   │   ├── AuthContext.tsx
│   │   ├── ThemeManagerContext.tsx
│   │   └── ...
│   │
│   ├── stores/              # State Management
│   │   └── theme.store.ts
│   │
│   ├── types/               # Types TypeScript
│   │   ├── api.types.ts
│   │   ├── auth.types.ts
│   │   ├── shared.types.ts
│   │   └── NewsArticle.ts
│   │
│   ├── styles/              # Styles globaux
│   │   └── globals.css
│   │
│   ├── App.tsx              # Configuration Router
│   └── main.tsx             # Point d'entrée
│
├── public/                  # Assets statiques
└── package.json
```

### Principes Architecturaux Appliqués

#### SOLID Principles

1. **Single Responsibility Principle (SRP)**
   - Chaque service, contrôleur, et composant a une seule responsabilité
   - Exemple : `ArticleService` gère uniquement la logique métier des articles

2. **Open/Closed Principle (OCP)**
   - Ouvert à l'extension, fermé à la modification
   - Nouvelles fonctionnalités ajoutées sans modifier le code existant

3. **Liskov Substitution Principle (LSP)**
   - Les interfaces sont respectées partout
   - Les types TypeScript garantissent la substituabilité

4. **Interface Segregation Principle (ISP)**
   - Interfaces spécifiques plutôt que générales
   - DTOs (Data Transfer Objects) pour chaque opération

5. **Dependency Inversion Principle (DIP)**
   - Dépendance sur des abstractions (interfaces, types)
   - Injection de dépendances via les constructeurs

#### DRY (Don't Repeat Yourself)

- Routes centralisées dans `routes.config.ts`
- Services réutilisables
- Hooks personnalisés pour logique partagée
- Composants UI réutilisables

#### KISS (Keep It Simple, Stupid)

- Code lisible et maintenable
- Fonctions courtes et ciblées
- Noms explicites
- Documentation claire

---

## ✨ Fonctionnalités Détaillées

### 1. 🎵 Lecteur Audio en Direct

**Description :** Lecteur de radio streaming intégré avec interface moderne.

**Caractéristiques :**
- Lecture en continu du flux radio
- Lecteur flottant qui reste visible pendant la navigation
- Contrôles play/pause
- Affichage "Now Playing" en temps réel
- Persistance de l'état de lecture
- Design responsive

**Technologies :**
- HTML5 Audio API
- React Context pour l'état global
- LocalStorage pour la persistance

**Fichiers concernés :**
- `front/src/components/AudioContext.tsx` - Gestion état audio
- `front/src/components/AudioPlayer.tsx` - Interface lecteur principal
- `front/src/components/FloatingPlayer.tsx` - Lecteur flottant
- `front/src/components/NowPlaying.tsx` - Affichage morceau en cours

### 2. 📰 Système de Gestion d'Articles (CMS)

**Description :** Système complet de publication et gestion d'articles de type blog/actualités.

**Caractéristiques :**
- **Création d'articles** avec éditeur Markdown
- **Catégorie** par article
- **Images** d'illustration (URL)
- **Articles à la une** (headline)
- **Système de likes** pour les membres
- **Filtrage** par catégorie
- **Recherche** et pagination
- **Prévisualisation** avant publication
- **Modification/Suppression** (auteurs et admins)

**Architecture :**
```
Articles ─── Categories (Many-to-Many)
    │
    └─── ArticleLike ─── Users (Many-to-Many)
    │
    └─── Author (User)
```

**Permissions :**
- **Visiteurs** : Lecture des articles
- **Membres** : Lecture + Like
- **Staff** : Création + Modification (leurs articles)
- **Admin** : Toutes opérations

**Fichiers concernés :**
- Backend :
  - `back/src/controllers/article.controller.ts`
  - `back/src/services/article.service.ts`
  - `back/src/repositories/article.repository.ts`
- Frontend :
  - `front/src/pages/NewsListPage.tsx`
  - `front/src/pages/ArticlePage.tsx`
  - `front/src/components/NewsSection.tsx`
  - `front/src/components/admin/ArticlesSection.tsx`
  - `front/src/services/article.service.ts`

**Endpoints API :**
```
GET    /api/articles              # Liste tous les articles
GET    /api/articles/:id          # Détails d'un article
POST   /api/articles              # Créer (Staff+)
PATCH  /api/articles/:id          # Modifier (Auteur/Admin)
DELETE /api/articles/:id          # Supprimer (Auteur/Admin)
POST   /api/articles/:id/like     # Liker (Membre+)
DELETE /api/articles/:id/like     # Unliker (Membre+)
GET    /api/articles/liked        # Articles likés (Membre+)
```

### 3. 🏷️ Gestion des Catégories

**Description :** Système de catégorisation des articles avec codes couleur.

**Caractéristiques :**
- **Création** de catégories personnalisées
- **Slug** unique pour URLs SEO-friendly
- **Couleur** personnalisable (HEX)
- **Modification** nom/slug/couleur
- **Suppression** (uniquement si aucun article associé)
- **Affichage visuel** avec badges colorés

**Validation :**
- Nom : requis, unique
- Slug : requis, unique, format `[a-z0-9-]+`
- Couleur : format HEX valide

**Fichiers concernés :**
- Backend :
  - `back/src/controllers/category.controller.ts`
  - `back/src/services/category.service.ts`
  - `back/src/repositories/category.repository.ts`
- Frontend :
  - `front/src/components/admin/CategoriesSection.tsx`
  - `front/src/services/category.service.ts`

**Endpoints API :**
```
GET    /api/categories            # Liste toutes
GET    /api/categories/:id        # Détails
POST   /api/categories            # Créer (Staff+)
PUT    /api/categories/:id        # Modifier (Staff+)
DELETE /api/categories/:id        # Supprimer (Admin)
```

### 4. 👥 Gestion du Staff

**Description :** Système de promotion et gestion des membres du staff radio.

**Caractéristiques :**
- **Recherche d'utilisateurs** par nom
- **Promotion** Membre → Staff
- **Rôle personnalisé** (ex: Animateur, DJ, Technicien)
- **Description** du membre (spécialités, bio)
- **Section publique** affichant l'équipe
- **Rétrogradation** Staff → Membre (Admin uniquement)
- **Modification** des informations staff

**Workflow :**
1. Admin recherche un utilisateur
2. Sélectionne l'utilisateur
3. Définit rôle + description
4. Ajoute au staff
5. Le rôle utilisateur passe de MEMBER à STAFF

**Fichiers concernés :**
- Backend :
  - `back/src/controllers/staff.controller.ts`
  - `back/src/services/staff.service.ts`
  - `back/src/repositories/staff.repository.ts`
- Frontend :
  - `front/src/components/TeamSection.tsx` (affichage public)
  - `front/src/components/admin/StaffSection.tsx` (gestion)
  - `front/src/services/staff.service.ts`

**Endpoints API :**
```
GET    /api/staff                 # Liste tous les membres staff
GET    /api/staff/:id             # Détails d'un membre
GET    /api/staff/user/:userId    # Staff par userId
POST   /api/staff                 # Ajouter au staff (Admin)
PATCH  /api/staff/:id             # Modifier (Admin)
DELETE /api/staff/:id             # Retirer du staff (Admin)
GET    /api/staff/count           # Nombre de membres (Admin)
```

### 5. 🎨 Système de Thèmes Dynamiques

**Description :** Système avancé de personnalisation visuelle avec thèmes multiples.

**Caractéristiques :**
- **Thèmes illimités** stockés en base de données
- **Personnalisation complète** :
  - Couleur primaire
  - Couleur secondaire
  - Couleur de fond
  - Couleurs de texte
  - Gradients
- **Assets personnalisables** :
  - Favicon
  - Icône (PWA)
  - Logo
  - Nom du site
- **Activation instantanée** d'un thème
- **Duplication** de thèmes existants
- **Prévisualisation** avant activation
- **Thème actif unique** à la fois
- **Cache localStorage** pour chargement rapide
- **Application automatique** des CSS variables

**Architecture du Thème :**
```typescript
interface Theme {
  id: string;
  name: string;              // "Noël", "Halloween", "Défaut"
  slug: string;              // "noel", "halloween", "default"
  description: string;
  
  // Couleurs
  primaryColor: string;      // #007EFF
  secondaryColor: string;    // #FFBB62
  backgroundColor: string;   // #12171C
  
  // Assets
  favicon: string;           // /favicon-noel.ico
  icon: string;              // /icon-noel.png
  logo: string;              // /logo-noel.png
  siteName: string;          // "SN-Radio 🎄"
  
  // Métadonnées
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

**Thèmes Pré-configurés :**
1. **Défaut** : Bleu/Orange professionnel
2. **Noël** : Rouge/Vert festif
3. **Sombre** : Violet/Indigo minimaliste

**Flux d'Application du Thème :**
```
1. Admin active un thème
   ↓
2. Backend marque isActive = true
   ↓
3. Frontend recharge le thème
   ↓
4. ThemeManagerContext construit la config
   ↓
5. Application des CSS variables
   ↓
6. Mise à jour favicon + title
   ↓
7. Cache dans localStorage
```

**Fichiers concernés :**
- Backend :
  - `back/src/controllers/theme.controller.ts`
  - `back/src/services/theme.service.ts`
  - `back/src/repositories/theme.repository.ts`
  - `back/prisma/seed-themes.ts`
- Frontend :
  - `front/src/components/admin/ThemeSection.tsx`
  - `front/src/components/ThemeManagerContext.tsx`
  - `front/src/stores/theme.store.ts`
  - `front/src/services/theme.service.ts`

**Endpoints API :**
```
GET    /api/themes                # Liste tous les thèmes
GET    /api/themes/active         # Thème actif
GET    /api/themes/:id            # Détails d'un thème
POST   /api/themes                # Créer (Admin)
PATCH  /api/themes/:id            # Modifier (Admin)
DELETE /api/themes/:id            # Supprimer (Admin)
POST   /api/themes/:id/activate   # Activer (Admin)
POST   /api/themes/:id/duplicate  # Dupliquer (Admin)
```

### 6. 🔐 Système d'Authentification (Better Auth)

**Description :** Authentification moderne avec support OAuth et email/password.

**Caractéristiques :**
- **Authentification Email/Password**
  - Inscription avec pseudo, email, mot de passe
  - Connexion sécurisée
  - Hash bcrypt des mots de passe
  - Validation des champs
  
- **OAuth Social Login**
  - Google Sign-In (configuré)
  - Extensible (GitHub, Facebook, etc.)
  - Callback automatique
  - Liaison de comptes
  
- **Gestion des Sessions**
  - Sessions sécurisées (7 jours)
  - Cookies HTTP-only
  - Renouvellement automatique
  - Déconnexion complète
  
- **Système de Rôles**
  - MEMBER (par défaut)
  - STAFF (peut créer articles)
  - ADMIN (tous privilèges)
  
- **Protection des Routes**
  - Routes publiques (articles, accueil)
  - Routes membres (likes, profil)
  - Routes staff (création articles)
  - Routes admin (panneau admin)

**Flux d'Authentification OAuth :**
```
1. Utilisateur clique "Google"
   ↓
2. Redirection vers Google
   ↓
3. Utilisateur accepte
   ↓
4. Google redirige vers /auth/callback
   ↓
5. Better Auth crée session
   ↓
6. Cookie session défini
   ↓
7. Redirection vers accueil
   ↓
8. Profil chargé automatiquement
```

**Fichiers concernés :**
- Backend :
  - `back/src/config/auth.config.ts`
  - `back/src/middlewares/auth.middleware.ts`
  - `back/src/controllers/user.controller.ts`
  - `back/src/services/user.service.ts`
- Frontend :
  - `front/src/lib/auth.client.ts`
  - `front/src/services/auth.service.ts`
  - `front/src/components/AuthContext.tsx`
  - `front/src/components/UserAuth.tsx`
  - `front/src/components/OAuthCallback.tsx`
  - `front/src/pages/AuthPage.tsx`
  - `front/src/pages/OAuthCallbackPage.tsx`

**Endpoints API (Better Auth) :**
```
POST   /api/auth/sign-up          # Inscription
POST   /api/auth/sign-in          # Connexion
POST   /api/auth/sign-out         # Déconnexion
GET    /api/auth/session          # Session actuelle
GET    /api/auth/google           # OAuth Google (redirect)
GET    /api/auth/callback/google  # Callback OAuth
```

### 7. 🧭 Navigation SPA (Single Page Application)

**Description :** Navigation fluide sans rechargement de page.

**Caractéristiques :**
- **React Router v6** pour le routing
- **URLs sémantiques** et bookmarkables
- **Navigation programmatique** via hooks
- **Historique navigateur** complet
- **Layouts multiples** :
  - MainLayout (Header + Footer)
  - MinimalLayout (Sans navigation)
- **Transitions animées** entre pages
- **Lazy loading** des composants
- **Protected Routes** pour routes sécurisées

**Routes Disponibles :**
```
/                      → HomePage (Public)
/news                  → NewsListPage (Public)
/news/:articleId       → ArticlePage (Public)
/liked                 → LikedArticlesPage (Membre+)
/auth                  → AuthPage (Public)
/auth/callback         → OAuthCallbackPage (Public)
/admin                 → AdminPanelPage (Admin/Staff)
/legal/privacy         → LegalPage (Public)
/legal/terms           → LegalPage (Public)
/legal/mentions        → LegalPage (Public)
```

**Hook de Navigation :**
```typescript
const { 
  goHome, 
  goToNews, 
  goToArticle, 
  goToAuth, 
  goToAdmin,
  goBack 
} = useNavigation();
```

**Fichiers concernés :**
- `front/src/App.tsx` - Configuration Router
- `front/src/config/routes.config.ts` - Routes centralisées
- `front/src/hooks/useNavigation.ts` - Hook navigation
- `front/src/components/routing/ProtectedRoute.tsx` - Protection routes
- `front/src/layouts/MainLayout.tsx`
- `front/src/layouts/MinimalLayout.tsx`

### 8. 📱 Interface Responsive

**Description :** Design adaptatif pour tous les écrans.

**Caractéristiques :**
- **Mobile-first** design
- **Breakpoints Tailwind** :
  - sm: 640px
  - md: 768px
  - lg: 1024px
  - xl: 1280px
  - 2xl: 1536px
- **Navigation mobile** avec menu hamburger
- **Grilles responsives**
- **Images adaptatives**
- **Touch-friendly** interfaces
- **Optimisation performance mobile**

### 9. 📊 Panneau d'Administration

**Description :** Interface complète de gestion du site.

**Sections :**

1. **Articles**
   - Créer/Modifier/Supprimer
   - Marquer comme "À la une"
   - Gérer catégories
   - Ajouter images

2. **Catégories**
   - Créer/Modifier/Supprimer
   - Personnaliser couleurs
   - Gérer slugs

3. **Staff**
   - Ajouter/Retirer membres
   - Modifier rôles/descriptions
   - Promouvoir/Rétrograder

4. **Thèmes**
   - Créer/Modifier/Supprimer
   - Activer thème
   - Dupliquer thème
   - Personnaliser couleurs/assets

**Navigation :**
- Menu latéral avec icônes
- Barre de navigation supérieure
- Bouton retour vers le site
- Bouton déconnexion

**Fichiers concernés :**
- `front/src/pages/AdminPanelPage.tsx`
- `front/src/components/admin/AdminLayout.tsx`
- `front/src/components/admin/ArticlesSection.tsx`
- `front/src/components/admin/CategoriesSection.tsx`
- `front/src/components/admin/StaffSection.tsx`
- `front/src/components/admin/ThemeSection.tsx`

### 10. 🔔 Notifications Toast

**Description :** Système de notifications élégant.

**Caractéristiques :**
- **Sonner** (bibliothèque moderne)
- Types : Success, Error, Info, Warning
- Position personnalisable
- Auto-dismiss
- Actions personnalisées
- Animations fluides

**Utilisation :**
```typescript
import { toast } from 'sonner';

toast.success('Article publié !');
toast.error('Erreur de connexion');
toast.info('Chargement...');
```

### 11. 📄 Pages Légales

**Description :** Pages mentions légales, CGU, confidentialité.

**Caractéristiques :**
- Routes dédiées (`/legal/:type`)
- Contenu modifiable
- Design cohérent
- SEO-friendly

**Fichiers concernés :**
- `front/src/pages/LegalPage.tsx`
- `front/src/components/LegalPages.tsx`

---

## 🚀 Installation et Déploiement

### Prérequis

- **Node.js** 18+ (recommandé : 20+)
- **npm** 
- **MySQL**
- **Git**
- Un éditeur de texte

### Installation Backend

#### 1. Cloner le projet
```bash
git clone https://github.com/naolatam/SN-radio.git
cd sn-radio/back
```

#### 2. Installer les dépendances
```bash
npm install
```

#### 3. Configuration environnement

Créer le fichier `.env` à la racine de `back/` :

```env
# Environment
NODE_ENV=development

# Server
PORT=5000
API_URL=http://localhost:5000

# Database (MySQL exemple)
DATABASE_URL="mysql://user:password@localhost:3306/snradio"

# Better Auth
BETTER_AUTH_SECRET=votre_secret_super_long_et_aleatoire_32_chars_min
BETTER_AUTH_URL=http://localhost:5000

# Frontend
FRONTEND_URL=http://localhost:3000

# Google OAuth (optionnel)
GOOGLE_CLIENT_ID=votre_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=votre_client_secret
```

**Générer BETTER_AUTH_SECRET :**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

#### 4. Configuration de la base de données

Générer le client Prisma :
```bash
npm run prisma:generate
```

Exécuter les migrations :
```bash
npm run prisma:migrate
```

Seed (optionnel - ajoute thèmes par défaut) :
```bash
npx tsx prisma/seed-themes.ts
```

#### 5. Lancer le serveur de développement
```bash
npm run dev
```

Le serveur démarre sur `http://localhost:5000`

API Documentation disponible sur : `http://localhost:5000/api-docs`

### Installation Frontend

#### 1. Naviguer dans le dossier frontend
```bash
cd ../front
```

#### 2. Installer les dépendances
```bash
npm install
```

#### 3. Configuration environnement

Créer le fichier `.env` à la racine de `front/` :

```env
# API Backend
VITE_API_URL=http://localhost:5000
VITE_API_BASE_URL=http://localhost:5000/api

# Frontend
VITE_FRONTEND_URL=http://localhost:3000

# Radio Stream
VITE_RADIO_STREAM_URL=http://votre-stream-radio.com/stream
VITE_RADIO_NAME=SN-Radio Live
```

#### 4. Lancer le serveur de développement
```bash
npm run dev
```

Le frontend démarre sur `http://localhost:3000`

### Build pour Production

#### Backend

```bash
cd back
npm run build
```

Cela génère le dossier `dist/` avec le code compilé TypeScript.

#### Frontend

```bash
cd front
npm run build
```

Cela génère le dossier `build/` avec les fichiers statiques optimisés.

### Déploiement sur Serveur

#### Option 1 : Serveur Linux avec Nginx + PM2

##### Backend (Node.js avec PM2)

1. **Installer PM2 globalement :**
```bash
npm install -g pm2
```

2. **Upload du code sur le serveur :**
```bash
# Depuis votre machine locale
scp -r back/ user@votre-serveur.com:/var/www/snradio/
```

3. **Sur le serveur, installer dépendances et build :**
```bash
cd /var/www/snradio/back
npm install --production
npm run build
```

4. **Configurer les variables d'environnement production :**
```bash
nano .env
```

```env
NODE_ENV=production
PORT=5000
DATABASE_URL="mysql://user:password@localhost:3306/snradio"
BETTER_AUTH_SECRET=votre_secret_production
BETTER_AUTH_URL=https://api.snradio.com
FRONTEND_URL=https://snradio.com
GOOGLE_CLIENT_ID=votre_google_client_id
GOOGLE_CLIENT_SECRET=votre_google_client_secret
```

5. **Lancer avec PM2 :**
```bash
pm2 start dist/server.js --name snradio-api
pm2 save
pm2 startup
```

6. **Vérifier les logs :**
```bash
pm2 logs snradio-api
```

##### Frontend (Fichiers statiques avec Nginx)

1. **Build et upload :**
```bash
# Local
cd front
npm run build

# Upload vers serveur
scp -r build/* user@votre-serveur.com:/var/www/snradio/frontend/
```

2. **Configuration Nginx :**

Créer le fichier `/etc/nginx/sites-available/snradio` :

```nginx
server {
    listen 443 ssl http2;
    server_name snradio.com www.snradio.com;

    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/snradio.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/snradio.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;

    # Security Headers
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header X-Frame-Options DENY;
    add_header Referrer-Policy same-origin;

    # Frontend - Fichiers statiques
    root /var/www/snradio/frontend;
    index index.html;

    # API Backend - Proxy vers Node.js
    location /api/ {
        proxy_pass http://localhost:5000/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # SPA Fallback - Crucial pour React Router
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache des assets statiques
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Ne pas cacher index.html
    location = /index.html {
        add_header Cache-Control "no-cache, no-store, must-revalidate";
    }

    # Logs
    access_log /var/log/nginx/snradio-access.log;
    error_log /var/log/nginx/snradio-error.log error;
}

# Redirection HTTP vers HTTPS
server {
    listen 80;
    server_name snradio.com www.snradio.com;
    return 301 https://$server_name$request_uri;
}
```

3. **Activer le site et redémarrer Nginx :**
```bash
sudo ln -s /etc/nginx/sites-available/snradio /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

4. **Obtenir certificat SSL (Let's Encrypt) :**
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d snradio.com -d www.snradio.com
```

#### Option 2 : Déploiement Docker

Créer `docker-compose.yml` à la racine :

```yaml
services:
  db:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: rootpassword
      MYSQL_DATABASE: snradio
      MYSQL_USER: snradio
      MYSQL_PASSWORD: snradiopass
    volumes:
      - db_data:/var/lib/mysql
    ports:
      - "3306:3306"

  backend:
    build: ./back
    ports:
      - "5000:5000"
    environment:
      DATABASE_URL: "mysql://snradio:snradiopass@db:3306/snradio"
      BETTER_AUTH_SECRET: "votre_secret"
      BETTER_AUTH_URL: "https://api.snradio.com"
      FRONTEND_URL: "https://snradio.com"
    depends_on:
      - db
    volumes:
      - ./back:/app
      - /app/node_modules

  frontend:
    build: ./front
    ports:
      - "3000:80"
    depends_on:
      - backend

volumes:
  db_data:
```

Lancer :
```bash
docker-compose up -d
```

## 🔑 Configuration Google OAuth

Pour activer la connexion Google, vous devez créer une application OAuth sur Google Cloud Platform.

### Étape 1 : Accéder à Google Cloud Console

1. Aller sur [Google Cloud Console](https://console.cloud.google.com/)
2. Se connecter avec votre compte Google
3. Créer un nouveau projet (ou sélectionner existant)

### Étape 2 : Activer Google+ API

1. Dans le menu latéral, aller à **APIs & Services** > **Library**
2. Rechercher **"Google+ API"**
3. Cliquer sur **Enable**

### Étape 3 : Configurer l'écran de consentement OAuth

1. Dans le menu, aller à **APIs & Services** > **OAuth consent screen**
2. Sélectionner **External** (pour permettre à tous d'utiliser)
3. Remplir les informations :
   - **App name** : SN-Radio
   - **User support email** : votre email
   - **Developer contact information** : votre email
4. Cliquer **Save and Continue**
5. **Scopes** : Laisser par défaut (email, profile, openid)
6. Cliquer **Save and Continue**
7. **Test users** : Ajouter des emails de test si en mode "Testing"
8. Cliquer **Save and Continue**

### Étape 4 : Créer les identifiants OAuth

1. Aller à **APIs & Services** > **Credentials**
2. Cliquer **Create Credentials** > **OAuth client ID**
3. Sélectionner **Web application**
4. Remplir :
   - **Name** : SN-Radio Web Client
   
   - **Authorized JavaScript origins** :
     ```
     http://localhost:3000
     http://localhost:5000
     https://snradio.com
     https://www.snradio.com
     ```
   
   - **Authorized redirect URIs** :
     ```
     http://localhost:5000/api/auth/callback/google
     https://api.snradio.com/api/auth/callback/google
     https://snradio.com/api/auth/callback/google
     ```

5. Cliquer **Create**

### Étape 5 : Récupérer les identifiants

Une popup affiche :
- **Client ID** : `123456789-abcdefgh.apps.googleusercontent.com`
- **Client Secret** : `GOCSPX-abcdefghijklmnop`

**⚠️ Important :** Gardez le Client Secret confidentiel !

### Étape 6 : Configurer les fichiers .env

#### Backend (.env)
```env
GOOGLE_CLIENT_ID=123456789-abcdefgh.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-abcdefghijklmnop
```

#### Frontend (.env)
Rien à configurer côté frontend, Better Auth gère automatiquement.

### Étape 7 : Redémarrer les serveurs

```bash
# Backend
cd back
npm run dev

# Frontend
cd front
npm run dev
```

### Étape 8 : Tester l'authentification

1. Aller sur `http://localhost:3000/auth`
2. Cliquer sur **"Continuer avec Google"**
3. Sélectionner votre compte Google
4. Autoriser l'accès
5. Vous devriez être redirigé et connecté

### Débogage OAuth

#### Erreur "redirect_uri_mismatch"
- Vérifier que l'URL dans **Authorized redirect URIs** correspond exactement
- Format : `http://localhost:5000/api/auth/callback/google`

#### Erreur "unauthorized_client"
- Le Client ID ou Secret est incorrect
- Vérifier les variables d'environnement

#### Callback échoue
- Vérifier les logs backend : `npm run dev`
- Vérifier la configuration Better Auth dans `back/src/config/auth.config.ts`

#### Cookie non défini
- En développement : `useSecureCookies` doit être `false`
- En production : doit être `true` avec HTTPS

### Configuration Production

Pour la production, mettre à jour les URIs autorisées :

**Authorized JavaScript origins :**
```
https://snradio.com
https://www.snradio.com
```

**Authorized redirect URIs :**
```
https://snradio.com/api/auth/callback/google
https://www.snradio.com/api/auth/callback/google
```

Et mettre `.env` en production :
```env
NODE_ENV=production
BETTER_AUTH_URL=https://snradio.com
FRONTEND_URL=https://snradio.com
GOOGLE_CLIENT_ID=votre_production_client_id
GOOGLE_CLIENT_SECRET=votre_production_client_secret
```

### Passer en Production (publier l'app)

1. Retourner à **OAuth consent screen**
2. Cliquer **PUBLISH APP**
3. Soumettre pour vérification Google (si nécessaire)
4. Une fois approuvé, tous les utilisateurs peuvent se connecter

---

## 📚 Ressources Supplémentaires

### Documentation Officielles

- **React** : https://react.dev/
- **TypeScript** : https://www.typescriptlang.org/
- **Vite** : https://vitejs.dev/
- **React Router** : https://reactrouter.com/
- **Tailwind CSS** : https://tailwindcss.com/
- **Shadcn UI** : https://ui.shadcn.com/
- **Better Auth** : https://www.better-auth.com/
- **Prisma** : https://www.prisma.io/
- **Express** : https://expressjs.com/

### API Documentation

Une fois le backend lancé, accéder à la documentation Swagger :
- **URL** : `http://localhost:5000/api-docs`
- Documentation interactive de tous les endpoints
- Possibilité de tester les requêtes directement

### Structure de Réponse API

Toutes les réponses de l'API suivent ce format :

**Succès :**
```json
{
  "success": true,
  "data": { ... }
}
```

**Erreur :**
```json
{
  "success": false,
  "error": "Message d'erreur descriptif"
}
```

### Codes HTTP Utilisés

- **200** : Succès
- **201** : Ressource créée
- **400** : Requête invalide
- **401** : Non authentifié
- **403** : Non autorisé (manque de permissions)
- **404** : Ressource non trouvée
- **409** : Conflit (ex: slug déjà utilisé)
- **500** : Erreur serveur

---

## 🎓 Conclusion

Cette documentation couvre l'ensemble des fonctionnalités, l'architecture et le déploiement du projet SN-Radio. Pour toute question ou assistance supplémentaire, contacter moi via discord: `devex._.`

**Bonne écoute ! 🚀**
