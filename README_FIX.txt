If license auth fails:

1. Supabase > SQL Editor
2. Run supabase_fix_permissions.sql
3. Redeploy this ZIP
4. Test:
   Email: buyer@example.com
   Key: CPRO-TEST-0001

If it still fails, the page will now show the exact Supabase error message.
