/**
 * Saheb Paper ERP - Data Restore Script
 * Inserts all rows from the demo backup into the new SAHEB-PAPER-ERP-DUP Supabase project.
 */
import fs from 'node:fs';
import path from 'node:path';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://qhatwhupcahsfzpjemye.supabase.co';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFoYXR3aHVwY2Foc2Z6cGplbXllIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI4NTgzMjMsImV4cCI6MjEwODQzNDMyM30.x_OiF5gPyUqLt5zaKKcrpwY8Wi-LyhzJE6ZkyFF6a3o';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const backupPath = path.resolve('backups/saheb_paper_backup_2026-09-18T08-13-57.json');
const backup = JSON.parse(fs.readFileSync(backupPath, 'utf8'));
const tablesData = backup.tables || backup;

// Primary key mapping for upsert
const primaryKeys = {
  users: 'username',
  raw_materials: 'id',
  raw_material_lots: 'lot_no',
  products: 'id',
  parties: 'id',
  vendors: 'id',
  vehicles: 'id',
  pulp_formulas: 'id',
  machine_rolls: 'roll_no',
  reels: 'reel_no',
  transaction_logs: 'id',
  boiler_logs: 'id',
  etp_logs: 'id',
  electricity_logs: 'id',
  pending_orders: 'id',
  packing_slips: 'id',
  store_items: 'id',
  paper_test_reports: 'id',
};

async function restore() {
  console.log('🚀 Restoring all data into SAHEB-PAPER-ERP-DUP...\n');

  for (const [table, rows] of Object.entries(tablesData)) {
    if (!rows || rows.length === 0) {
      console.log(`⏩ ${table.padEnd(20)}: 0 records (skipped)`);
      continue;
    }

    const onConflict = primaryKeys[table] || 'id';

    // Chunk in batches of 50
    const chunkSize = 50;
    let inserted = 0;

    for (let i = 0; i < rows.length; i += chunkSize) {
      const chunk = rows.slice(i, i + chunkSize);
      const { error } = await supabase.from(table).upsert(chunk, { onConflict });

      if (error) {
        console.error(`❌ ${table.padEnd(20)}: batch ${i} error:`, error.message);
        break;
      }
      inserted += chunk.length;
    }

    console.log(`✅ ${table.padEnd(20)}: Restored ${inserted}/${rows.length} rows`);
  }

  console.log('\n🎉 Data restoration complete!');
}

restore().catch(err => {
  console.error('Fatal restore error:', err);
  process.exit(1);
});
