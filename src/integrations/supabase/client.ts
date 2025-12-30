// Supabase Client Configuration
// This file sets up the connection to your Supabase database
// Make sure to configure your environment variables in .env file

import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Environment variables - these come from your .env file
// Copy .env.example to .env and fill in your Supabase project details
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});