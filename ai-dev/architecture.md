# Simple Habit Tracking App MVP - Architecture Document

## Overview
A minimal, intuitive web application for daily habit tracking built with Next.js and Supabase, designed for rapid deployment and demo readiness within two hours.

## Tech Stack
- **Frontend**: Next.js 14 (App Router)
- **Backend**: Supabase (Database + Authentication)
- **Styling**: Tailwind CSS
- **State Management**: Zustand + React Context
- **Mobile Testing**: PWA + Responsive Design
- **Deployment**: Vercel

## File & Folder Structure

```
habit-tracker-mvp/
├── README.md
├── package.json
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
├── .env.local
├── .env.example
├── public/
│   ├── favicon.ico
│   ├── manifest.json
│   └── icons/
│       ├── icon-192x192.png
│       └── icon-512x512.png
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root layout with providers
│   │   ├── page.tsx                # Home/Dashboard page
│   │   ├── login/
│   │   │   └── page.tsx            # Authentication page
│   │   ├── habits/
│   │   │   ├── page.tsx            # Habits management page
│   │   │   └── [id]/
│   │   │       └── page.tsx        # Individual habit details
│   │   ├── analytics/
│   │   │   └── page.tsx            # Analytics/stats page
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   └── callback/
│   │   │   │       └── route.ts    # Auth callback handler
│   │   │   └── habits/
│   │   │       ├── route.ts        # CRUD operations for habits
│   │   │       └── [id]/
│   │   │           └── completions/
│   │   │               └── route.ts # Habit completion operations
│   │   ├── globals.css             # Global styles
│   │   └── loading.tsx             # Global loading component
│   ├── components/
│   │   ├── ui/                     # Reusable UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Calendar.tsx
│   │   │   └── Heatmap.tsx
│   │   ├── auth/
│   │   │   ├── AuthProvider.tsx    # Authentication context provider
│   │   │   ├── LoginForm.tsx       # Login/signup form
│   │   │   └── ProtectedRoute.tsx  # Route protection wrapper
│   │   ├── habits/
│   │   │   ├── HabitList.tsx       # List of all habits
│   │   │   ├── HabitCard.tsx       # Individual habit display
│   │   │   ├── HabitForm.tsx       # Add/edit habit form
│   │   │   ├── HabitStreak.tsx     # Streak display component
│   │   │   └── CompletionButton.tsx # Quick completion toggle
│   │   ├── dashboard/
│   │   │   ├── DashboardStats.tsx  # Daily overview stats
│   │   │   ├── TodayHabits.tsx     # Today's habits list
│   │   │   └── ProgressChart.tsx   # Visual progress representation
│   │   ├── analytics/
│   │   │   ├── HeatmapView.tsx     # Calendar heatmap
│   │   │   ├── StreakChart.tsx     # Streak visualization
│   │   │   └── CompletionRates.tsx # Success rate analytics
│   │   └── layout/
│   │       ├── Header.tsx          # App header with navigation
│   │       ├── Navigation.tsx      # Mobile-friendly navigation
│   │       └── Footer.tsx          # App footer
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts           # Supabase client configuration
│   │   │   ├── server.ts           # Server-side Supabase client
│   │   │   └── auth.ts             # Authentication utilities
│   │   ├── stores/
│   │   │   ├── habitStore.ts       # Zustand store for habits
│   │   │   ├── authStore.ts        # Zustand store for auth state
│   │   │   └── uiStore.ts          # UI state management
│   │   ├── utils/
│   │   │   ├── date.ts             # Date utility functions
│   │   │   ├── streak.ts           # Streak calculation logic
│   │   │   ├── completion.ts       # Completion rate calculations
│   │   │   └── validation.ts       # Form validation schemas
│   │   ├── types/
│   │   │   ├── habit.ts            # Habit-related type definitions
│   │   │   ├── user.ts             # User-related type definitions
│   │   │   └── api.ts              # API response type definitions
│   │   └── constants/
│   │       ├── colors.ts           # Theme colors for heatmap/charts
│   │       └── habits.ts           # Default habit categories/templates
│   └── hooks/
│       ├── useHabits.ts            # Custom hook for habit operations
│       ├── useAuth.ts              # Authentication hook
│       ├── useLocalStorage.ts      # Local storage management
│       └── useMediaQuery.ts        # Responsive design hook
```

## Database Schema (Supabase)

### Tables

