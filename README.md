# Resale Inventory App

Track your resale inventory across eBay, Etsy, and local shops.

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Add your Supabase credentials
Copy `.env.example` to `.env.local` and fill in your values:
```bash
cp .env.example .env.local
```

Then edit `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

Get these from:
**Supabase Dashboard → Project Settings → API**

### 3. Run the app
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Features
- Dashboard with stats and financial summary
- Add / edit / delete inventory items
- Search by title, keywords, description
- Filter by status
- Photo upload (multiple photos per item)
- Track room and bin location
- Measurements and shipping info
- Authenticity tracking
- Multi-platform selling (eBay, Etsy, Local)

## Deploy
```bash
npm run build
npm start
```

Or deploy to [Vercel](https://vercel.com) for free hosting — connect your GitHub repo and add the environment variables in the Vercel dashboard.
