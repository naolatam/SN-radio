# Frontend Architecture - Router-Based with Best Practices

## Overview
The frontend has been completely refactored to use React Router DOM and follows industry best practices including SOLID principles, DRY, and KISS.

## Architecture Principles

### SOLID Principles
- **Single Responsibility**: Each component/module has one clear purpose
- **Open/Closed**: Open for extension, closed for modification (e.g., routing system)
- **Liskov Substitution**: Components can be swapped with their variants
- **Interface Segregation**: Minimal, focused interfaces/props
- **Dependency Inversion**: Depends on abstractions (hooks, services) not concrete implementations

### DRY (Don't Repeat Yourself)
- Centralized route configuration (`routes.config.ts`)
- Reusable layouts (MainLayout, MinimalLayout)
- Shared navigation logic (useNavigation hook)
- No repeated Header/Footer code

### KISS (Keep It Simple, Stupid)
- Simple, declarative routing
- Clear component hierarchy
- Minimal prop drilling
- Straightforward navigation

## Architecture Layers

### 1. **Configuration Layer** (`/src/config/`)
- `routes.config.ts` - Centralized route paths (DRY principle)
- `env.config.ts` - Environment configuration

### 2. **Infrastructure Layer** (`/src/lib/`)
- `auth.client.ts` - Better Auth client configuration
- `http.client.ts` - Base HTTP client for API requests

### 3. **Domain Service Layer** (`/src/services/`)
- `auth.service.ts` - Authentication domain logic
- `article.service.ts` - Article management
- `category.service.ts` - Category management
- `user.service.ts` - User management
- `index.ts` - Central export point

### 4. **Hooks Layer** (`/src/hooks/`)
Custom hooks following Single Responsibility:
- `useNavigation.ts` - Navigation logic abstraction
- `useArticles.ts` - Article data management
- `useLikes.ts` - Like functionality

### 5. **Routing Layer** (`/src/components/routing/`)
- `ProtectedRoute.tsx` - Route guard component (SR principle)

### 6. **Layout Layer** (`/src/layouts/`)
Following DRY principle - shared structure:
- `MainLayout.tsx` - Header + Content + Footer
- `MinimalLayout.tsx` - Content only (auth pages)

### 7. **Pages Layer** (`/src/pages/`)
Following Single Responsibility - one page, one purpose:
- `HomePage.tsx` - Landing page
- `NewsListPage.tsx` - News articles list
- `AuthPage.tsx` - Authentication
- `AdminPanelPage.tsx` - Admin panel
- `LegalPage.tsx` - Legal pages (mentions, privacy, terms)
- `OAuthCallbackPage.tsx` - OAuth callback handler

### 8. **Components Layer** (`/src/components/`)
Reusable UI components:
- `Header.tsx` - Navigation header (uses useNavigation)
- `Footer.tsx` - Footer with links (uses useNavigation)
- `AudioPlayer.tsx` - Radio player
- `NewsSection.tsx` - News display
- `TeamSection.tsx` - Team display
- And more...

### 9. **Presentation Layer** (`/src/components/ui/`)
Shadcn UI components

## Routing Structure

### Route Configuration
All routes defined in `/src/config/routes.config.ts`:

```typescript
export const ROUTES = {
  HOME: '/',
  NEWS: '/news',
  NEWS_ARTICLE: '/news/:articleId',
  AUTH: '/auth',
  AUTH_CALLBACK: '/auth/callback',
  ADMIN: '/admin',
  LEGAL_MENTIONS: '/legal/mentions',
  LEGAL_PRIVACY: '/legal/privacy',
  LEGAL_TERMS: '/legal/terms',
}
```

### Route Structure
```
/                          → HomePage (MainLayout)
/news                      → NewsListPage (MainLayout)
/news/:articleId           → NewsListPage with article (MainLayout)
/legal/:type               → LegalPage (MainLayout)
/auth                      → AuthPage (MinimalLayout)
/auth/callback             → OAuthCallbackPage (MinimalLayout)
/admin                     → AdminPanelPage (MinimalLayout, Protected)
```

### Protected Routes
Admin routes are protected using the `ProtectedRoute` component:

```typescript
<ProtectedRoute requireRoles={[UserRole.ADMIN, UserRole.STAFF]}>
  <AdminPanelPage />
</ProtectedRoute>
```

## Navigation

### useNavigation Hook
Centralized navigation logic (DRY principle):

```typescript
const { 
  goHome,              // Navigate to home
  goToNews,            // Navigate to news page
  goToArticle,         // Navigate to specific article
  goToAuth,            // Navigate to auth page
  goToAdmin,           // Navigate to admin panel
  goToLegal,           // Navigate to legal pages
  scrollToSection,     // Navigate and scroll to section
  goBack               // Navigate back
} = useNavigation();
```

### Benefits
1. **No prop drilling** - No need to pass navigation callbacks
2. **Type safety** - All routes typed and validated
3. **DRY** - Navigation logic in one place
4. **Easy to test** - Mock the hook for testing
5. **Easy to extend** - Add new navigation methods easily

## Key Changes from Old Architecture

