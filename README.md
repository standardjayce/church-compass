# Church Compass 🙏

A modern web app that helps people find spiritual communities that match their values and worship preferences.

## Features

### For Users
- **Directory**: Browse 100+ churches filtered by denomination, location, worship style
- **Church Profiles**: Detailed pages with contact info, ministry offerings, what to expect on first visit
- **Match Quiz**: 5-question personality quiz to discover compatible churches
- **Contact Form**: Reach out directly to churches from their profile
- **Church Claims**: Claim and manage your church's profile

### For Churches
- **Claim Your Profile**: Churches can claim ownership and manage their listing
- **Admin Dashboard**: Full control over church information, photos, ministry details
- **Contact Management**: View messages from interested visitors
- **Claims Review**: Approve/reject church ownership claims
- **Analytics**: Real-time statistics on churches, claims, messages

## Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS
- **Framework**: TanStack Start (fullstack React with SSR)
- **Database**: Supabase (PostgreSQL)
- **Routing**: TanStack Router (file-based)
- **Build**: Vite
- **Icons**: Lucide React

## Quick Start

### 1. Prerequisites
- Node.js 20+
- Supabase account (free tier works)
- Git

### 2. Setup

```bash
# Clone and install
git clone <repo-url>
cd church-compass
npm install

# Create env file
cp .env.example .env.local
```

### 3. Add Supabase Credentials

Edit `.env.local` with your Supabase project details:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_ADMIN_PASSWORD=your-secure-password
```

### 4. Setup Database

In Supabase SQL Editor, run migrations from `supabase/migrations/`:
- `20240525_create_churches_tables.sql`
- `20240525_add_display_fields.sql` (optional)

The app auto-seeds 8 demo churches on first run!

### 5. Start Development

```bash
npm run dev
# Visit http://localhost:8080
```

## Routes

### Public
- `/` - Home page
- `/directory` - Browse/filter churches
- `/church/:slug` - Church profile
- `/quiz` - Match quiz
- `/claim` - Claim a church
- `/about` - About page

### Admin
- `/admin` - Dashboard (password: `admin123`)
  - Churches tab (CRUD)
  - Claims tab (approve/reject)
  - Messages tab (contact forms)
  - Stats tab (analytics)

## Admin Dashboard

**Access**: http://localhost:8080/admin  
**Password**: `admin123` (change in `.env.local`)

Features:
- ✅ Manage all churches
- ✅ Review & approve church claims
- ✅ View visitor messages
- ✅ Real-time statistics
- ✅ Mark churches as verified/featured

## Customization

### Change Admin Password
Edit `.env.local`: `VITE_ADMIN_PASSWORD=your-password`

### Change Colors
Edit `tailwind.config.js`:
- `emerald-deep` - Primary color
- `gold` - Accent color
- `cream` - Background

### Add Churches
1. Admin Dashboard → Churches tab
2. Click "Add Church" and fill form

Or via SQL:
```sql
INSERT INTO churches (name, slug, denomination, worship_style, ...) VALUES (...);
```

## Deployment

### Cloudflare Workers
```bash
npm run build
wrangler deploy
```

### Vercel
```bash
vercel
```

## Database Schema

- **churches** - Church listings (name, contact, denomination, worship style, etc.)
- **church_claims** - Ownership claims by church leaders
- **contact_messages** - Visitor messages to churches
- **saved_churches** - Favorite churches (for future user auth)
- **sponsored_listings** - Premium featured listings

## Troubleshooting

**Admin shows "Loading..."?**
- Refresh page, clear cache, check console for errors

**Churches not appearing?**
- Load home page first (triggers auto-seed)
- Verify `.env.local` has correct credentials
- Check Supabase: `SELECT COUNT(*) FROM churches;`

**Contact form fails?**
- Ensure email is filled
- Check browser console
- Verify RLS policies in Supabase

## Future Features

- User accounts & authentication
- Save favorites
- Email notifications
- Photo uploads
- Payment processing
- Mobile app
- Map view
- Event calendar
- Live streaming integration

## Built With

- TanStack Start
- React 19
- TypeScript
- Tailwind CSS
- Supabase
- Vite

## License

MIT

---

**Building bridges to spiritual communities. 🙏**
