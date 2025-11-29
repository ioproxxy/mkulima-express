# Mkulima Express - Supabase Setup Guide

## Prerequisites
1. A Supabase account (sign up at https://supabase.com)
2. Node.js and npm installed locally

## Step 1: Create Supabase Project

1. Go to https://supabase.com and sign in
2. Click "New Project"
3. Fill in:
   - **Name**: mkulima-express
   - **Database Password**: (create a strong password)
   - **Region**: Choose closest to your users
4. Click "Create new project" and wait for setup to complete

## Step 2: Get Your Credentials

1. In your Supabase project dashboard, click on **Settings** (gear icon)
2. Go to **API** section
3. Copy these values:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJhbG...` (long string)

4. Update your `.env` file:
```env
VITE_SUPABASE_URL=your_project_url_here
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

## Step 3: Set Up Database Schema

1. In Supabase dashboard, go to **SQL Editor** (code icon in sidebar)
2. Click **New Query**
3. Copy the entire contents of `supabase-schema.sql`
4. Paste into the SQL editor
5. Click **Run** (or press Ctrl+Enter)
6. Verify success: You should see "Success. No rows returned"

## Step 4: Configure Authentication

1. In Supabase dashboard, go to **Authentication** ? **Providers**
2. Enable **Email** provider:
   - Toggle **Enable Email provider** ON
   - Toggle **Confirm email** OFF (for development)
   - Click **Save**

3. Configure **Email Templates** (optional but recommended):
   - Go to **Authentication** ? **Email Templates**
   - Customize the "Magic Link" template if desired

## Step 5: Set Up Row Level Security (RLS)

The schema file already includes RLS policies, but verify:

1. Go to **Authentication** ? **Policies**
2. You should see policies for:
   - users table (3 policies)
   - produce table (4 policies)
   - contracts table (3 policies)
   - transactions table (2 policies)
   - messages table (2 policies)

If any are missing, re-run the schema SQL.

## Step 6: Create Admin User

### Option A: Via Supabase Dashboard
1. Go to **Authentication** ? **Users**
2. Click **Add user** ? **Create new user**
3. Enter:
   - **Email**: admin@mkulima.express
   - **Password**: (create a secure password)
   - **Auto Confirm User**: ON
4. Click **Create user**
5. Copy the User UID
6. Go to **Table Editor** ? **users** table
7. Find the admin user row and update:
   - **id**: paste the User UID
   - **role**: ADMIN

### Option B: Via SQL (already done in schema)
The schema includes an admin user insert, but you'll need to:
1. Go to **Authentication** ? **Users** ? **Add user**
2. Create user with email: admin@mkulima.express
3. The profile will auto-link via the schema

## Step 7: Install Dependencies

```bash
npm install @supabase/supabase-js
npm install react react-dom react-router-dom react-toastify
```

## Step 8: Start Development Server

```bash
npm run dev
```

## Step 9: Test the Application

1. **Test Login Flow**:
   - Go to http://localhost:5173
   - Click "Login or Sign Up"
   - Select role (Farmer or Vendor)
   - Enter email (any email)
   - Check your email for OTP code
   - Enter code on verification screen
   - Should redirect to onboarding or dashboard

2. **Test Admin Login**:
   - Go to admin login page
   - Use: admin@mkulima.express
   - Check email for OTP
   - Verify and access admin dashboard

## Troubleshooting

### "Error: Invalid API key"
- Check `.env` file has correct credentials
- Restart dev server after changing `.env`
- Ensure variables start with `VITE_`

### "Row level security policy violation"
- Verify RLS policies are created (run schema SQL again)
- Check user authentication status
- Verify user role matches policy requirements

### "Email not sending"
- Check **Authentication** ? **Email Templates** are configured
- Verify SMTP settings (Supabase provides defaults)
- Check spam folder
- For development, disable email confirmation

### "User profile not found after OTP verification"
- User needs to complete onboarding after first login
- Profile is created when user submits registration form
- Check `users` table in Supabase dashboard

## Database Backup

To backup your data:
1. Go to **Database** ? **Backups** in Supabase
2. Click **Create backup**
3. Download for local storage

## Production Deployment

Before deploying:
1. Enable email confirmation in Auth settings
2. Set up custom SMTP for reliable email delivery
3. Configure domain for email templates
4. Add production URL to auth redirect URLs
5. Enable API rate limiting
6. Review and tighten RLS policies if needed

## Environment Variables for Production

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_production_anon_key
```

## Security Notes

- ? Never commit `.env` file (already in `.gitignore`)
- ? Only use `anon` key on client side
- ? Use RLS policies to secure data
- ? Validate data on both client and server
- ? Use HTTPS in production
- ? Enable email confirmation for production

## Support

For issues or questions:
- Supabase docs: https://supabase.com/docs
- Supabase Discord: https://discord.supabase.com
- Project repository: https://github.com/ioproxxy/mkulima-express

## Next Steps

1. Populate sample data for testing
2. Test all user flows (farmer, vendor, admin)
3. Customize email templates
4. Add custom domain for auth
5. Deploy to production (Vercel, Netlify, etc.)
