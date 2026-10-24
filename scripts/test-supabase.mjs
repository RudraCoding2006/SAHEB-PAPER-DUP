/**
 * Verification script to test connectivity and row counts on SAHEB-PAPER-ERP-DUP Supabase project.
 */
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://qhatwhupcahsfzpjemye.supabase.co';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFoYXR3aHVwY2Foc2Z6cGplbXllIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI4NTgzMjMsImV4cCI6MjEwODQzNDMyM30.x_OiF5gPyUqLt5zaKKcrpwY8Wi-LyhzJE6ZkyFF6a3o';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const TABLES = [
  'users',
  'raw_materials',
  'raw_material_lots',
  'products',
  'parties',
  'vendors',
  'vehicles',
  'pulp_formulas',
  'machine_rolls',
  'reels',
  'transaction_logs',
  'boiler_logs',
  'etp_logs',
  'electricity_logs',
  'pending_orders',
  'packing_slips',
  'store_items',
  'paper_test_reports',
];

async function checkAll() {
  console.log(`\n🔍 Checking connection to: ${SUPABASE_URL}\n`);
  let successCount = 0;
  let missingCount = 0;

  for (const table of TABLES) {
    const { data, error, count } = await supabase
      .from(table)
      .select('*', { count: 'exact', head: true });

    if (error) {
      console.log(`❌ ${table.padEnd(20)}: ERROR (${error.code || error.message})`);
      missingCount++;
    } else {
      console.log(`✅ ${table.padEnd(20)}: EXISTS (${count ?? 0} rows)`);
      successCount++;
    }
  }

  console.log(`\n========================================`);
  console.log(`Summary: ${successCount}/18 tables ready. (${missingCount} missing)`);
  console.log(`========================================\n`);
}

checkAll().catch(err => {
  console.error('Fatal error checking Supabase:', err);
  process.exit(1);
});
