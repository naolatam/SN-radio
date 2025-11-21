# Frontend Domain-Driven Architecture

## Overview
The frontend has been refactored to use Better Auth SDK and follow a domain-driven architecture pattern.

## Architecture Layers

### 1. **Infrastructure Layer** (`/src/lib/`)
- `auth.client.ts` - Better Auth client configuration
- `http.client.ts` - Base HTTP client for API requests

### 2. **Domain Service Layer** (`/src/services/`)
- `auth.service.ts` - Authentication domain logic
- `article.service.ts` - Article management domain logic
- `user.service.ts` - User management domain logic
- `articlesService.tsx` - Legacy compatibility layer (deprecated)
- `index.ts` - Central export point

### 3. **Application Layer** (`/src/components/`)
- `AuthContext.tsx` - Authentication state management (uses auth.service)
- React components using domain services

### 4. **Presentation Layer**
- React components with UI logic only

## Key Changes

### Better Auth Integration
✅ Replaced manual authentication with Better Auth SDK
✅ Type-safe authentication client
✅ Automatic session management
✅ OAuth support (Google)

### Domain Services Architecture

#### Auth Service (`auth.service.ts`)
```typescript
- signIn(credentials) - Email/password login
- signUp(data) - Registration
- signInWithGoogle() - Google OAuth
- signOut() - Logout
- getSession() - Get current session
```

#### Article Service (`article.service.ts`)
```typescript
- getAll() - Get all articles
- getById(id) - Get article by ID
- create(data) - Create article (admin)
- update(id, data) - Update article (admin)
- delete(id) - Delete article (admin)
- like(id) - Like article
- unlike(id) - Unlike article
- getByCategory(category) - Filter by category
```

#### User Service (`user.service.ts`)
```typescript
- getProfile() - Get current user
- updateProfile(data) - Update profile
- getAll() - Get all users (admin)
- getById(id) - Get user by ID (admin)
- updateRole(id, role) - Update role (admin)
- delete(id) - Delete user (admin)
```

### HTTP Client (`http.client.ts`)
Generic HTTP client with methods:
- `get<T>(endpoint)`
- `post<T>(endpoint, body)`
- `put<T>(endpoint, body)`
- `patch<T>(endpoint, body)`
- `delete<T>(endpoint)`

### Navigation Fixes
✅ Header navigation now works properly
✅ All buttons (Accueil, Actualités, Équipe) redirect correctly
✅ Mobile menu navigation works

### OAuth Flow
1. User clicks "Sign in with Google"
2. `authService.signInWithGoogle()` redirects to Google
3. Google redirects to `/auth/callback`
4. `OAuthCallback` component handles redirect
5. Session is established automatically
6. User is redirected to home page

## Migration Guide

### From Old API Client
```typescript
// OLD
import { apiClient } from '../utils/api/client';
const result = await apiClient.signin(email, password);

// NEW
import { authService } from '../services/auth.service';
const result = await authService.signIn({ email, password });
```

### From ArticlesService
```typescript
// OLD
import { articlesService } from '../services/articlesService';
const articles = await articlesService.getAllArticles();

// NEW
import { articleService } from '../services/article.service';
const articles = await articleService.getAll();
```

## Benefits

1. **Type Safety** - Full TypeScript support with Better Auth types
2. **Separation of Concerns** - Clear boundaries between layers
3. **Testability** - Services can be easily mocked
4. **Maintainability** - Domain logic centralized in services
5. **Scalability** - Easy to add new services following the same pattern
6. **Better DX** - Auto-complete and type checking throughout

## File Structure

```
src/
├── lib/
│   ├── auth.client.ts         # Better Auth configuration
│   └── http.client.ts         # HTTP client
├── services/
│   ├── auth.service.ts        # Authentication domain
│   ├── article.service.ts     # Article domain
│   ├── user.service.ts        # User domain
│   ├── articlesService.tsx    # Legacy (deprecated)
│   └── index.ts               # Service exports
├── components/
│   ├── AuthContext.tsx        # Uses auth.service
│   ├── OAuthCallback.tsx      # OAuth redirect handler
│   └── ...
└── hooks/
    └── useArticles.ts         # Uses article.service
```

## Next Steps

1. Update remaining components to use domain services
2. Remove deprecated `apiClient` from `utils/api/client.tsx`
3. Add more domain services as needed (categories, likes, etc.)
4. Implement error boundaries for better error handling
5. Add loading states to services
