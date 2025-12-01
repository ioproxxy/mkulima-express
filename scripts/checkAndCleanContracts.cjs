// Node CJS script to inspect and clean contracts with missing users
// Run with: node scripts/checkAndCleanContracts.cjs

const { createClient } = require('@supabase/supabase-js');

// Load from same env as app; adjust if you moved these
const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing SUPABASE_URL / KEY env vars. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY or SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  console.log('--- Checking contracts vs users (CJS script) ---');

  const { data: users, error: usersError } = await supabase
    .from('users')
    .select('id');

  if (usersError) {
    console.error('Error fetching users:', usersError.message);
    process.exit(1);
  }

  const userIds = new Set((users || []).map(u => u.id));
  console.log(`Loaded ${userIds.size} user ids`);

  const { data: contracts, error: contractsError } = await supabase
    .from('contracts')
    .select('id, farmer_id, vendor_id, produce_name, total_price');

  if (contractsError) {
    console.error('Error fetching contracts:', contractsError.message);
    process.exit(1);
  }

  if (!contracts || contracts.length === 0) {
    console.log('No contracts found.');
    process.exit(0);
  }

  const badFarmerContracts = [];
  const badVendorContracts = [];

  for (const c of contracts) {
    const farmerId = c.farmer_id;
    const vendorId = c.vendor_id;

    if (!farmerId || !userIds.has(farmerId)) {
      badFarmerContracts.push(c);
    }
    if (!vendorId || !userIds.has(vendorId)) {
      badVendorContracts.push(c);
    }
  }

  console.log(`Total contracts: ${contracts.length}`);
  console.log(`Contracts with missing farmer user: ${badFarmerContracts.length}`);
  console.log(`Contracts with missing vendor user: ${badVendorContracts.length}`);

  if (badFarmerContracts.length === 0 && badVendorContracts.length === 0) {
    console.log('All contracts reference existing users. Nothing to clean.');
    process.exit(0);
  }

  console.log('\nExample broken farmer contracts:');
  badFarmerContracts.slice(0, 5).forEach(c => {
    console.log(`  id=${c.id}, farmer_id=${c.farmer_id}, vendor_id=${c.vendor_id}, produce=${c.produce_name}, total=${c.total_price}`);
  });

  console.log('\nExample broken vendor contracts:');
  badVendorContracts.slice(0, 5).forEach(c => {
    console.log(`  id=${c.id}, farmer_id=${c.farmer_id}, vendor_id=${c.vendor_id}, produce=${c.produce_name}, total=${c.total_price}`);
  });

  const DELETE_BROKEN = true;

  if (DELETE_BROKEN) {
    const badIds = Array.from(new Set([
      ...badFarmerContracts.map(c => c.id),
      ...badVendorContracts.map(c => c.id),
    ]));

    if (badIds.length > 0) {
      console.log(`\nDeleting ${badIds.length} broken contracts...`);
      const { error: deleteError } = await supabase
        .from('contracts')
        .delete()
        .in('id', badIds);

      if (deleteError) {
        console.error('Error deleting broken contracts:', deleteError.message);
        process.exit(1);
      }

      console.log('Broken contracts deleted.');
    }
  }

  console.log('\nDone.');
}

main().catch(err => {
  console.error('Unexpected error:', err);
  process.exit(1);
});
