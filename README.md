# AURA — Modern Minimalist Clothing

A minimalist e-commerce frontend for a clothing brand. Built with React, TypeScript, and Vite. All data is stored in the browser (localStorage); no backend or API keys required.

## Features

- **Shop** — Browse by category, gender, style, fabric, price; search; sort
- **Product detail** — Sizes, colors, gallery, add to cart, save for later
- **Cart & checkout** — Shipping form, payment methods, order confirmation with redirect to order-placed
- **User account** — Sign up / log in, dashboard with real-time **Collection Value** chart and **Recent Orders** from placed orders
- **Philosophy** — Brand manifesto and design story
- **Journal (Blog)** — Published posts with categories; full post pages
- **Support** — Help center entry
- **Admin** — Login at `/admin/login` (see [Constants](#admin-login)) to manage:
  - **Overview** — Analytics, best sellers, inventory value
  - **Collection** — Products by category, add/edit/archive, category filter
  - **Orders** — List, search, update status; real-time updates when orders are placed
  - **Stock levels** — Adjust product stock
  - **Blog** — Create, edit, publish/unpublish posts (title, category, author, cover image, excerpt, body)
  - **Customers** — Registered users

## Tech stack

- **React 19** + **TypeScript**
- **Vite** — dev server and build
- **React Router** (HashRouter) — routes
- **Tailwind CSS** (CDN) — styling
- **Recharts** — admin analytics and user dashboard chart
- **Lucide React** — icons

## Run locally

**Prerequisites:** Node.js (e.g. 18+)

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the dev server:
   ```bash
   npm run dev
   ```
3. Open the URL shown (e.g. `http://localhost:5173`). No `.env` or API keys needed.

## Scripts

| Command        | Description              |
|----------------|--------------------------|
| `npm run dev`  | Start Vite dev server    |
| `npm run build`| Production build        |
| `npm run preview` | Preview production build |

## Admin login

Default admin credentials (from `constants.ts`):

- **Email:** `admin@aura.com`
- **Password:** `admin123`

Use these to log in at `#/admin/login` and access the admin dashboard.

## Project structure

```
├── App.tsx              # Routes, global state (products, orders, users, blog)
├── index.html
├── index.tsx            # React entry
├── types.ts             # Product, Order, User, BlogPost, etc.
├── constants.ts         # Initial products, mock data, admin credentials
├── components/
│   ├── Navbar.tsx       # Search, nav links, cart/wishlist/user
│   └── ProductCard.tsx
├── views/
│   ├── Home.tsx
│   ├── Shop.tsx         # Category filters, product grid
│   ├── ProductDetail.tsx
│   ├── Cart.tsx
│   ├── Checkout.tsx     # No OTP; redirects to /order-placed
│   ├── OrderPlaced.tsx
│   ├── Philosophy.tsx   # Brand manifesto
│   ├── Blog.tsx         # Journal list + post detail
│   ├── Support.tsx
│   ├── UserDashboard.tsx # Orders, collection value, profile, payments
│   ├── AdminDashboard.tsx # Analytics, collection, orders, inventory, blog, users
│   └── AdminAuth.tsx
└── README.md
```

Data is persisted in `localStorage` (e.g. `aura_products_db`, `aura_orders_db`, `aura_blog_db`, `aura-user`, `aura-cart`). Orders and blog posts stay in sync across tabs via the `storage` and `visibilitychange` events.
