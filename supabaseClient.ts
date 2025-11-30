import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://clnzuwagvwktowdomyrz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNsbnp1d2FndndrdG93ZG9teXJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQyOTAzMTgsImV4cCI6MjA3OTg2NjMxOH0.CwGVd42Y7bqOl9rSAjQdxWUdjduW5cSeoqpI7vEh3CM';

export const supabase = createClient(supabaseUrl, supabaseKey);
