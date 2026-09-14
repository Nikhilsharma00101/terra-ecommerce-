# Terra Grooming 🌿
### *Essential Daily Skincare & Grooming for Modern Men*

[![Next.js](https://img.shields.io/badge/Next.js-16.3.3-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.8-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
[![Cloudinary](https://img.shields.io/badge/Cloudinary-Media-3448C5?style=for-the-badge&logo=cloudinary)](https://cloudinary.com/)

---

## 📖 Overview

**Terra** is a premium, full-stack direct-to-consumer (D2C) e-commerce platform built for modern men's skincare and grooming essentials. Designed with a luxury botanical aesthetic, smooth micro-interactions, and robust server-side performance, Terra delivers an exceptional shopping and brand storytelling experience.

The platform provides a comprehensive end-to-end shopping journey including dynamic product catalogs, rich product detail pages, instant cart drawer and checkout, custom user profiles, and a complete admin management suite.

---

## ✨ Key Features

### 🛍️ Storefront & Customer Experience
- **Cinematic Visuals & Motion**: Smooth micro-animations powered by Framer Motion, earthy color palettes, and glassmorphism styling.
- **Product Catalog & Quick Filters**: Filter products by routine steps, category, or ingredients with dynamic search.
- **Detailed Product Pages**: In-depth breakdowns of routine steps, clinical benefits, full ingredient transparency, reviews, and high-res imagery.
- **Interactive Cart & Seamless Checkout**: Persistent cart state, bundle upsells, and instant order placement workflow.
- **Editorial Journal**: Dedicated brand editorial and grooming guides (`/journal`).

### 🔐 Authentication & Accounts
- **Secure Authentication**: Built with JSON Web Tokens (`jose`), bcrypt password hashing, and secure HTTP-Only cookies.
- **Customer Portal**: Order history tracking, address management, and profile settings (`/account`).
- **Route Protection**: Automated route security guarding sensitive client and admin paths.

### ⚙️ Admin Control Panel (`/admin`)
- **Real-Time Analytics**: Visual KPI metrics for revenue, order volume, customer growth, and top-performing products.
- **Product Inventory Management**: Create, update, or remove products with live pricing, stock, and rich details.
- **Image Media Asset Manager**: Direct media integration with Cloudinary for fast, optimized image uploads.
- **Order Processing**: Track order statuses (Pending, Processing, Delivered, Cancelled) and view customer fulfillment data.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router, Turbopack, Server Actions & Route Handlers) |
| **Frontend Library** | [React 19](https://react.dev/) |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) + PostCSS |
| **Database & ODM** | [MongoDB Atlas](https://www.mongodb.com/) with [Mongoose 9](https://mongoosejs.com/) |
| **Animations** | [Framer Motion 13](https://www.framer.com/motion/) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Media & Assets** | [Cloudinary](https://cloudinary.com/) (`next-cloudinary`) |
| **Auth & Security** | `jose` (JWT) + `bcryptjs` + HTTP-Only Cookies |

---

## 📁 Project Structure

```text
terra-new/
├── public/                  # Static assets, branding graphics, and images
├── scripts/                 # Maintenance, seed scripts, and database helpers
│   ├── seed-database.mjs    # Seeds default catalog and demo data
│   └── test-db.mjs          # MongoDB connectivity diagnostic script
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── (auth)/login/    # Customer and admin authentication
│   │   ├── about/           # Brand mission & story
│   │   ├── account/         # User dashboard & order history
│   │   ├── admin/           # Admin management dashboard
│   │   ├── api/             # Secure REST API Route Handlers
│   │   │   ├── admin/       # Admin statistics & management APIs
│   │   │   ├── auth/        # Login, registration, session endpoints
│   │   │   ├── orders/      # Order creation & retrieval
│   │   │   ├── products/    # Product CRUD & seeding
│   │   │   └── upload/      # Cloudinary upload handler
│   │   ├── cart/            # Shopping cart page
│   │   ├── checkout/        # Checkout & order confirmation
│   │   ├── journal/         # Skincare guides & editorial articles
│   │   ├── shop/            # Catalog and dynamic product pages ([slug])
│   │   ├── globals.css      # Design tokens, color system & CSS variables
│   │   ├── layout.tsx       # Root layout with providers & global header/footer
│   │   └── page.tsx         # High-converting landing page
│   ├── components/          # Modular UI component library
│   │   ├── admin/           # Dashboard tables, forms & KPI cards
│   │   ├── home/            # Hero, routine showcases & testimonials
│   │   ├── layout/          # Navbar, mobile menu, footer, announcements
│   │   ├── products/        # ProductCard, filters, image gallery, reviews
│   │   └── ui/              # Reusable buttons, modals, badges, inputs
│   ├── context/             # React Context providers (Cart, Auth, UI state)
│   ├── data/                # Static fallback catalog & sample data
│   ├── lib/                 # Utilities, database connection, JWT helpers
│   ├── models/              # Mongoose data schemas (Product, Order, User)
│   └── types/               # TypeScript interfaces & domain types
├── .env.example             # Template for required environment variables
├── next.config.ts           # Next.js configuration & image domains
├── package.json             # Dependencies and scripts
└── tsconfig.json            # TypeScript configuration
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed on your machine:
- **Node.js**: v18.18.0 or higher (v20+ recommended)
- **npm** or **pnpm** or **yarn**
- A **MongoDB** database (Local instance or free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster)
- *(Optional)* A free [Cloudinary](https://cloudinary.com/) account for image uploads

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/terra-grooming.git
cd terra-grooming
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory by copying the example template:

```bash
cp .env.example .env.local
```

Fill in your configuration details in `.env.local`:

```env
# Cloudinary Media Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# MongoDB Connection
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/terra?retryWrites=true&w=majority

# Authentication Secret (Minimum 32 characters)
JWT_SECRET=your_super_secret_jwt_encryption_key_here
```

### 4. Seed the Database

Populate your MongoDB database with the default products, categories, and initial admin credentials:

```bash
node scripts/seed-database.mjs
```

### 5. Run Development Server

Start the local Next.js development server with Turbopack:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to explore the store.

---

## 📜 Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the development server with Turbopack |
| `npm run build` | Builds an optimized production bundle with type checking |
| `npm run start` | Runs the compiled production server |
| `npm run lint` | Runs ESLint to identify code quality and style issues |
| `node scripts/seed-database.mjs` | Populates database with sample products & admin user |
| `node scripts/test-db.mjs` | Tests connection to MongoDB instance |

---

## 📡 Key API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/products` | Retrieve list of products with filtering & sorting |
| `GET` | `/api/products/[id]` | Fetch single product details |
| `POST` | `/api/products` | *(Admin)* Create a new product |
| `POST` | `/api/auth/register` | Register new customer account |
| `POST` | `/api/auth/login` | Authenticate customer or administrator |
| `GET` | `/api/auth/me` | Fetch authenticated session profile |
| `POST` | `/api/auth/logout` | Clear session cookie |
| `POST` | `/api/orders` | Create a new customer order |
| `GET` | `/api/admin/stats` | *(Admin)* Fetch store metrics & analytics |
| `POST` | `/api/upload` | *(Admin)* Upload product images to Cloudinary |

---

## 🚢 Deployment Guide

### Deploy to Vercel (Recommended)

1. Push your repository to GitHub.
2. Import the repository into your [Vercel Dashboard](https://vercel.com).
3. Under **Project Settings > Environment Variables**, add the variables defined in `.env.example`:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`
4. Click **Deploy**. Vercel will automatically build and deploy your application.

---

## 🛡️ License

This project is licensed under the [MIT License](LICENSE).

---

<p align="center">Crafted with precision for <strong>Terra Grooming</strong>.</p>
