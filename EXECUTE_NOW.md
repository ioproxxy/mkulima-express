# ?? STEP-BY-STEP EXECUTION GUIDE

Follow these steps **exactly as written**. Each step has a checkbox ? - check it off when done!

---

## ? STEP 1: Open Supabase Dashboard (30 seconds)

### Do This Now:
1. Open your browser
2. Go to: **https://supabase.com/dashboard/project/clnzuwagvwktowdomyrz**
3. You should see your "mkulima-express" project dashboard

**? Done? Check the box above and move to Step 2**

---

## ? STEP 2: Open SQL Editor (30 seconds)

### Do This Now:
1. In the Supabase dashboard (left sidebar)
2. Look for the **SQL Editor** icon (looks like `</>` or code brackets)
3. Click on it
4. You'll see the SQL Editor page

**? Done? Check the box above and move to Step 3**

---

## ? STEP 3: Create New Query (15 seconds)

### Do This Now:
1. Click the **"+ New query"** button (top left area)
2. A blank SQL editor will appear

**? Done? Check the box above and move to Step 4**

---

## ? STEP 4: Copy the Schema SQL (30 seconds)

### Do This Now:
1. In VS Code, open the file: **`supabase-schema.sql`** (you already have it open!)
2. Press **Ctrl+A** (select all)
3. Press **Ctrl+C** (copy)

**? Done? Check the box above and move to Step 5**

---

## ? STEP 5: Paste and Run Schema (1 minute)

### Do This Now:
1. Go back to Supabase SQL Editor (in your browser)
2. Click in the blank query area
3. Press **Ctrl+V** (paste)
4. You should see all the SQL code appear
5. Click the **"RUN"** button (or press **Ctrl+Enter**)
6. Wait for it to finish (5-10 seconds)

### ? Success Looks Like:
- Green success message
- Text: **"Success. No rows returned"**
- No red error messages

### ?? If You See Errors:
- Most errors are okay if they say "already exists"
- Just click **RUN** again
- The `ON CONFLICT` statements will handle duplicates

**? Done? Check the box above and move to Step 6**

---

## ? STEP 6: Verify Tables Created (1 minute)

### Do This Now:
1. In Supabase dashboard, click **"Table Editor"** (left sidebar, looks like a table icon)
2. You should see these 5 tables:
   - ? users
   - ? produce
   - ? contracts
   - ? transactions
   - ? messages

### ? Success Looks Like:
All 5 tables appear in the list on the left

### ?? If Tables Don't Appear:
- Refresh the page (F5)
- Make sure Step 5 showed "Success"
- If still missing, go back to Step 3 and try again

**? Done? Check the box above and move to Step 7**

---

## ? STEP 7: Enable Email Authentication (1 minute)

### Do This Now:
1. In Supabase dashboard, click **"Authentication"** (left sidebar, shield icon)
2. Click the **"Providers"** tab (top of page)
3. Find the **"Email"** row in the list
4. Click on it to expand
5. Toggle **"Enable Email provider"** to **ON** (should turn green)
6. Find **"Confirm email"** toggle
7. Turn it **OFF** (for development - makes testing easier)
8. Scroll down and click **"Save"** button

### ? Success Looks Like:
- "Email" provider shows green "Enabled" badge
- Changes saved successfully

**? Done? Check the box above and move to Step 8**

---

## ? STEP 8: Start Development Server (30 seconds)

### Do This Now:
1. Open a terminal in VS Code (Terminal ? New Terminal)
2. Type: **`npm run dev`**
3. Press Enter
4. Wait for "Local: http://localhost:5173"

### ? Success Looks Like:
```
VITE v5.x.x ready in xxx ms

?  Local:   http://localhost:5173/
```

**? Done? Check the box above and move to Step 9**

---

## ? STEP 9: Test Supabase Connection (1 minute)

### Do This Now:
1. Open browser to: **http://localhost:5173**
2. Press **F12** to open browser console
3. Click the **"Console"** tab
4. Copy this line:
   ```javascript
   import('./testSupabase.ts').then(m => m.testConnection())
   ```