#### `profiles`
```sql
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### `habits`
```sql
CREATE TABLE habits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title VARCHAR(100) NOT NULL,
  description TEXT,
  color VARCHAR(7) DEFAULT '#3B82F6',
  category VARCHAR(50),
  target_frequency INTEGER DEFAULT 1, -- times per day
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### `habit_completions`
```sql
CREATE TABLE habit_completions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  habit_id UUID REFERENCES habits(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  completed_date DATE NOT NULL,
  completed_count INTEGER DEFAULT 1,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(habit_id, completed_date)
);
```

### Row Level Security (RLS) Policies
```sql
-- Profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Habits
ALTER TABLE habits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own habits" ON habits FOR ALL USING (auth.uid() = user_id);

-- Habit Completions
ALTER TABLE habit_completions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own completions" ON habit_completions FOR ALL USING (auth.uid() = user_id);
```

## Component Architecture & Responsibilities

### Core Components

#### **AuthProvider** (`src/components/auth/AuthProvider.tsx`)
- **Purpose**: Manages global authentication state
- **Responsibilities**: 
  - Supabase auth session management
  - User profile loading
  - Auth state persistence
- **State**: Current user, loading states, auth errors

#### **HabitStore** (`src/lib/stores/habitStore.ts`)
- **Purpose**: Global habit state management using Zustand
- **Responsibilities**:
  - CRUD operations for habits
  - Completion tracking
  - Local state synchronization with Supabase
- **State**: Habits array, loading states, error handling

#### **Dashboard Components** (`src/components/dashboard/`)
- **DashboardStats**: Today's completion overview, streak counters
- **TodayHabits**: Quick-action list for today's habits
- **ProgressChart**: Weekly/monthly progress visualization

#### **Habit Management** (`src/components/habits/`)
- **HabitList**: Grid/list view of all habits
- **HabitCard**: Individual habit with completion button and stats
- **HabitForm**: Modal form for creating/editing habits
- **CompletionButton**: One-click completion toggle with visual feedback

#### **Analytics Components** (`src/components/analytics/`)
- **HeatmapView**: Calendar-style completion heatmap
- **StreakChart**: Visual streak progression
- **CompletionRates**: Statistical insights and trends

## State Management Architecture

### Global State (Zustand Stores)

#### **Habit Store** (`habitStore.ts`)
```typescript
interface HabitState {
  habits: Habit[]
  completions: HabitCompletion[]
  loading: boolean
  error: string | null
  
  // Actions
  fetchHabits: () => Promise<void>
  createHabit: (habit: CreateHabitInput) => Promise<void>
  updateHabit: (id: string, updates: Partial<Habit>) => Promise<void>
  deleteHabit: (id: string) => Promise<void>
  toggleCompletion: (habitId: string, date: string) => Promise<void>
  fetchCompletions: (dateRange: DateRange) => Promise<void>
}
```

#### **Auth Store** (`authStore.ts`)
```typescript
interface AuthState {
  user: User | null
  profile: Profile | null
  loading: boolean
  
  // Actions
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  updateProfile: (updates: Partial<Profile>) => Promise<void>
}
```

#### **UI Store** (`uiStore.ts`)
```typescript
interface UIState {
  sidebarOpen: boolean
  currentView: 'dashboard' | 'habits' | 'analytics'
  selectedDate: Date
  theme: 'light' | 'dark'
  
  // Actions
  toggleSidebar: () => void
  setView: (view: string) => void
  setSelectedDate: (date: Date) => void
}
```

### Local Component State
- Form inputs and validation
- Modal open/close states
- Loading states for individual operations
- Temporary UI states (hover, focus)

## Service Layer Architecture

### Supabase Client (`src/lib/supabase/client.ts`)
```typescript
// Browser-side client for client components
export const supabase = createClient(url, anonKey)

// Server-side client for server components and API routes
export const createServerClient = () => createClient(url, anonKey, {
  auth: { persistSession: false }
})
```

### API Routes (`src/app/api/`)

#### **Habits API** (`/api/habits`)
- `GET /api/habits` - Fetch user's habits
- `POST /api/habits` - Create new habit
- `PUT /api/habits/[id]` - Update habit
- `DELETE /api/habits/[id]` - Delete habit

#### **Completions API** (`/api/habits/[id]/completions`)
- `GET /api/habits/[id]/completions` - Fetch completion history
- `POST /api/habits/[id]/completions` - Mark habit as completed
- `DELETE /api/habits/[id]/completions` - Remove completion

### Custom Hooks (`src/hooks/`)

