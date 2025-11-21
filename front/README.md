
# Site Web SN-Radio

Modern, professional radio streaming website built with React, TypeScript, and best practices.

## 🎯 Key Features

- **URL-Based Routing**: Proper React Router implementation with bookmarkable URLs
- **Best Practices**: Implements SOLID, DRY, and KISS principles
- **Type-Safe**: Full TypeScript support throughout
- **Modern Architecture**: Domain-driven design with clear separation of concerns
- **Protected Routes**: Role-based access control for admin features
- **Better Auth**: Integrated OAuth authentication with Google
- **Responsive Design**: Mobile-first, works on all devices

## 🏗️ Architecture

The project follows a modern, scalable architecture:

```
src/
├── config/          # Route configuration (DRY)
├── lib/             # Infrastructure (Auth, HTTP clients)
├── services/        # Domain services (Auth, Articles, Users)
├── hooks/           # Custom React hooks (useNavigation, useArticles)
├── layouts/         # Page layouts (MainLayout, MinimalLayout)
├── pages/           # Page components (HomePage, NewsPage, etc.)
├── components/      # Reusable UI components
│   ├── routing/     # Route guards (ProtectedRoute)
│   ├── ui/          # Shadcn UI components
│   └── ...          # Feature components
└── App.tsx          # Router configuration
```

### Documentation

- **[ARCHITECTURE-ROUTER.md](./ARCHITECTURE-ROUTER.md)** - Detailed architecture documentation
- **[REFACTORING-SUMMARY.md](./REFACTORING-SUMMARY.md)** - Summary of refactoring work
- **[MIGRATION-GUIDE.md](./MIGRATION-GUIDE.md)** - Guide for migrating from old code
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Original architecture (legacy)

## 🚀 Running the Code

### Installation
```bash
npm install
```

### Development Server
```bash
npm run dev
```
Opens at `http://localhost:3000`

### Build for Production
```bash
npm run build
```

## 📱 Routes

| URL | Page | Layout | Access |
|-----|------|--------|--------|
| `/` | Home | Main | Public |
| `/news` | News List | Main | Public |
| `/news/:id` | Article Detail | Main | Public |
| `/legal/:type` | Legal Pages | Main | Public |
| `/auth` | Authentication | Minimal | Public |
| `/auth/callback` | OAuth Callback | Minimal | Public |
| `/admin` | Admin Panel | Minimal | Protected (Admin/Staff) |

## 🎨 Tech Stack

- **Framework**: React 18 with TypeScript
- **Routing**: React Router DOM v6
- **Styling**: Tailwind CSS v4
- **UI Components**: Shadcn UI + Radix UI
- **Authentication**: Better Auth with OAuth
- **Animations**: Motion (Framer Motion)
- **HTTP Client**: Custom service layer with Better Auth SDK
- **Build Tool**: Vite

## 🔑 Key Concepts

### Navigation
Navigation is centralized using the `useNavigation` hook:

```typescript
import { useNavigation } from '@/hooks/useNavigation';

function MyComponent() {
  const { goHome, goToNews, goToArticle } = useNavigation();
  
  return (
    <button onClick={() => goToArticle('123')}>
      Read Article
    </button>
  );
}
```

### Protected Routes
Admin routes are automatically protected:

```typescript
<ProtectedRoute requireRoles={[UserRole.ADMIN, UserRole.STAFF]}>
  <AdminPanelPage />
</ProtectedRoute>
```

### Layouts
Pages use layouts to avoid code repetition:

```typescript
// Routes with Header + Footer
<Route element={<MainLayout />}>
  <Route path="/" element={<HomePage />} />
</Route>

// Routes without Header/Footer
<Route element={<MinimalLayout />}>
  <Route path="/auth" element={<AuthPage />} />
</Route>
```

## 📏 Best Practices Implemented

### SOLID Principles
- ✅ **Single Responsibility**: Each component/file has one clear purpose
- ✅ **Open/Closed**: Easy to extend without modifying existing code
- ✅ **Liskov Substitution**: Components are interchangeable
- ✅ **Interface Segregation**: Minimal, focused props
- ✅ **Dependency Inversion**: Depends on abstractions (hooks, services)

### DRY (Don't Repeat Yourself)
- ✅ Centralized route configuration
- ✅ Reusable layouts (no repeated Header/Footer)
- ✅ Shared navigation logic via hooks
- ✅ Service layer for API calls

### KISS (Keep It Simple, Stupid)
- ✅ Simple, declarative routing
- ✅ Clear component hierarchy
- ✅ Minimal prop drilling
- ✅ Straightforward navigation

## 🎯 Code Quality

- **TypeScript**: Full type safety throughout
- **No Prop Drilling**: useNavigation eliminates callback chains
- **76% Code Reduction**: App.tsx went from 326 to 77 lines
- **Separation of Concerns**: Clear layer boundaries
- **Maintainable**: Easy to find and modify code

## 🔧 Development

### Adding a New Page

1. Create page in `src/pages/MyPage.tsx`
2. Add route to `src/config/routes.config.ts`
3. Add route to `src/App.tsx`
4. Optionally add navigation method to `useNavigation` hook

### Adding a New Feature

1. Create service in `src/services/` if needed
2. Create hook in `src/hooks/` if needed
3. Create components in `src/components/`
4. Use existing navigation system

## 📊 Performance

- **Build Size**: ~613 KB (gzipped: ~190 KB)
- **Code Splitting**: Ready for route-based splitting
- **Lazy Loading**: Can be implemented easily
- **Fast Refresh**: Vite provides instant HMR

## 🤝 Contributing

When adding new code, please follow:
1. SOLID principles (especially Single Responsibility)
2. DRY principle (don't repeat code)
3. KISS principle (keep it simple)
4. TypeScript best practices
5. Existing folder structure

## 📝 License

This is a code bundle for Site Web SN-Radio. The original project is available at https://www.figma.com/design/el8ovSBQu2Vl2HhBk8yRKv/Site-Web-SN-Radio.
  