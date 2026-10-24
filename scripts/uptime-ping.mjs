/**
 * Saheb Paper ERP â€” Supabase Health Check & Uptime Ping Bot
 * Checks Supabase REST connectivity and measures latency.
 */

const SUPABASE_URL = (process.env.VITE_SUPABASE_URL || 'https://qhatwhupcahsfzpjemye.supabase.co').replace(/\/$/, '');
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFoYXR3aHVwY2Foc2Z6cGplbXllIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI4NTgzMjMsImV4cCI6MjEwODQzNDMyM30.x_OiF5gPyUqLt5zaKKcrpwY8Wi-LyhzJE6ZkyFF6a3o';

async function checkHealth() {
  const startTime = Date.now();
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/users?select=count`, {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        Range: '0-0',
      },
    });

    const duration = Date.now() - startTime;
    if (res.ok) {
      console.log(`âœ… [UPTIME OK] Supabase response time: ${duration}ms (Status: ${res.status})`);
      process.exit(0);
    } else {
      console.error(`âŒ [UPTIME ERROR] Supabase responded with status: ${res.status}`);
      process.exit(1);
    }
  } catch (err) {
    console.error(`âŒ [UPTIME FAILED] Connection error:`, err.message);
    process.exit(1);
  }
}

checkHealth();

