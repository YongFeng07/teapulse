# ☕ Tea Pulse — Unified Production App

Premium bubble tea brand — full-stack Next.js 15 SaaS application combining the landing page and ordering system.

## Architecture

```
TeaPulse/
├── app/
│   ├── page.tsx              # Landing page (all sections)
│   ├── menu/                 # Product listing + detail
│   ├── cart/                 # Cart management
│   ├── checkout/             # WhatsApp + mock payment
│   ├── dashboard/            # User account
│   │   ├── orders/           # Order history
│   │   └── profile/          # Profile settings
│   ├── rewards/              # Loyalty program
│   ├── stores/               # Store locator
│   ├── admin/                # Admin panel
│   │   ├── orders/           # Order management
│   │   └── products/         # Product management
│   ├── login/ register/      # Auth pages
│   └── api/                  # All API routes
├── components/
│   ├── landing/              # All landing page sections
│   ├── layout/               # UnifiedNavbar
│   ├── loyalty/              # PointsCard, TierBadge
│   ├── menu/                 # CustomizationForm
│   └── ui/                   # Design system components
├── prisma/                   # Database schema + seed
├── hooks/                    # useCart, useToast
├── lib/                      # auth, prisma, utils
└── types/                    # TypeScript definitions
```

## Getting Started

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your values:
   # DATABASE_URL="file:./dev.db"
   # NEXTAUTH_SECRET="your-secret-here"
   # NEXTAUTH_URL="http://localhost:3000"
   ```

3. **Set up database**
   ```bash
   npm run db:push
   npm run db:seed
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

## Features

| Feature | Status |
|---------|--------|
| Landing page (Hero, Drinks, Story, etc.) | ✅ |
| Premium dark glassmorphism UI | ✅ |
| Product listing with search/filter | ✅ |
| Drink detail + customization (sugar, ice, toppings) | ✅ |
| Cart system (Zustand + localStorage) | ✅ |
| Checkout (WhatsApp + Pay in Store) | ✅ |
| User auth (NextAuth credentials) | ✅ |
| Loyalty points & tier system | ✅ |
| User dashboard | ✅ |
| Order history & tracking | ✅ |
| Admin dashboard | ✅ |
| Admin order management | ✅ |
| Admin product management | ✅ |
| Framer Motion animations | ✅ |
| Mobile-first responsive | ✅ |

## Design System

- **Primary**: #D4B483 (Gold)
- **Background**: #0E0E0E (Near Black)
- **Text**: #F5EFE6 (Warm Cream)
- **Font Display**: Playfair Display
- **Font Body**: Inter
- **Glass**: `rgba(255,255,255,0.04)` with `backdrop-filter: blur(20px)`