### Before (Prop-based Navigation)
```typescript
// Had to pass callbacks through multiple levels
<Header 
  onNewsClick={() => setShowNewsPage(true)}
  onUserAuthClick={() => setShowUserAuthPage(true)}
  onAdminAccess={handleAdminAccess}
  onHomeClick={handleHomeClick}
  onTeamClick={handleTeamClick}
/>
```

### After (Router-based Navigation)
```typescript
// Clean, no props needed
<Header />

// Inside Header:
const { goHome, goToNews, goToAuth } = useNavigation();
```

### Before (Conditional Rendering)
```typescript
if (showNewsPage) {
  return <NewsPage />;
}
if (showAdminPage) {
  return <AdminPage />;
}
// ...300 lines of conditions
```

### After (Declarative Routing)
```typescript
<Routes>
  <Route path="/" element={<HomePage />} />
  <Route path="/news" element={<NewsListPage />} />
  <Route path="/admin" element={<AdminPanelPage />} />
</Routes>
```

## Benefits of New Architecture

### 1. Maintainability
- **Single Responsibility**: Each file has one clear purpose
- **Easy to find code**: Organized by feature/layer
- **Less coupling**: Components don't know about each other

### 2. Scalability
- **Easy to add routes**: Just add to routes.config.ts
- **Easy to add pages**: Follow existing page pattern
- **Easy to add features**: Clear extension points

### 3. Type Safety
- **Full TypeScript support**: All routes and navigation typed
- **Compile-time errors**: Catch mistakes before runtime
- **Better IDE support**: Auto-complete everywhere

### 4. Developer Experience
- **Clear structure**: Easy to understand
- **Less boilerplate**: DRY eliminates repetition
- **Better debugging**: React Router DevTools support

### 5. User Experience
- **URL-based navigation**: Bookmarkable URLs
- **Browser history**: Back/forward buttons work
- **Deep linking**: Share specific pages
- **Better performance**: Code splitting by route

## File Structure

```
src/
├── config/
│   ├── routes.config.ts       # Route paths (DRY)
│   └── env.config.ts
├── lib/
│   ├── auth.client.ts         # Better Auth
│   └── http.client.ts         # HTTP client
├── services/
│   ├── auth.service.ts        # Auth domain
│   ├── article.service.ts     # Article domain
│   ├── category.service.ts    # Category domain
│   ├── user.service.ts        # User domain
│   └── index.ts
├── hooks/
│   ├── useNavigation.ts       # Navigation abstraction
│   ├── useArticles.ts
│   └── useLikes.ts
├── layouts/
│   ├── MainLayout.tsx         # Header + Footer layout
│   └── MinimalLayout.tsx      # Minimal layout
├── pages/
│   ├── HomePage.tsx           # Home page
│   ├── NewsListPage.tsx       # News list
│   ├── AuthPage.tsx           # Authentication
│   ├── AdminPanelPage.tsx     # Admin panel
│   ├── LegalPage.tsx          # Legal pages
│   └── OAuthCallbackPage.tsx  # OAuth callback
├── components/
│   ├── routing/
│   │   └── ProtectedRoute.tsx # Route guard
│   ├── Header.tsx             # Uses useNavigation
│   ├── Footer.tsx             # Uses useNavigation
│   ├── UserProfile.tsx        # Uses useNavigation
│   └── ...
└── App.tsx                    # Router setup
```

## Migration Guide

### Using Navigation
```typescript
// OLD - Prop drilling
<Component onNavigate={() => setPage('news')} />

// NEW - Use hook
import { useNavigation } from '@/hooks/useNavigation';
const { goToNews } = useNavigation();
<button onClick={goToNews}>News</button>
```

### Creating New Pages
1. Create page component in `/src/pages/`
2. Add route to `/src/config/routes.config.ts`
3. Add route to App.tsx
4. Use useNavigation hook to navigate to it

### Adding Protected Routes
```typescript
<Route 
  path="/your-path" 
  element={
    <ProtectedRoute requireRoles={[UserRole.ADMIN]}>
      <YourPage />
    </ProtectedRoute>
  } 
/>
```

## Best Practices Applied

### 1. Component Organization
- One component per file
- Named exports for utilities
- Default export for main component

### 2. Props Interface
- Minimal required props
- Clear, descriptive names
- Documented with JSDoc when needed

### 3. Hooks Usage
- Custom hooks for reusable logic
- Follow React hooks rules
- Named with 'use' prefix

### 4. Error Handling
- Protected routes for access control
- Fallback routes for 404
- Error boundaries (TODO)

### 5. Performance
- Lazy loading potential (TODO)
- Code splitting by route (TODO)
- Memoization where needed

## Next Steps

1. ✅ Implement React Router
2. ✅ Create route configuration
3. ✅ Refactor all components
4. ✅ Create page components
5. ✅ Implement layouts
6. ✅ Create navigation hook
7. ✅ Update documentation
8. 🔄 Test all routes and navigation
9. ⏳ Add error boundaries
10. ⏳ Implement lazy loading
11. ⏳ Add route-based code splitting
12. ⏳ Add loading states
13. ⏳ Add transition animations
