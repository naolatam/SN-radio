# Migration Guide - Old App to Router-Based App

## Overview
This guide helps you understand the changes and how to work with the new router-based architecture.

## Breaking Changes

### 1. Header Component - No Props Required

**Before:**
```typescript
<Header 
  onNewsClick={() => setShowNewsPage(true)}
  onUserAuthClick={() => setShowUserAuthPage(true)}
  onAdminAccess={handleAdminAccess}
  onHomeClick={handleHomeClick}
  onTeamClick={handleTeamClick}
/>
```

**After:**
```typescript
<Header />
```

**Why:** Header now uses the `useNavigation` hook internally. No props needed!

### 2. Footer Component - No Props Required

**Before:**
```typescript
<Footer onLegalPageClick={setCurrentLegalPage} />
```

**After:**
```typescript
<Footer />
```

**Why:** Footer now uses the `useNavigation` hook internally.

### 3. UserProfile Component - Simplified Props

**Before:**
```typescript
<UserProfile 
  onClose={() => setShowUserProfile(false)}
  onAdminAccess={onAdminAccess}
  onViewLikedArticles={onViewLikedArticles}
/>
```

**After:**
```typescript
<UserProfile 
  onClose={() => setShowUserProfile(false)}
/>
```

**Why:** Admin access now handled internally via `useNavigation` hook.

## How to Navigate

### In Components

**Import the hook:**
```typescript
import { useNavigation } from '@/hooks/useNavigation';
```

**Use it:**
```typescript
function MyComponent() {
  const { goHome, goToNews, goToArticle } = useNavigation();
  
  return (
    <div>
      <button onClick={goHome}>Home</button>
      <button onClick={goToNews}>News</button>
      <button onClick={() => goToArticle('123')}>Article 123</button>
    </div>
  );
}
```

### Available Navigation Methods

```typescript
const navigation = useNavigation();

// Main pages
navigation.goHome()              // Go to home page
navigation.goToNews()            // Go to news listing
navigation.goToAuth()            // Go to authentication
navigation.goToAdmin()           // Go to admin panel

// Dynamic routes
navigation.goToArticle(id)       // Go to specific article
navigation.goToLegal(page)       // Go to legal page (mentions/privacy/terms)

// Special navigation
navigation.scrollToSection(id)   // Navigate home and scroll to section
navigation.goBack()              // Browser back button
navigation.goTo(path)            // Navigate to any path
```

### URL Patterns

The app now uses proper URLs:

| Route | URL | Old Behavior |
|-------|-----|--------------|
| Home | `/` | Conditional render |
| News | `/news` | `showNewsPage=true` |
| Article | `/news/123` | `selectedArticleId='123'` |
| Auth | `/auth` | `showUserAuthPage=true` |
| Admin | `/admin` | `showAdminPage=true` |
| Legal | `/legal/privacy` | `currentLegalPage='privacy'` |
| OAuth | `/auth/callback` | `showOAuthCallback=true` |

## Common Patterns

### 1. Navigating to a Page

**Before:**
```typescript
// In App.tsx
const [showNewsPage, setShowNewsPage] = useState(false);

// Pass to component
<Component onNavigate={() => setShowNewsPage(true)} />
```

**After:**
```typescript
// In any component
import { useNavigation } from '@/hooks/useNavigation';

function Component() {
  const { goToNews } = useNavigation();
  return <button onClick={goToNews}>News</button>;
}
```

### 2. Navigating to Article

**Before:**
```typescript
const [selectedArticleId, setSelectedArticleId] = useState();
setSelectedArticleId('123');
setShowNewsPage(true);
```

**After:**
```typescript
const { goToArticle } = useNavigation();
goToArticle('123');
```

### 3. Going Back

**Before:**
```typescript
// Reset all states
setCurrentLegalPage(null);
setShowNewsPage(false);
setShowUserAuthPage(false);
// ...
```

**After:**
```typescript
const { goBack } = useNavigation();
goBack(); // Uses browser history
// OR
const { goHome } = useNavigation();
goHome(); // Go to home explicitly
```