#### **useHabits** - Habit Operations Hook
```typescript
export const useHabits = () => {
  const store = useHabitStore()
  
  return {
    habits: store.habits,
    loading: store.loading,
    createHabit: store.createHabit,
    toggleCompletion: store.toggleCompletion,
    getStreakForHabit: (habitId: string) => calculateStreak(store.completions, habitId),
    getTodaysHabits: () => filterHabitsForToday(store.habits, store.completions)
  }
}
```

#### **useAuth** - Authentication Hook
```typescript
export const useAuth = () => {
  const store = useAuthStore()
  
  return {
    user: store.user,
    loading: store.loading,
    signIn: store.signIn,
    signOut: store.signOut,
    isAuthenticated: !!store.user
  }
}
```

## Data Flow Architecture

### Authentication Flow
1. User visits app → AuthProvider checks session
2. If no session → Redirect to `/login`
3. User signs in → Supabase auth → Session created
4. AuthProvider updates global state → User redirected to dashboard

### Habit Management Flow
1. User creates habit → HabitForm submits to habitStore
2. habitStore calls Supabase API → Database updated
3. Local state updated → UI reflects changes immediately
4. Background sync ensures consistency

### Completion Flow
1. User clicks completion button → Optimistic UI update
2. API call to toggle completion → Database updated
3. If API fails → Revert optimistic update + show error
4. Analytics components reactively update based on new completion data

## Mobile & PWA Strategy

### Progressive Web App Setup
- **Manifest** (`public/manifest.json`): App metadata, icons, display modes
- **Service Worker**: Basic caching for offline functionality
- **Responsive Design**: Mobile-first Tailwind CSS approach

### Mobile Testing Approach
Since this is Next.js (not React Native), mobile testing strategy:

1. **Development**:
   - Use browser dev tools device simulation
   - Test on local network with mobile devices
   - Use `next dev --hostname 0.0.0.0` for network access

2. **Production Testing**:
   - Deploy to Vercel for easy mobile access
   - Use tools like BrowserStack for cross-device testing
   - PWA features allow "app-like" installation on mobile

3. **Mobile-Specific Features**:
   - Touch-friendly button sizes (min 44px)
   - Swipe gestures for habit completion
   - Native-like transitions and animations
   - Offline capability for viewing existing data

## Deployment Architecture

### Environment Configuration
```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://vddhdnwwyzzwexoshyoi.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZkZGhkbnd3eXp6d2V4b3NoeW9pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyNzA2ODEsImV4cCI6MjA2Mzg0NjY4MX0.Ii10jwnMZw8M9BtCAoOIPYHUOAd35iuHv4gosPAeQBs
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZkZGhkbnd3eXp6d2V4b3NoeW9pIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODI3MDY4MSwiZXhwIjoyMDYzODQ2NjgxfQ.JhV7ACpgq3S_YDwrTPyQ2SqbkCdU8aIQM2xmQba2_as
```

### Build & Deploy Pipeline
1. **Development**: `npm run dev` - Local development server
2. **Build**: `npm run build` - Next.js production build
3. **Deploy**: Vercel automatic deployment from Git
4. **Database**: Supabase hosted PostgreSQL

### Performance Optimizations
- Next.js Image optimization for habit icons/avatars
- Static generation for public pages
- Dynamic imports for analytics components
- Supabase connection pooling
- Client-side caching with React Query (if needed)

## Key Design Decisions

### Why Zustand over Redux?
- Simpler boilerplate for MVP
- Better TypeScript integration
- Smaller bundle size
- Easier to reason about for small team

### Why Supabase over Custom Backend?
- Built-in authentication
- Real-time subscriptions ready for future features
- PostgreSQL with full SQL capabilities
- Row Level Security for data protection
- Instant API generation

### Why App Router over Pages Router?
- Better performance with React Server Components
- Simplified data fetching patterns
- Built-in loading and error boundaries
- Future-proof architecture

## Development Timeline (2 Hours)

### Hour 1: Foundation (60 min)
- [ ] Initialize Next.js project with Tailwind (10 min)
- [ ] Set up Supabase project and database schema (15 min)
- [ ] Create authentication system (15 min)
- [ ] Build basic habit CRUD operations (20 min)

### Hour 2: Core Features (60 min)
- [ ] Implement habit completion system (15 min)
- [ ] Create dashboard with today's habits (15 min)
- [ ] Build basic analytics/heatmap view (15 min)
- [ ] Mobile responsive design polish (10 min)
- [ ] Deploy to Vercel (5 min)

This architecture prioritizes rapid development while maintaining scalability and clean code organization for future enhancements. 