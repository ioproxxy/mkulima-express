# ?? Adding Admin User to Supabase

## Quick Method (Recommended)

### Step 1: Create Admin in Supabase Auth

1. Go to your Supabase Dashboard:
   ```
   https://supabase.com/dashboard/project/clnzuwagvwktowdomyrz
   ```

2. Click **Authentication** (shield icon) ? **Users** tab

3. Click **"Add user"** ? **"Create new user"**

4. Fill in the form:
   - **Email**: `admin@mkulima.express` (or your preferred email)
   - **Password**: Create a strong password (save it securely!)
   - **Auto Confirm User**: Toggle **ON** (green)
   - **Email Confirm**: Toggle **OFF**

5. Click **"Create user"**

6. **Copy the User UID** (you'll need this in Step 2)

### Step 2: Link Admin Profile to Auth User

1. Stay in Supabase Dashboard

2. Go to **Table Editor** (left sidebar)

3. Click on **users** table

4. Click **"Insert"** ? **"Insert row"**

5. Fill in the fields:
   ```
   id: [Paste the User UID from Step 1]
   email: admin@mkulima.express
   name: Administrator
   role: ADMIN
   location: Nairobi, Kenya
   rating: 5.0
   reviews: 0
   avatar_url: https://picsum.photos/seed/admin/200
   wallet_balance: 0
   ```

6. Click **"Save"**

### Step 3: Test Admin Login

1. Go to your app: `http://localhost:5173`
2. Click **"Are you an administrator? Login here"** (bottom of login page)
3. Enter: `admin@mkulima.express`
4. Click **"Send Login Code"**
5. Check your email for OTP code
6. Enter the code
7. You should access the admin dashboard!

---

## Alternative Method: Using SQL

If you prefer SQL, you can run this in Supabase SQL Editor:

### Step 1: Create Auth User (Do this in Supabase Dashboard first)
You must create the auth user manually in the dashboard first (Step 1 above).

### Step 2: Run This SQL

```sql
-- Replace 'YOUR_AUTH_USER_ID' with the actual UID from Step 1
INSERT INTO users (
  id, 
  email, 
  name, 
  role, 
  location, 
  rating, 
  reviews, 
  avatar_url, 
  wallet_balance,
  created_at
)
VALUES (
  'YOUR_AUTH_USER_ID',  -- ?? Replace this!
  'admin@mkulima.express',
  'Administrator',
  'ADMIN',
  'Nairobi, Kenya',
  5.0,
  0,
  'https://picsum.photos/seed/admin/200',
  0,
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  name = EXCLUDED.name,
  role = 'ADMIN';
```

---

## Multiple Admin Users

To add more admin users, repeat the process with different emails:

```sql
-- Admin User 2
INSERT INTO users (id, email, name, role, location, rating, reviews, avatar_url, wallet_balance)
VALUES (
  'another-auth-user-id',  -- Get from Supabase Auth Users
  'admin2@mkulima.express',
  'Admin Two',
  'ADMIN',
  'Mombasa, Kenya',
  5.0,
  0,
  'https://picsum.photos/seed/admin2/200',
  0
);
```

---

## Testing Admin Features

Once logged in as admin, you can:

? View all users
? View all contracts
? Resolve disputes
? Delete users (except primary admin)
? View all produce listings
? Access admin dashboard
? See system statistics

---

## Security Notes

?? **Important:**
- Admin users have **full access** to all data
- Keep admin credentials **secure**
- Use **strong passwords**
- Enable **2FA** in production (in Supabase Auth settings)
- Don't share admin accounts

---

## Troubleshooting

### Issue: "User with this email already exists"
**Solution**: The email is already taken. Use a different email or delete the existing user first.

### Issue: "Permission denied when inserting into users table"
**Solution**: You need to be authenticated to insert. Use the Table Editor instead of SQL.

### Issue: "Can't login with admin account"
**Solution**: 
1. Verify the user exists in **Authentication ? Users**
2. Verify the profile exists in **Table Editor ? users**
3. Check that `role = 'ADMIN'`
4. Make sure the `id` matches the auth user UID

### Issue: "Admin sees regular dashboard instead of admin dashboard"
**Solution**: Check that the user's role in the `users` table is exactly `'ADMIN'` (all caps).

---

## Quick Reference

### Admin User Requirements
```typescript
{
  id: 'supabase-auth-user-id',  // Must match Auth user UID
  email: 'admin@mkulima.express',
  name: 'Administrator',
  role: 'ADMIN',  // Must be exactly 'ADMIN'
  location: 'Any location',
  rating: 0-5,
  reviews: 0,
  avatar_url: 'https://...',
  wallet_balance: 0
}
```

### Admin Login URL
```
http://localhost:5173/#/admin/login
```

---

## Default Admin (From Schema)

The schema includes a default admin user, but you need to create the auth account:

**Email**: `admin@mkulima.express`
**Profile ID**: `00000000-0000-0000-0000-000000000001`

To activate this default admin:
1. Create auth user with this email
2. Get the UID
3. Update the users table to set the correct `id`

---

## Production Checklist

Before deploying to production:

- [ ] Change default admin email
- [ ] Use strong, unique passwords
- [ ] Enable email confirmation
- [ ] Enable 2FA in Supabase Auth
- [ ] Set up password reset flow
- [ ] Create backup admin account
- [ ] Document admin access procedures
- [ ] Restrict admin access by IP (if possible)

---

**Need help?** Check `INTEGRATION_COMPLETE.md` for more details on user management.
