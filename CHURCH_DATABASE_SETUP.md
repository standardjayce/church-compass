# Church Compass Database Setup Guide

This guide explains how to set up and use the Supabase database for Church Compass.

## Overview

The database foundation includes 5 main tables:

1. **churches** - Core church information with location, services, and ministry details
2. **church_claims** - Track when people claim ownership of church profiles
3. **sponsored_listings** - Manage paid featured listings and promotions
4. **saved_churches** - User-saved/bookmarked churches (for authenticated users)
5. **contact_messages** - Messages submitted through church contact forms

All tables include Row Level Security (RLS) policies to control access.

## Prerequisites

- A Supabase account (free at https://supabase.com)
- Node.js 18+ installed locally
- The Church Compass repo cloned

## Step 1: Create a Supabase Project

1. Go to https://supabase.com and sign in
2. Click "New Project"
3. Name it "church-compass" (or your preferred name)
4. Choose your region (closest to your users)
5. Create a strong database password
6. Wait for the project to provision (~2 minutes)

## Step 2: Get Your Connection Keys

Once your project is ready:

1. Go to **Settings** → **API**
2. Copy your:
   - **Project URL** (labeled as `VITE_SUPABASE_URL`)
   - **Anon Key** (labeled as `VITE_SUPABASE_ANON_KEY`)
   - Keep these safe and never commit them to git

## Step 3: Set Up Environment Variables

Create a `.env.local` file in the root of the church-compass project:

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

**Important:**
- The `.env.local` file is already in `.gitignore` for safety
- Never commit real keys to git
- The `VITE_` prefix is required for Vite to expose these to the client

## Step 4: Run the Migration

### Option A: Using Supabase CLI (Recommended)

```bash
npm install -g supabase
supabase link --project-ref your-project-id
supabase db push
```

### Option B: Using Supabase Web Console

1. In your Supabase project, go to **SQL Editor**
2. Click **New Query**
3. Paste the contents of `supabase/migrations/20240525_create_churches_tables.sql`
4. Click **Run**

## Step 5: Run the Seed (Optional)

To load 5 obviously fake development churches for testing:

### Option A: Using Supabase CLI

```bash
supabase db push --seed
```

### Option B: Using Supabase Web Console

1. Go to **SQL Editor** → **New Query**
2. Paste the contents of `supabase/seed.sql`
3. Click **Run**

These are marked clearly as `[DEMO DATA]` for development only. They're not real churches.

## Step 6: Verify the Database

1. Go to **Table Editor** in your Supabase console
2. You should see 5 tables:
   - `churches`
   - `church_claims`
   - `sponsored_listings`
   - `saved_churches`
   - `contact_messages`

3. Click on `churches` and verify the 5 demo churches are there (if you ran the seed)

## Step 7: Test the Connection

In your terminal, from the church-compass directory:

```bash
npm run dev
```

Check the browser console for any errors. The app should load without errors about missing Supabase.

## Database Schema Details

### churches Table

Stores all church information:

- **id** - UUID primary key
- **slug** - URL-friendly identifier (unique)
- **name**, **description** - Church display info
- **city**, **state**, **zip**, **country** - Location
- **latitude**, **longitude** - GPS coordinates (for maps)
- **phone**, **email**, **website** - Contact info
- **denomination** - Religious tradition
- **worship_style** - Contemporary, Traditional, Liturgical, etc.
- **service_times** - JSON array of service times
- **ministries** - Array of ministry names (Youth, Missions, etc.)
- **languages** - Languages spoken
- **kids_ministry**, **youth_ministry**, **college_ministry**, **small_groups** - Boolean flags
- **online_service**, **online_service_url** - Live stream info
- **accessibility** - Array of accessibility features
- **profile_image_url**, **gallery_urls** - Images
- **verified**, **claimed**, **featured**, **active** - Status flags
- **created_at**, **updated_at** - Timestamps (updated_at auto-updates)

**Indexes:** city, state, zip, denomination, featured, verified, active, slug

**Full-Text Search:** Uses `search_vector` column for name, city, denomination, description, etc.

### church_claims Table

When someone claims a church profile:

- **id** - UUID primary key
- **church_id** - Links to churches table
- **claimant_name**, **claimant_email**, **claimant_phone** - Who's claiming it
- **claimant_role** - Position at church (Pastor, Admin, etc.)
- **church_website**, **message** - Verification info
- **status** - `pending`, `approved`, or `rejected`
- **reviewed_by**, **reviewed_at** - Admin review info
- **created_at** - Submission timestamp

### sponsored_listings Table

For premium/paid listings:

- **id** - UUID primary key
- **church_id** - Which church is sponsored
- **plan_name** - "Featured", "Premium", etc.
- **placement_area** - Where shown (homepage, directory, etc.)
- **start_date**, **end_date** - Campaign dates
- **active** - Currently active
- **stripe_customer_id**, **stripe_subscription_id** - Billing info
- **created_at**, **updated_at** - Timestamps

### saved_churches Table

User bookmarks (requires authentication):

- **id** - UUID primary key
- **user_id** - The user (from auth.users)
- **church_id** - The church
- **created_at** - When saved
- **Constraint:** One record per user+church combination

### contact_messages Table

Form submissions:

- **id** - UUID primary key
- **church_id** - Which church (can be null for general inquiries)
- **sender_name**, **sender_email**, **sender_phone** - Who's contacting
- **message** - The message content
- **created_at** - When sent

## Row Level Security (RLS) Policies

All tables have RLS enabled. Here's what's allowed:

### churches
- **Public Read:** Anyone can see active churches
- **Public Insert/Update/Delete:** Not allowed

### church_claims
- **Public Insert:** Anyone can submit a claim
- **Public Read:** Not allowed (claims are private)
- **Admin policies:** To be implemented in next phase

### sponsored_listings
- **Public Read:** Anyone can see active listings
- **Public Insert/Update/Delete:** Not allowed

### saved_churches
- **Authenticated Read:** Users can see their own saved churches
- **Authenticated Insert:** Users can save churches for themselves
- **Authenticated Delete:** Users can unsave churches
- **Public:** Not allowed

### contact_messages
- **Public Insert:** Anyone can send a message
- **Public Read:** Not allowed (messages are private)

## Adding Real Churches

### Method 1: Direct SQL Insert

```sql
INSERT INTO public.churches (
  name, slug, description, address, city, state, zip,
  denomination, worship_style, phone, email, website,
  active
) VALUES (
  'Your Church Name',
  'your-church-slug',
  'Description here',
  '123 Church Street',
  'Your City',
  'YS',
  '12345',
  'Baptist',
  'Contemporary',
  '(555) 123-4567',
  'info@yourchurch.com',
  'https://yourchurch.com',
  TRUE
);
```

### Method 2: CSV Import

1. Fill in the `churches_import_template.csv` file with your real churches
2. Go to **Table Editor** in Supabase
3. Select the `churches` table
4. Click **Insert** → **Import Data**
5. Upload your CSV file

The CSV has all fields available. Leave empty fields blank.

### Method 3: Using the App (Future)

Once the UI is connected, admins can add churches through the web interface.

## Using the Database in the App

### Querying Churches

```typescript
import { getChurches, searchChurches, getChurchBySlug } from '@/lib/churchQueries'

// Get all churches
const { churches, error } = await getChurches()

// Get churches by denomination
const { churches } = await getChurches({ denomination: 'Baptist' })

// Search churches
const { churches } = await searchChurches('coffee worship')

// Get single church by slug
const { church } = await getChurchBySlug('grace-community-chicago')

// Get featured churches
const { churches } = await getFeaturedChurches()
```

### Submitting a Church Claim

```typescript
import { submitChurchClaim } from '@/lib/churchQueries'

const { claim, error } = await submitChurchClaim({
  church_id: 'abc-123',
  claimant_name: 'John Doe',
  claimant_email: 'john@example.com',
  claimant_role: 'Pastor',
  message: 'I am the pastor of this church'
})
```

### Saving a Church (Authenticated Users)

```typescript
import { saveChurch, unsaveChurch, getSavedChurches } from '@/lib/churchQueries'

// Save
const { saved } = await saveChurch(userId, churchId)

// Get saved churches
const { churches } = await getSavedChurches(userId)

// Unsave
await unsaveChurch(userId, churchId)
```

### Submitting Contact Messages

```typescript
import { submitContactMessage } from '@/lib/churchQueries'

const { message, error } = await submitContactMessage({
  church_id: 'abc-123',
  sender_name: 'Jane Smith',
  sender_email: 'jane@example.com',
  message: 'I have a question about your service times'
})
```

## Indexes and Performance

The database includes strategic indexes for common queries:

- **Location-based:** city, state, zip
- **Filtering:** denomination, featured, verified, active
- **Search:** Full-text search via `search_vector`
- **Foreign keys:** All relationship columns (church_id, user_id)

These help queries stay fast even with thousands of churches.

## Automatic Timestamps

- **created_at:** Set automatically when a record is created
- **updated_at:** Set automatically when a record is created, and updated automatically on every change

Example:
```typescript
// When you insert a church, Supabase sets created_at and updated_at for you
const { data } = await supabase
  .from('churches')
  .insert({ name: 'New Church' })
  .select()

// data.created_at and data.updated_at are automatically set
```

## Next Steps

1. ✅ Database created and migrated
2. ✅ Tables and RLS policies set up
3. ✅ Helper functions ready to use
4. ⏭️ **Next:** Connect the UI to the database (separate task)
5. ⏭️ **Then:** Add authentication for user accounts
6. ⏭️ **Later:** Add admin dashboard for managing churches

## Troubleshooting

### "VITE_SUPABASE_URL is missing"

**Error:** `Missing Supabase environment variables`

**Fix:** Make sure `.env.local` exists in the root of the project and contains your keys.

### "No tables found in Supabase"

**Fix:** Make sure you ran the migration SQL. Go to SQL Editor and check if tables exist.

### "RLS policy denies access"

This is expected if you're trying to:
- Insert churches (only for admin, to be implemented)
- Read non-active churches (public can only see active)
- Read other users' saved churches (you can only see your own)

### "Cannot read property 'getuserdata' of undefined"

Make sure you're using `supabase` imported from `@/lib/supabaseClient`, not creating your own instance.

## Need Help?

- Supabase Docs: https://supabase.com/docs
- Church Compass Issues: https://github.com/standardjayce/church-compass/issues
- Database Questions: Check CHURCH_DATABASE_SETUP.md first

## Important Notes

- The 5 seed churches are marked `[DEMO DATA]` and are for development only
- Don't add real churches as "demo" data
- Always use HTTPS for production
- Keep your Supabase keys secure - `.env.local` is in `.gitignore`
- The anon key is safe to use client-side (it respects RLS policies)
