// Test Supabase Connection
// Run this in browser console or create a test page

import { supabase } from './supabaseClient';

export const testConnection = async () => {
  console.log('?? Testing Supabase Connection...\n');
  
  try {
    // Test 1: Check client initialization
    console.log('? Supabase client initialized');
    console.log('  URL:', supabase.supabaseUrl);
    
    // Test 2: Check auth status
    const { data: { session } } = await supabase.auth.getSession();
    console.log('? Auth check:', session ? '? Logged in' : '?? Not logged in');
    if (session?.user) {
      console.log('  User:', session.user.email);
    }
    
    // Test 3: Query users table
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, email, name, role')
      .limit(5);
    
    if (usersError) {
      console.error('? Users query failed:', usersError.message);
      console.log('  ?? Did you run the schema SQL? Check QUICKSTART.md');
    } else {
      console.log('? Users table query successful');
      console.log('  Found users:', users?.length || 0);
      if (users && users.length > 0) {
        console.table(users);
      }
    }
    
    // Test 4: Query produce table
    const { data: produce, error: produceError } = await supabase
      .from('produce')
      .select('id, name, type')
      .limit(3);
    
    if (produceError) {
      console.error('? Produce query failed:', produceError.message);
    } else {
      console.log('? Produce table query successful');
      console.log('  Found produce:', produce?.length || 0);
    }
    
    // Test 5: Query contracts table
    const { data: contracts, error: contractsError } = await supabase
      .from('contracts')
      .select('id, produce_name, status')
      .limit(3);
    
    if (contractsError) {
      console.error('? Contracts query failed:', contractsError.message);
    } else {
      console.log('? Contracts table query successful');
      console.log('  Found contracts:', contracts?.length || 0);
    }
    
    // Summary
    console.log('\n?? Connection Test Summary:');
    if (!usersError && !produceError && !contractsError) {
      console.log('? All tests passed! Supabase is ready to use.');
      console.log('?? Next: Start building your app!');
    } else {
      console.log('?? Some tests failed. Check the errors above.');
      console.log('?? Make sure you:');
      console.log('  1. Ran supabase-schema.sql in SQL Editor');
      console.log('  2. Enabled email auth in dashboard');
      console.log('  3. Have correct credentials in .env');
    }
    
  } catch (error: any) {
    console.error('? Connection test failed:', error.message);
    console.log('?? Check:');
    console.log('  - .env file has correct credentials');
    console.log('  - Supabase project is active');
    console.log('  - Internet connection is working');
  }
};

// Run test automatically in development
if (import.meta.env.DEV) {
  console.log('?? Run testConnection() in console to test Supabase');
}

export default testConnection;
