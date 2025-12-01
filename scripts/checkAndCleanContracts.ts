// Use CommonJS-style import to work with Node + ts-node on a TS ESM project
// ts-node will transpile this correctly
import { supabase } from '../supabaseClient.js';

const log = console.log;

async function main() {
  log('--- Checking contracts vs users ---');

  const { data: users, error: usersError } = await supabase
    .from('users')
    .select('id');

  if (usersError) {
    console.error('Error fetching users:', usersError.message);
    process.exit(1);
  }

  const userIds = new Set<string>((users || []).map(u => u.id as string));
  log(`Loaded ${userIds.size} user ids`);

  const { data: contracts, error: contractsError } = await supabase
    .from('contracts')
    .select('id, farmer_id, vendor_id, produce_name, total_price');

  if (contractsError) {
    console.error('Error fetching contracts:', contractsError.message);
    process.exit(1);
  }

  if (!contracts || contracts.length === 0) {
    log('No contracts found.');
    process.exit(0);
  }

  const badFarmerContracts: any[] = [];
  const badVendorContracts: any[] = [];

  for (const c of contracts) {
    const farmerId = c.farmer_id as string | null;
    const vendorId = c.vendor_id as string | null;

    if (!farmerId || !userIds.has(farmerId)) {
      badFarmerContracts.push(c);
    }
    if (!vendorId || !userIds.has(vendorId)) {
      badVendorContracts.push(c);
    }
  }

  log(`Total contracts: ${contracts.length}`);
  log(`Contracts with missing farmer user: ${badFarmerContracts.length}`);
  log(`Contracts with missing vendor user: ${badVendorContracts.length}`);

  if (badFarmerContracts.length === 0 && badVendorContracts.length === 0) {
    log('All contracts reference existing users. Nothing to clean.');
    process.exit(0);
  }

  log('\nExample broken farmer contracts:');
  badFarmerContracts.slice(0, 5).forEach(c => {
    log(`  id=${c.id}, farmer_id=${c.farmer_id}, vendor_id=${c.vendor_id}, produce=${c.produce_name}, total=${c.total_price}`);
  });

  log('\nExample broken vendor contracts:');
  badVendorContracts.slice(0, 5).forEach(c => {
    log(`  id=${c.id}, farmer_id=${c.farmer_id}, vendor_id=${c.vendor_id}, produce=${c.produce_name}, total=${c.total_price}`);
  });

  // If you are sure you want to delete all broken contracts, set this to true.
  const DELETE_BROKEN = true;

  if (DELETE_BROKEN) {
    const badIds = Array.from(
      new Set<string>([
        ...badFarmerContracts.map(c => c.id as string),
        ...badVendorContracts.map(c => c.id as string),
      ])
    );

    if (badIds.length > 0) {
      log(`\nDeleting ${badIds.length} broken contracts...`);
      const { error: deleteError } = await supabase
        .from('contracts')
        .delete()
        .in('id', badIds);

      if (deleteError) {
        console.error('Error deleting broken contracts:', deleteError.message);
        process.exit(1);
      }

      log('Broken contracts deleted.');
    }
  }

  log('\nDone.');
}

main().catch(err => {
  console.error('Unexpected error:', err);
  process.exit(1);
});
