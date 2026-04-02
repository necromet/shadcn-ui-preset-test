# CRM Dashboard - Asset Implementation Guide

> Reference document for enhancing frontend and dashboard design with visual assets.

## Table of Contents

- [Directory Structure](#directory-structure)
- [Priority 1: PWA & Meta Assets](#priority-1-pwa--meta-assets)
- [Priority 2: Avatar System](#priority-2-avatar-system)
- [Priority 3: Empty State Illustrations](#priority-3-empty-state-illustrations)
- [Priority 4: Custom Icons](#priority-4-custom-icons)
- [Priority 5: Branding Assets](#priority-5-branding-assets)
- [Component Integration](#component-integration)
- [Free Asset Resources](#free-asset-resources)

---

## Directory Structure

```
crm-dashboard/public/
├── icons/
│   ├── navigation/
│   │   ├── home.svg
│   │   ├── users.svg
│   │   ├── calendar.svg
│   │   ├── chart.svg
│   │   ├── settings.svg
│   │   └── logout.svg
│   ├── actions/
│   │   ├── add.svg
│   │   ├── edit.svg
│   │   ├── delete.svg
│   │   ├── search.svg
│   │   ├── filter.svg
│   │   └── download.svg
│   └── status/
│       ├── check-circle.svg
│       ├── alert-circle.svg
│       ├── info.svg
│       └── warning.svg
├── illustrations/
│   └── empty-states/
│       ├── no-members.svg
│       ├── no-groups.svg
│       ├── no-attendance.svg
│       ├── no-analytics.svg
│       └── no-data.svg
├── images/
│   ├── avatars/
│   │   └── placeholders/
│   │       ├── male.svg
│   │       ├── female.svg
│   │       └── group.svg
│   └── logos/
│       ├── church-logo.svg
│       └── church-logo-dark.svg
├── animations/
│   ├── loading.json
│   └── success.json
├── favicon.ico
├── favicon-16x16.png
├── favicon-32x32.png
├── apple-touch-icon.png
├── android-chrome-192x192.png
├── android-chrome-512x512.png
├── site.webmanifest
└── og-image.png
```

---

## Priority 1: PWA & Meta Assets

**Why:** Essential for production. Affects SEO, social sharing, and installability.

### Required Files

| File | Size | Purpose |
|------|------|---------|
| `favicon.ico` | 32x32 | Traditional browser tab icon |
| `favicon-16x16.png` | 16x16 | Browser tab icon |
| `favicon-32x32.png` | 32x32 | Browser tab icon (Retina) |
| `apple-touch-icon.png` | 180x180 | iOS home screen icon |
| `android-chrome-192x192.png` | 192x192 | Android home screen icon |
| `android-chrome-512x512.png` | 512x512 | Android splash screen |
| `og-image.png` | 1200x630 | Social media sharing image |

### Implementation

#### 1. Generate icons from SVG logo

Use [Real Favicon Generator](https://realfavicongenerator.net/) to generate all variants from a single SVG.

#### 2. Create `site.webmanifest`

```json
{
  "name": "Church CRM Dashboard",
  "short_name": "CRM",
  "description": "Church Member Management Dashboard",
  "icons": [
    {
      "src": "/android-chrome-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/android-chrome-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ],
  "theme_color": "#7c3aed",
  "background_color": "#ffffff",
  "display": "standalone"
}
```

#### 3. Update `index.html`

```html
<head>
  <!-- Favicon -->
  <link rel="icon" type="image/x-icon" href="/favicon.ico" />
  <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
  <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
  
  <!-- PWA -->
  <link rel="manifest" href="/site.webmanifest" />
  <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
  <meta name="theme-color" content="#7c3aed" />
  
  <!-- Open Graph -->
  <meta property="og:image" content="/og-image.png" />
  <meta property="og:title" content="Church CRM Dashboard" />
  <meta property="og:description" content="Church Member Management Dashboard" />
</head>
```

---

## Priority 2: Avatar System

**Why:** Avatars appear in Members list, CGF Groups, Header, and throughout the UI.

### Required Files

- `public/images/avatars/placeholders/male.svg`
- `public/images/avatars/placeholders/female.svg`
- `public/images/avatars/placeholders/group.svg`

### Implementation

#### Avatar Component

```tsx
// src/components/ui/avatar.jsx
import { cn } from "../../lib/utils"

function Avatar({ src, name, gender, size = "md", className }) {
  const sizeClasses = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-14 w-14 text-base",
  }

  const placeholderSrc =
    gender === "Perempuan"
      ? "/images/avatars/placeholders/female.svg"
      : "/images/avatars/placeholders/male.svg"

  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={cn("rounded-full object-cover", sizeClasses[size], className)}
      />
    )
  }

  return (
    <div
      className={cn(
        "rounded-full bg-muted flex items-center justify-center font-medium overflow-hidden",
        sizeClasses[size],
        className
      )}
    >
      <img src={placeholderSrc} alt="" className="w-full h-full opacity-30" />
      <span className="absolute">{initials}</span>
    </div>
  )
}

function GroupAvatar({ size = "md", className }) {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-14 w-14",
  }

  return (
    <div
      className={cn(
        "rounded-full bg-muted flex items-center justify-center overflow-hidden",
        sizeClasses[size],
        className
      )}
    >
      <img
        src="/images/avatars/placeholders/group.svg"
        alt="Group"
        className="w-full h-full opacity-50"
      />
    </div>
  )
}

export { Avatar, GroupAvatar }
```

#### Usage in Members Table

```tsx
// src/pages/Members.jsx
import { Avatar } from "../components/ui/avatar.jsx"

// In table rows:
<TableCell>
  <div className="flex items-center gap-3">
    <Avatar
      name={member.nama_jemaat}
      gender={member.jenis_kelamin}
      size="sm"
    />
    <div>
      <p className="font-medium">{member.nama_jemaat}</p>
      <p className="text-xs text-muted-foreground">{member.no_jemaat}</p>
    </div>
  </div>
</TableCell>
```

#### SVG Placeholder Template (male.svg)

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
  <circle cx="50" cy="50" r="48" fill="#e2e8f0"/>
  <circle cx="50" cy="38" r="16" fill="#94a3b8"/>
  <path d="M50 58c-22 0-36 14-36 28v4h72v-4c0-14-14-28-36-28z" fill="#94a3b8"/>
</svg>
```

#### SVG Placeholder Template (female.svg)

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
  <circle cx="50" cy="50" r="48" fill="#fce7f3"/>
  <circle cx="50" cy="38" r="16" fill="#ec4899"/>
  <path d="M50 58c-22 0-36 14-36 28v4h72v-4c0-14-14-28-36-28z" fill="#ec4899"/>
</svg>
```

---

## Priority 3: Empty State Illustrations

**Why:** Empty states appear when there are no members, groups, attendance records, or analytics data. Provides visual feedback and guidance.

### Required Files

- `public/illustrations/empty-states/no-members.svg`
- `public/illustrations/empty-states/no-groups.svg`
- `public/illustrations/empty-states/no-attendance.svg`
- `public/illustrations/empty-states/no-analytics.svg`
- `public/illustrations/empty-states/no-data.svg`

### Implementation

#### EmptyState Component

```tsx
// src/components/ui/empty-state.jsx
import { Button } from "./button"

function EmptyState({
  title,
  description,
  illustration = "/illustrations/empty-states/no-data.svg",
  actionLabel,
  onAction,
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <img
        src={illustration}
        alt=""
        className="w-48 h-48 mb-6 opacity-80"
        aria-hidden="true"
      />
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-muted-foreground mt-1 max-w-sm">{description}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction} className="mt-4">
          {actionLabel}
        </Button>
      )}
    </div>
  )
}

export { EmptyState }
```

#### Usage Examples

```tsx
// No members
<EmptyState
  title="No members yet"
  description="Start by adding your first church member to the system."
  illustration="/illustrations/empty-states/no-members.svg"
  actionLabel="Add Member"
  onAction={() => setOpenDialog(true)}
/>

// No CGF groups
<EmptyState
  title="No CGF groups"
  description="Create your first small group to organize members."
  illustration="/illustrations/empty-states/no-groups.svg"
  actionLabel="Create Group"
  onAction={() => navigate("/cgf/new")}
/>

// No attendance records
<EmptyState
  title="No attendance records"
  description="Attendance records will appear here once meetings are recorded."
  illustration="/illustrations/empty-states/no-attendance.svg"
/>

// No analytics data
<EmptyState
  title="Not enough data"
  description="Analytics will appear once you have more attendance data."
  illustration="/illustrations/empty-states/no-analytics.svg"
/>
```

#### Where to Use Empty States

| Page | Condition | Illustration |
|------|-----------|--------------|
| `Members.jsx` | `members.length === 0` | `no-members.svg` |
| `CGFGroups.jsx` | `cgfGroups.length === 0` | `no-groups.svg` |
| `Attendance.jsx` | `attendance.length === 0` | `no-attendance.svg` |
| `Analytics.jsx` | `getAttendanceTrend().length === 0` | `no-analytics.svg` |

---

## Priority 4: Custom Icons

**Why:** Lucide React covers most generic icons. Custom icons needed only for domain-specific actions.

### When to Use Custom Icons

Only create custom SVG icons for:
- Church-specific symbols (cross, communion, baptism)
- Domain-specific actions not in Lucide
- Branded versions of common icons

### SVG Sprite Approach (Optional, for performance)

#### 1. Create sprite file `public/icons/sprite.svg`

```svg
<svg xmlns="http://www.w3.org/2000/svg" style="display:none">
  <symbol id="icon-cross" viewBox="0 0 24 24">
    <path d="M11 2h2v7h7v2h-7v11h-2V11H4V9h7z" fill="currentColor"/>
  </symbol>
  <symbol id="icon-communion" viewBox="0 0 24 24">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10..." fill="currentColor"/>
  </symbol>
</svg>
```

#### 2. Use in components

```tsx
function Icon({ name, className }) {
  return (
    <svg className={cn("w-5 h-5", className)}>
      <use href={`/icons/sprite.svg#icon-${name}`} />
    </svg>
  )
}

// Usage
<Icon name="cross" className="text-primary" />
```

---

## Priority 5: Branding Assets

**Why:** Consistent branding across the application.

### Required Files

- `public/images/logos/church-logo.svg` - Main logo for light mode
- `public/images/logos/church-logo-dark.svg` - Inverted logo for dark mode

### Implementation

#### Logo Component

```tsx
// src/components/ui/logo.jsx
import { useTheme } from "../../components/theme-provider"

function Logo({ className = "h-8 w-auto" }) {
  const { theme } = useTheme()
  
  const logoSrc = theme === "dark"
    ? "/images/logos/church-logo-dark.svg"
    : "/images/logos/church-logo.svg"
  
  return (
    <img
      src={logoSrc}
      alt="Church Logo"
      className={className}
    />
  )
}

export { Logo }
```

#### Usage in Sidebar

```tsx
// src/components/dashboard/Sidebar.jsx
import { Logo } from "../ui/logo"

function Sidebar({ isOpen }) {
  return (
    <aside>
      <div className="flex items-center gap-2 p-4 border-b">
        <Logo className="h-8 w-8" />
        {isOpen && <span className="font-semibold text-lg">Church CRM</span>}
      </div>
      {/* ... */}
    </aside>
  )
}
```

#### Usage in Login Page

```tsx
// src/pages/Login.jsx
function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-md p-8">
        <div className="flex flex-col items-center mb-6">
          <Logo className="h-16 w-16 mb-4" />
          <h1 className="text-2xl font-bold">Church CRM</h1>
          <p className="text-muted-foreground">Sign in to continue</p>
        </div>
        {/* ... login form */}
      </Card>
    </div>
  )
}
```

---

## Component Integration

### Enhanced Sidebar with Icons

```tsx
// src/components/dashboard/Sidebar.jsx
import {
  LayoutDashboard,
  Users,
  UserCheck,
  CalendarDays,
  BarChart3,
  Settings,
  Church,
} from "lucide-react"
import { NavLink } from "react-router-dom"
import { cn } from "../../lib/utils"

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Members", href: "/members", icon: Users },
  { name: "CGF Groups", href: "/cgf", icon: UserCheck },
  { name: "Attendance", href: "/attendance", icon: CalendarDays },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Settings", href: "/settings", icon: Settings },
]

export function Sidebar({ isOpen }) {
  return (
    <aside
      className={cn(
        "flex flex-col border-r bg-sidebar transition-all duration-300",
        isOpen ? "w-64" : "w-16"
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-2 p-4 border-b">
        <Church className="h-8 w-8 text-primary shrink-0" />
        {isOpen && <span className="font-semibold text-lg">Church CRM</span>}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2 space-y-1">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            end={item.href === "/"}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50"
              )
            }
          >
            <item.icon className="h-5 w-5 shrink-0" />
            {isOpen && <span>{item.name}</span>}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
```

### Loading State with Animation

```tsx
// src/components/ui/loading.jsx
function LoadingSpinner({ className }) {
  return (
    <div className={cn("flex items-center justify-center py-12", className)}>
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-primary" />
    </div>
  )
}

// For Lottie animations (install lottie-react first)
// npm install lottie-react
function LoadingAnimation() {
  // const animationData = require('/animations/loading.json')
  // return <Lottie animationData={animationData} loop className="w-24 h-24" />
  return <LoadingSpinner />
}

export { LoadingSpinner, LoadingAnimation }
```

---

## Free Asset Resources

| Asset Type | Resource | URL |
|------------|----------|-----|
| **Icons** | Lucide | https://lucide.dev |
| **Icons** | Heroicons | https://heroicons.com |
| **Icons** | Tabler Icons | https://tabler-icons.io |
| **Illustrations** | unDraw | https://undraw.co |
| **Illustrations** | Storyset | https://storyset.com |
| **Illustrations** | Humaaans | https://humaaans.com |
| **Avatars** | DiceBear | https://dicebear.com |
| **Avatars** | UI Avatars | https://ui-avatars.com |
| **Patterns** | Hero Patterns | https://heropatterns.com |
| **Patterns** | SVG Backgrounds | https://svgbackgrounds.com |
| **Lottie Animations** | LottieFiles | https://lottiefiles.com |
| **Favicon Generator** | Real Favicon Generator | https://realfavicongenerator.net |
| **OG Image** | Canva | https://canva.com |
| **SVG Optimization** | SVGOMG | https://jakearchibald.github.io/svgomg/ |

### Recommended Illustration Style

For consistency, choose **one** illustration style and stick with it:

| Style | Source | Best For |
|-------|--------|----------|
| Flat/Minimal | unDraw | Professional dashboards |
| Animated | Storyset | Playful/engaging UIs |
| Line Art | Humaaans | Clean, modern designs |

### SVG Optimization

Before adding SVGs to the project:

1. Run through [SVGOMG](https://jakearchibald.github.io/svgomg/)
2. Remove unnecessary metadata
3. Optimize paths
4. Ensure `viewBox` is set correctly

---

## Implementation Checklist

### Phase 1: Core Assets (Do First)

- [ ] Generate favicon variants (16x16, 32x32, 180x180, 192x192, 512x512)
- [ ] Create `site.webmanifest`
- [ ] Update `index.html` with meta tags
- [ ] Create avatar placeholder SVGs (male, female, group)
- [ ] Implement `Avatar` component
- [ ] Update Members page to use `Avatar`

### Phase 2: UX Assets (Do Second)

- [ ] Create empty state illustrations (no-members, no-groups, no-attendance, no-data)
- [ ] Implement `EmptyState` component
- [ ] Add empty states to Members, CGFGroups, Attendance pages
- [ ] Create church logo SVGs (light and dark variants)
- [ ] Implement `Logo` component
- [ ] Update Sidebar and Login page with Logo

### Phase 3: Polish (Do Last)

- [ ] Create OG image for social sharing (1200x630)
- [ ] Add loading animations (Lottie or CSS spinner)
- [ ] Create any domain-specific custom icons
- [ ] Optimize all SVGs through SVGOMG
- [ ] Test dark mode with all assets
- [ ] Verify all images have proper `alt` attributes

---

## Notes

- **Current library:** `lucide-react` v1.7.0 already provides most icons
- **Theme support:** Ensure all assets work in both light and dark modes
- **Accessibility:** All images must have `alt` text or `aria-hidden="true"` for decorative images
- **Performance:** Use SVG where possible (scalable, small file size)
- **Consistency:** Match illustration style with the Outfit font and OKLCH color palette
