Key-only license version.

Use:
CPRO-TEST-0001

No email match required.
The same license key can only activate one device because device_id is saved in Supabase.

If you want to reset the test key, run:

update public.licenses
set used = false,
    used_at = null,
    device_id = null,
    status = 'active'
where license_key = 'CPRO-TEST-0001';
