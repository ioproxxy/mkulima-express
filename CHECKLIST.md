# ? SUPABASE INTEGRATION CHECKLIST

## ?? Complete These Steps to Activate Your Backend

---

## ? STEP 1: Database Setup (5 minutes)

### Action: Run Schema in Supabase

1. Open browser ? https://supabase.com/dashboard/project/clnzuwagvwktowdomyrz
2. Click **SQL Editor** (left sidebar, looks like `</>`)
3. Click **+ New Query** button
4. Open file `supabase-schema.sql` in your editor
5. **Copy ALL contents** (Ctrl+A, Ctrl+C)
6. **Paste** into Supabase SQL Editor (Ctrl+V)
7. Click **RUN** button (or press Ctrl+Enter)
8. Wait for green success message: "Success. No rows returned"

**? Checkpoint:** You should see these tables in **Table Editor**:
- users
- produce
- contracts
- transactions
- messages

---

## ? STEP 2: Enable Authentication (2 minutes)

### Action: Turn On Email Login

1. In Supabase dashboard, click **Authentication** (shield icon)
2. Click **Providers** tab
3. Find **Email** row
4. Click to expand it
5. Toggle **Enable Email provider** to ON (should turn green)
6. Toggle **Confirm email** to OFF (for development)
7. Click **Save** button at bottom

**? Checkpoint:** Email provider should show as "Enabled"

---

## ? STEP 3: Start Development (1 minute)

### Action: Run Your App

```bash
# In your terminal:
npm run dev
```

**? Checkpoint:** App should start at http://localhost:5173

---

## ? STEP 4: Test Connection (2 minutes)

### Action: Verify Supabase Works

1. Open app in browser: http://localhost:5173
2. Open browser console (Press F12)
3. Click **Console** tab
4. Type or paste this:
   ```javascript
   import('./testSupabase.ts').then(m => m.testConnection())
   ```
5. Press Enter
6. Wait for results

**? Checkpoint:** You should see:
```
? Supabase client initialized
? Auth check
? Users table query successful
? Produce table query successful
? Contracts table query successful
? All tests passed!
```

---

## ? STEP 5: Test Login (3 minutes)

### Action: Try Email OTP Login

1. Click **"Login or Sign Up"** button
2. Click **"I'm a Farmer"** (or Vendor)
3. Enter your real email address
4. Click **"Send Login Code"**
5. Check your email (including spam/junk folder)
6. Find email with subject like "Magic Link" or "Login Code"
7. Copy the 6-digit code
8. Enter code in the verification screen
9. Complete registration form (first time only)

**? Checkpoint:** You should reach the dashboard

---

## ?? SUCCESS INDICATORS

If you see ALL of these, you're done:

- ? Database tables visible in Supabase Table Editor
- ? Email provider shows as "Enabled"
- ? App runs without errors
- ? Test connection passes all checks
- ? You receive OTP email
- ? Login works and you reach dashboard

---

## ?? TROUBLESHOOTING

### Problem: "Table doesn't exist" error
**Solution:** Go back to Step 1, re-run the schema SQL

### Problem: "No OTP email received"
**Solutions:**
1. Check spam/junk folder
2. Wait 2-3 minutes (sometimes delayed)
3. Verify Step 2 was completed
4. Try a different email address

### Problem: "Permission denied for table"
**Solution:** RLS policies not loaded. Re-run schema (Step 1)

### Problem: "Cannot connect to Supabase"
**Solutions:**
1. Check `.env` file exists and has correct values
2. Restart dev server: Stop (Ctrl+C) then `npm run dev`
3. Verify internet connection

### Problem: Test connection fails
**Solutions:**
1. Ensure schema was run successfully
2. Check Supabase project is active (not paused)
3. Verify `.env` credentials match your project

---

## ?? DOCUMENTATION

After completing these steps, read:

1. **INTEGRATION_COMPLETE.md** - How everything works
2. **QUICKSTART.md** - Quick reference
3. **SETUP_GUIDE.md** - Detailed explanations

---

## ?? WHAT'S NEXT?

Once all 5 steps are complete:

### Immediate:
- [ ] Test creating a produce listing
- [ ] Test creating a contract
- [ ] Test the wallet system
- [ ] Test messaging between users

### Soon:
- [ ] Update App.tsx to use new contexts (see INTEGRATION_COMPLETE.md)
- [ ] Add more sample data
- [ ] Customize email templates
- [ ] Test all user flows

### Later:
- [ ] Deploy to production
- [ ] Set up custom domain
- [ ] Enable email confirmation
- [ ] Add monitoring

---

## ? QUICK COMMANDS

```bash
# Start development
npm run dev

# Check Supabase connection
node setup-supabase.js

# View documentation
cat START_HERE.md
cat INTEGRATION_COMPLETE.md
```

---

## ?? STILL STUCK?

1. Check START_HERE.md for overview
2. Read INTEGRATION_COMPLETE.md for detailed guide
3. Check Supabase docs: https://supabase.com/docs
4. Check Supabase logs in dashboard

---

**You've got this! Just follow the 5 steps above.** ??

Each step should take only a few minutes. Total time: ~15 minutes.

**Questions?** Everything is documented in the files mentioned above.
