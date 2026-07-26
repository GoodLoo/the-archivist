# The Archivist — Design Identity

## Brand Overview

The Archivist is a premium online collectible figurine store. The brand positions itself as a **curator of artifacts** — a digital vault where every figurine is a museum-worthy piece. The tone is authoritative, cinematic, and exclusive.

---

## Typography

| Role | Font | Weight | Size Scale |
|---|---|---|---|
| **Headings** | Space Grotesk | 700 (Bold), 800 (Extra Bold) | 4xl (36px) — 7xl (72px) |
| **Body** | Inter | 400 (Regular), 500 (Medium) | sm (14px) — base (16px) |
| **Labels/Data** | JetBrains Mono (design spec only) | 500 | 10px — 12px |

- Headings use tight tracking (`-0.02em` to `-0.04em`)
- Body text uses `1.6` line-height for readability on dark backgrounds
- All uppercase labels use `0.05em` to `0.2em` letter-spacing

---

## Color Palette

### Core
| Token | Hex | Usage |
|---|---|---|
| **Crimson** | `#DC143C` | Primary CTAs, accents, active states, price |
| **Crimson Light** | `#FF1F4A` | Hover states |
| **Crimson Dark** | `#B00E2F` | Pressed states |

### Dark Mode
| Token | Hex | Usage |
|---|---|---|
| `--bg` | `#141313` | Page background |
| `--surface` | `#1C1B1B` | Card/panel backgrounds |
| `--border` | `#333333` | All borders, dividers |
| `--text` | `#E5E2E1` | Primary text |
| `--text-secondary` | `#A0A0A0` | Secondary/muted text |
| `--text-inverse` | `#313030` | Text on light surfaces |

### Light Mode
| Token | Hex | Usage |
|---|---|---|
| `--bg` | `#FAFAFA` | Page background |
| `--surface` | `#FFFFFF` | Card/panel backgrounds |
| `--border` | `#E0E0E0` | All borders, dividers |
| `--text` | `#1A1A1A` | Primary text |
| `--text-secondary` | `#666666` | Secondary/muted text |
| `--text-inverse` | `#FFFFFF` | Text on dark surfaces |

### Semantic
| Token | Hex | Usage |
|---|---|---|
| Success | `#22C55E` | In stock, confirmed |
| Warning | `#F59E0B` | Pending, awaiting |
| Error | `#DC143C` | Sold out, errors |

---

## Layout

- **Max content width:** 1600px (`max-w-screen-2xl`)
- **Grid:** Mobile-first responsive
  - Mobile: 2-column product grid, 20px gutters
  - Tablet: 3-column product grid
  - Desktop: 4-column product grid, 64px gutters
- **Panels:** All sections divided by 1px `#333333` borders (no rounded corners)
- **Spacing unit:** 4px

### Breakpoints

| Breakpoint | Width | Columns |
|---|---|---|
| Mobile | < 640px | Full width, 20px margin |
| Tablet | 640px+ | 6-column implicit grid |
| Desktop | 1024px+ | 12-column implicit grid, 64px margin |

---

## Components

### Header
- Sticky top (`position: sticky; top: 0`)
- Height: 64px (h-16)
- Background: `rgba(20,19,19,0.95)` with backdrop blur
- Bottom border: 1px `#333333`
- Contains: Logo, Search bar, Categories dropdown, Shop All, Track Order, Blog, Theme toggle, Wishlist heart icon, Cart icon with badge

### Hero Section
- Split layout: 50% text / 50% image on desktop
- Full text stack on mobile
- Headline: "Enter The Vault" with crimson accent on "Vault"
- Two CTAs: "Shop All" (primary/crimson) and "Explore Collection" (outline)

### Product Card
- Frameless image on `#1C1B1B` surface
- 1px `#333333` border, transitions to `#DC143C` on hover
- Image scales 1.05x on hover with 500ms transition
- Info below: Category label (10px uppercase), Name (14px bold), Price (14px crimson)
- Wishlist heart button (top-right corner)
- Sale badge (top-left, only if discounted)
- "Sold Out" overlay (if out of stock)
- Green/red stock indicator dot
- "Add to Cart" button at bottom

### Buttons
- **Primary:** Solid crimson (`#DC143C`) background, white text, 1px crimson border
- **Primary hover:** Transparent background, crimson text
- **Outline:** Transparent, 1px text-color border
- **Shape:** Rectangular (0px border-radius)
- **Font:** Space Grotesk Bold, 14px, uppercase, 0.05em tracking
- **Padding:** 12px 24px (`.75rem 1.5rem`)

### Inputs
- Bottom-border only: 1px `#333333`
- Focus state: Bottom border changes to `#DC143C`
- Background: Transparent
- Font: Inter, 16px
- Placeholder: `#A0A0A0`

### Category Dropdown
- Desktop: Hover/focus triggered dropdown with numbered categories (01-08)
- Each item shows category ID in a bordered box + name + item count
- Mobile: Accordion-style expandable list

### Cart Icon
- Shows item count as crimson badge
- Links to `/cart`

### Wishlist Icon
- Heart icon shows saved count as crimson badge
- Links to `/wishlist`

---

## Theme Toggle

- Sun/moon icons
- Persisted in `localStorage` as "theme" key
- Default: dark mode
- Toggle applies `.dark` class to `<html>`

---

## Rules & Conventions

1. **No rounded corners** anywhere — all angles are 90 degrees
2. **No box shadows** — use 1px borders for depth
3. **No animations** on scroll — transitions only on hover (border, scale, color)
4. All hover transitions use `transition-colors` or `transition-transform duration-200/500`
5. Products are always displayed on `#1C1B1B` surface regardless of theme
6. "SOLD OUT" items show crimson border badge + disabled add-to-cart
7. Sale items show crimson "SALE" badge + strikethrough original price
8. Free shipping threshold: $500

---

## Admin Dashboard

The admin panel at `/admin` uses a separate full-width layout with:
- Collapsible sidebar (burgundy/crimson accents)
- Mock authentication (username: `admin`, password: `admin123`)
- Sections: Dashboard, Orders, Products, Categories, Blog, Customers, Analytics, Settings
- Fully responsive: sidebar collapses to hamburger on mobile
- Uses the same typography (Space Grotesk + Inter) and sharp-corner design language