### 4. Protected Routes (Admin Access)

**Before:**
```typescript
if (user?.role === UserRole.ADMIN || user?.role === UserRole.STAFF) {
  setShowAdminPage(true);
}
```

**After:**
```typescript
const { goToAdmin } = useNavigation();
goToAdmin(); // Protected route will handle authorization
```

The route is automatically protected:
```typescript
<ProtectedRoute requireRoles={[UserRole.ADMIN, UserRole.STAFF]}>
  <AdminPanelPage />
</ProtectedRoute>
```

## New File Locations

### Pages
All page components are now in `/src/pages/`:
- `HomePage.tsx`
- `NewsListPage.tsx`
- `AuthPage.tsx`
- `AdminPanelPage.tsx`
- `LegalPage.tsx`
- `OAuthCallbackPage.tsx`

### Layouts
Layout components in `/src/layouts/`:
- `MainLayout.tsx` - With Header and Footer
- `MinimalLayout.tsx` - Standalone

### Configuration
Route configuration in `/src/config/`:
- `routes.config.ts` - All route paths

### Routing Components
In `/src/components/routing/`:
- `ProtectedRoute.tsx` - Route guard

## Creating New Pages

### Step 1: Create Page Component
```typescript
// src/pages/MyNewPage.tsx
export default function MyNewPage() {
  return (
    <div>
      <h1>My New Page</h1>
    </div>
  );
}
```

### Step 2: Add Route to Config
```typescript
// src/config/routes.config.ts
export const ROUTES = {
  // ...existing routes
  MY_NEW_PAGE: '/my-new-page',
}
```

### Step 3: Add Route to App
```typescript
// src/App.tsx
import MyNewPage from './pages/MyNewPage';

<Route element={<MainLayout />}>
  {/* ...existing routes */}
  <Route path={ROUTES.MY_NEW_PAGE} element={<MyNewPage />} />
</Route>
```

### Step 4: Add Navigation Method (Optional)
```typescript
// src/hooks/useNavigation.ts
export function useNavigation() {
  const navigate = useNavigate();
  
  return {
    // ...existing methods
    goToMyNewPage: () => navigate(ROUTES.MY_NEW_PAGE),
  };
}
```

## Testing URLs

You can now test URLs directly:

```
http://localhost:3000/                  → Home
http://localhost:3000/news              → News List
http://localhost:3000/news/article-123  → Specific Article
http://localhost:3000/auth              → Authentication
http://localhost:3000/admin             → Admin Panel (protected)
http://localhost:3000/legal/privacy     → Privacy Policy
```

## Debugging

### Check Current Route
```typescript
import { useLocation } from 'react-router-dom';

function MyComponent() {
  const location = useLocation();
  console.log('Current path:', location.pathname);
}
```

### Check Route Params
```typescript
import { useParams } from 'react-router-dom';

function ArticlePage() {
  const { articleId } = useParams();
  console.log('Article ID:', articleId);
}
```

## Common Issues

### Issue: Navigation Not Working
**Solution:** Make sure you're inside a component that's within `<BrowserRouter>`

### Issue: 404 on Refresh
**Solution:** This is expected in development. In production, configure your server to serve `index.html` for all routes.

### Issue: Protected Route Not Working
**Solution:** Check that user authentication state is properly loaded before rendering routes.

## Benefits of New Approach

1. **Browser Integration**: Back/forward buttons work
2. **Bookmarkable URLs**: Users can bookmark specific pages
3. **Share Links**: Can share direct links to articles
4. **Better UX**: Page transitions feel more natural
5. **Developer Experience**: Easier to understand and maintain
6. **Type Safety**: All routes are typed and validated
7. **No Prop Drilling**: No need to pass callbacks through multiple levels

## Questions?

If you encounter any issues or have questions about the migration, refer to:
- `ARCHITECTURE-ROUTER.md` - Detailed architecture documentation
- `REFACTORING-SUMMARY.md` - Summary of all changes
- React Router documentation: https://reactrouter.com/
