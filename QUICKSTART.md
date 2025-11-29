# Mkulima Express - Quick Start

## ?? Quick Setup (5 minutes)

### 1. Database Setup
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Open your project: `clnzuwagvwktowdomyrz`
3. Click **SQL Editor** (left sidebar)
4. Click **New Query**
5. Copy and paste contents from `supabase-schema.sql`
6. Click **Run** ??
7. Wait for "Success. No rows returned"

### 2. Enable Email Authentication
1. Go to **Authentication** ? **Providers**
2. Find **Email** provider
3. Toggle **Enable Email provider** ON
4. Toggle **Confirm email** OFF (for development)
5. Click **Save**

### 3. Install Dependencies (if needed)
```bash
npm install
```

### 4. Start Development
```bash
npm run dev
```

### 5. Test It
Open http://localhost:5173 and:
- Click "Login or Sign Up"
- Enter any email
- Check email for OTP code
- Enter code
- Complete registration

## ? What's Already Configured

Your `.env` file already has:
```
VITE_SUPABASE_URL=https://clnzuwagvwktowdomyrz.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci...
```

Your `supabaseClient.ts` is ready to use!

## ?? Database Tables Created

After running the schema:
- ? users (with RLS policies)
- ? produce (with RLS policies)
- ? contracts (with RLS policies)  
- ? transactions (with RLS policies)
- ? messages (with RLS policies)

## ?? Security Features

- ? Row Level Security (RLS) enabled
- ? Users can only see their own data
- ? Farmers can only edit their produce
- ? Contract parties can manage contracts
- ? Admins have full access

## ?? Features Ready to Use

### Authentication
- ? Email OTP login
- ? Session management
- ? Role-based access (Farmer/Vendor/Admin)

### Data Operations
- ? Create/Read/Update users
- ? Manage produce listings
- ? Create contracts
- ? Track transactions
- ? Real-time messaging

### Real-time Updates
- ? Live chat messages
- ? Auto-sync on changes

## ?? Troubleshooting

### Issue: "OTP not received"
**Solution**: Check spam folder or:
1. Go to **Authentication** ? **Email Templates**
2. Verify template is enabled
3. Check SMTP settings

### Issue: "Permission denied"
**Solution**: RLS policy issue:
1. Re-run `supabase-schema.sql`
2. Check user role matches operation
3. Verify user is authenticated

### Issue: "Can't read .env variables"
**Solution**:
1. Restart dev server: `npm run dev`
2. Verify `.env` file exists
3. Check variables start with `VITE_`

## ?? Full Documentation

- Detailed setup: See `SETUP_GUIDE.md`
- Supabase integration: See `supabaseHelpers.ts`
- Database schema: See `supabase-schema.sql`

## ?? Next Steps

1. **Run the schema SQL** (most important!)
2. **Enable email auth** in Supabase dashboard
3. **Test login flow** with your email
4. **Create test data** (users, produce, contracts)
5. **Customize** as needed

## ?? Pro Tips

- Use incognito mode to test different users
- Check Supabase logs for debugging
- Use Table Editor to view/edit data directly
- Enable RLS before production deployment

## ?? Need Help?

1. Check `SETUP_GUIDE.md` for detailed instructions
2. Review Supabase docs: https://supabase.com/docs
3. Open issue on GitHub

---

**Ready to go?** Just run the schema SQL and start coding! ??
