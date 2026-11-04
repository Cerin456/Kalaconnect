# KalaConnect — Full Working Product & Deployment Guide

This document provides complete instructions to run, verify, and deploy KalaConnect as a production application.

---

## 🌟 What Has Been Built

### 1. Frontend & Visual Identity (100% Pixel-Matched to Figma)
- **Original prototype imagery & assets**:
  - `logo.png`: Diamond "क" emblem & KalaConnect brand mark
  - `hero_collage.png`: Master artisan painting pottery collage, 28k+ stats, and AI story tag
  - `hero_avatars.png`: Social proof avatars
  - `textile_ribbon.png`: Traditional geometric textile motif border
  - `art_madhubani.png`, `art_blue_pottery.png`, `art_warli.png`, `art_handloom.png`: Asymmetric arched gallery
  - `artist_meera.png`, `artist_ramesh.png`, `artist_lalita.png`: Master artist portraits with verified badges
  - `story_collage.png`: "Made by hand, carried by heart" artisan composition
- **Design Tokens**:
  - Cream `#FAF6EF` & Warm Cream `#F0E7DC`
  - Deep Maroon `#702D35`
  - Rust `#C4522A`
  - Gold `#C9A060`
  - Soot Charcoal `#2D2523`
- **Typography**: Cormorant Garamond serif + Inter sans-serif

---

### 2. Full-Stack Backend & Features

| Capability | Route / Module | Details |
|---|---|---|
| **Artist Registration** | `/join` & `/api/auth/register` | Real account creation with password hashing (Node.js scrypt), automatic slug generation, and secure session cookies |
| **Artist Authentication** | `/login` & `/api/auth/login` | Secure login with credential verification and 1-click demo accounts for Meera Devi & Ramesh Kumar |
| **Artist Portal Dashboard** | `/dashboard` & `/api/auth/me` | Total artworks, live portfolio views, unread enquiry counter, lineage verification badge |
| **Artwork Upload & Management** | `/dashboard` & `/api/artworks` | Multipart image upload to `/public/uploads/` with instant preview, metadata, and deletion support |
| **AI Heritage Story Assistant** | `/api/ai/generate-story` | Automatically writes culturally rich, traditional narratives for artworks in seconds |
| **Direct Buyer Enquiries** | `EnquiryModal` & `/api/enquiries` | Real-time purchase and commission submissions; viewable & manageable on artist dashboard with WhatsApp/Email quick-links |
| **Exhibition QR Code Generator** | `/dashboard` | Printable QR code that links directly to the artist's live public portfolio |
| **Dynamic Artist Portfolios** | `/artists/[slug]` & `/api/artists/[slug]` | Dedicated portfolio pages with bio, lineage, art pieces, and view counter |
| **Public Artisan Directory** | `/artists` & `/api/artists` | Live search and category filters (Madhubani, Blue Pottery, Warli, Handloom, Kutch) |

---

## 🚀 Running Locally

```bash
# 1. Enter the project folder
cd "c:\Users\cerin\OneDrive\Desktop\Kalaconnect"

# 2. Start the development server
npm run dev
# or
node_modules\.bin\next dev --port 3000
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

### Demo Credentials for Instant Testing:
- **Meera Devi** (Madhubani Painter):
  - Email: `meera@kalaconnect.art`
  - Password: `kala12345`
- **Ramesh Kumar** (Blue Pottery Artisan):
  - Email: `ramesh@kalaconnect.art`
  - Password: `kala12345`

---

## 🚢 Deploying to Production

### Option A: Deploy to Vercel (Recommended — 2 Minutes)

1. Push this repository to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Complete KalaConnect production build"
   git remote add origin https://github.com/your-username/kalaconnect.git
   git push -u origin main
   ```
2. Go to [Vercel](https://vercel.com) and click **"Add New Project"**.
3. Import the `kalaconnect` repository.
4. Set the Environment Variables:
   - `SESSION_SECRET`: Any random 32-character string
   - `NEXT_PUBLIC_SUPABASE_URL` (optional, if using Supabase)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` (optional)
5. Click **Deploy**. Vercel will build and host your app with global CDN distribution!

---

### Option B: Connecting Supabase (Postgres & Storage)

1. Create a free project at [Supabase](https://supabase.com).
2. Open the **SQL Editor** in your Supabase dashboard and paste the contents of `supabase/schema.sql`. Run the query.
3. In your project `.env.local` (or Vercel environment settings), add:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```
4. KalaConnect will automatically route database operations through your Supabase Postgres cluster!