5. Paste it in the console
6. Press **Enter**
7. Wait 2-3 seconds for results

### ? Success Looks Like:
```
?? Testing Supabase Connection...
? Supabase client initialized
? Auth check
? Users table query successful
  Found users: 1
? Produce table query successful
? Contracts table query successful
? All tests passed! Supabase is ready to use.
```

### ?? If You See Errors:
- "Table doesn't exist" ? Go back to Step 5, re-run schema
- "Invalid API key" ? Check .env file has correct credentials
- "Permission denied" ? Go back to Step 5, RLS policies didn't load

**? Done? Check the box above and move to Step 10**

---

## ? STEP 10: Test Login Flow (2 minutes)

### Do This Now:
1. In the browser (still at http://localhost:5173)
2. You should see the Mkulima Express login screen
3. Click **"Login or Sign Up"** button
4. Click **"I'm a Farmer"** (or "I'm a Vendor")
5. Enter your real email address
6. Click **"Send Login Code"**
7. Check your email inbox (and spam/junk folder!)
8. Find the email with your login code
9. Copy the 6-digit code
10. Paste it in the verification screen
11. Click **"Verify & Continue"**

### First Time Users:
- You'll see a registration form
- Fill it out with your details
- Click "Register"
- You'll be redirected to dashboard

### Returning Users:
- You'll go straight to dashboard

### ? Success Looks Like:
- You receive the email with code
- Code verification works
- You reach the dashboard screen

### ?? Common Issues:
- **No email received:**
  - Check spam/junk folder
  - Wait 2-3 minutes (sometimes delayed)
  - Try a different email address
  - Verify Step 7 was completed correctly

- **"Invalid code" error:**
  - Make sure you copied the full 6-digit code
  - Code expires after 10 minutes - request a new one
  - Check for spaces before/after the code

- **"Permission denied" error:**
  - RLS policies issue
  - Go back to Step 5, re-run the schema

**? Done? Check the box above - YOU'RE FINISHED!**

---

## ?? CONGRATULATIONS!

If all 10 boxes are checked, your Supabase backend is **fully integrated and working**!

### What You Can Do Now:

? **Login with email OTP**
? **Create produce listings** (as farmer)
? **Make contract offers** (as vendor)
? **Send messages** (in contracts)
? **Manage wallet** (add funds, track transactions)
? **View market insights**

### Your App Now Has:

? Secure authentication (no passwords!)
? All data stored in Supabase
? Real-time messaging
? Row-level security
? Production-ready infrastructure

---

## ?? Quick Stats

**Time to complete:** ~10-15 minutes
**Steps completed:** 10/10 ?
**Tables created:** 5
**Authentication:** Email OTP ?
**Backend status:** LIVE AND WORKING! ??

---

## ?? If Something Went Wrong

### Still stuck on a step?

1. **Re-read the step carefully** - follow exactly as written
2. **Check for error messages** - they usually tell you what's wrong
3. **Try the step again** - sometimes it works on the second try

### Need more help?

- **Detailed guide:** Read `INTEGRATION_COMPLETE.md`
- **Quick reference:** See `QUICKSTART.md`
- **Setup guide:** Check `SETUP_GUIDE.md`
- **Supabase docs:** https://supabase.com/docs

### Test Failed?

Run the test again to see if error is temporary:
```javascript
import('./testSupabase.ts').then(m => m.testConnection())
```

---

## ?? What's Next?

Now that your backend is working, you can:

1. **Explore the app** - Try all features
2. **Add test data** - Create sample produce, contracts
3. **Test different users** - Use incognito mode for multiple accounts
4. **Customize** - Update App.tsx to add your own features
5. **Deploy** - When ready, deploy to production

---

## ?? Pro Tips

- **Use Supabase Table Editor** to view your data
- **Check Supabase Logs** when debugging
- **Test in incognito mode** for different user accounts
- **Keep schema file** for future database updates

---

**?? Happy coding with Mkulima Express!**

Your backend is now powered by Supabase and ready for production! ??
