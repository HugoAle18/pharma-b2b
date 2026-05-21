import { createClient } from '@supabase/supabase-js';

export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/rest\/v1\/?$/, '').replace(/\/$/, '')
  return createClient(
    supabaseUrl!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}
