#!/usr/bin/env node

/**
 * Supabase Database Setup Script
 * Run this after setting up your .env file
 */

const fs = require('fs');
const path = require('path');

console.log('?? Mkulima Express - Supabase Setup\n');

// Check if .env file exists
const envPath = path.join(process.cwd(), '.env');
if (!fs.existsSync(envPath)) {
  console.error('? .env file not found!');
  console.log('\n?? Create a .env file with:');
  console.log('   VITE_SUPABASE_URL=your_project_url');
  console.log('   VITE_SUPABASE_ANON_KEY=your_anon_key\n');
  process.exit(1);
}

// Read .env file
const envContent = fs.readFileSync(envPath, 'utf-8');
const hasUrl = envContent.includes('VITE_SUPABASE_URL');
const hasKey = envContent.includes('VITE_SUPABASE_ANON_KEY');

console.log('? .env file found');
console.log(`   ${hasUrl ? '?' : '?'} VITE_SUPABASE_URL`);
console.log(`   ${hasKey ? '?' : '?'} VITE_SUPABASE_ANON_KEY\n`);

if (!hasUrl || !hasKey) {
  console.error('? Missing required environment variables\n');
  process.exit(1);
}

console.log('?? Next Steps:\n');
console.log('1. Go to your Supabase Dashboard:');
console.log('   https://supabase.com/dashboard\n');

console.log('2. Open SQL Editor (left sidebar)\n');

console.log('3. Click "New Query"\n');

console.log('4. Copy and paste the contents of supabase-schema.sql\n');

console.log('5. Click Run (or press Ctrl+Enter)\n');

console.log('6. Enable Email Authentication:');
console.log('   - Go to Authentication ? Providers');
console.log('   - Enable "Email" provider');
console.log('   - Disable "Confirm email" (for development)');
console.log('   - Click Save\n');

console.log('7. Start your development server:');
console.log('   npm run dev\n');

console.log('8. Test the connection:');
console.log('   - Open browser console');
console.log('   - Run: import("./testSupabase.ts").then(m => m.testConnection())\n');

console.log('?? Documentation:');
console.log('   - Quick Start: QUICKSTART.md');
console.log('   - Full Setup: SETUP_GUIDE.md');
console.log('   - Integration: BACKEND_INTEGRATION.md\n');

console.log('? Ready to build amazing things!\n');
