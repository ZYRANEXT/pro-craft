CraftProfitCalc Pro - Supabase one-use license version

What changed:
- License keys are checked against Supabase.
- A license can be activated once.
- If someone shares the same key, another device is blocked.
- Existing activated device can continue using it.
- Admin can reset used=false in Supabase if needed.

Setup:
1. Create a Supabase project.
2. Open SQL Editor.
3. Paste and run supabase_setup.sql.
4. Go to Project Settings > API.
5. Copy:
   - Project URL
   - anon public key
6. Open app.js and replace:
   PASTE_YOUR_SUPABASE_URL_HERE
   PASTE_YOUR_SUPABASE_ANON_KEY_HERE

Add buyer licenses:
insert into public.licenses (license_key, email, status, used)
values ('CPRO-XXXX-XXXX', 'buyer@email.com', 'active', false);

Test license included:
Key: CPRO-TEST-0001
Email: buyer@example.com
