import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Parse .env manually
function loadEnv() {
  const envPath = path.resolve(process.cwd(), '.env');
  if (!fs.existsSync(envPath)) return {};
  const content = fs.readFileSync(envPath, 'utf-8');
  const env = {};
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx !== -1) {
      const key = trimmed.slice(0, eqIdx).trim();
      const val = trimmed.slice(eqIdx + 1).trim();
      env[key] = val;
    }
  }
  return env;
}

const env = loadEnv();
const supabaseUrl = env.VITE_SUPABASE_URL;
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey || !supabaseUrl.startsWith('https://')) {
  console.error('\n❌ ERROR: Supabase credentials not found or incomplete in .env!');
  console.error(`Current VITE_SUPABASE_URL: "${supabaseUrl || ''}"`);
  console.error(`Current VITE_SUPABASE_ANON_KEY: "${supabaseAnonKey ? '***' : ''}"`);
  console.error('\nPlease save your VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env before running this test.\n');
  process.exit(1);
}

const anonClient = createClient(supabaseUrl, supabaseAnonKey);

async function runTests() {
  console.log(`\n======================================================`);
  console.log(`🛡️  VERIFYING ROW LEVEL SECURITY (RLS) WITH ANON KEY`);
  console.log(`Target Supabase URL: ${supabaseUrl}`);
  console.log(`======================================================\n`);

  let passed = 0;
  let failed = 0;

  function report(name, isPass, detail) {
    if (isPass) {
      console.log(`  ✅ PASS: ${name} ${detail ? `(${detail})` : ''}`);
      passed++;
    } else {
      console.log(`  ❌ FAIL: ${name} ${detail ? `(${detail})` : ''}`);
      failed++;
    }
  }

  // 1. Anon can read products
  try {
    const { data, error } = await anonClient.from('products').select('id, name, slug');
    report('Anonymous user can read products', !error && Array.isArray(data), error?.message || `Found ${data?.length || 0} products`);
  } catch (err) {
    report('Anonymous user can read products', false, err.message);
  }

  // 2. Anon can read active deals
  try {
    const { data, error } = await anonClient.from('deals').select('id, title, is_active');
    const allActive = data?.every(d => d.is_active) ?? true;
    report('Anonymous user can read active deals only', !error && allActive, error?.message || `Found ${data?.length || 0} active deals`);
  } catch (err) {
    report('Anonymous user can read active deals only', false, err.message);
  }

  // 3. Anon can read approved reviews
  try {
    const { data, error } = await anonClient.from('reviews').select('id, status');
    const allApproved = data?.every(r => r.status === 'approved') ?? true;
    report('Anonymous user can read approved reviews', !error && allApproved, error?.message || `Found ${data?.length || 0} approved reviews`);
  } catch (err) {
    report('Anonymous user can read approved reviews', false, err.message);
  }

  // 4. Anon can read active testimonials
  try {
    const { data, error } = await anonClient.from('testimonials').select('id, author_name, is_active');
    const allActive = data?.every(t => t.is_active) ?? true;
    report('Anonymous user can read visible testimonials', !error && allActive, error?.message || `Found ${data?.length || 0} testimonials`);
  } catch (err) {
    report('Anonymous user can read visible testimonials', false, err.message);
  }

  // 5. Anon can NOT read pending reviews
  try {
    const { data, error } = await anonClient.from('reviews').select('id, status').eq('status', 'pending');
    report('Anonymous user can NOT read pending reviews', !error && (!data || data.length === 0), `Returned ${data?.length || 0} rows (should be 0)`);
  } catch (err) {
    report('Anonymous user can NOT read pending reviews', false, err.message);
  }

  // 6. Anon can NOT read enquiries
  try {
    const { data, error } = await anonClient.from('enquiries').select('*');
    const blocked = error || !data || data.length === 0;
    report('Anonymous user can NOT read enquiries', blocked, error?.message || `Returned ${data?.length || 0} rows (should be 0)`);
  } catch (err) {
    report('Anonymous user can NOT read enquiries', true, 'Access blocked with exception');
  }

  // 7. Anon can NOT read orders
  try {
    const { data, error } = await anonClient.from('orders').select('*');
    const blocked = error || !data || data.length === 0;
    report('Anonymous user can NOT read orders', blocked, error?.message || `Returned ${data?.length || 0} rows (should be 0)`);
  } catch (err) {
    report('Anonymous user can NOT read orders', true, 'Access blocked with exception');
  }

  // 8. Anon can NOT read admin_users
  try {
    const { data, error } = await anonClient.from('admin_users').select('*');
    const blocked = error || !data || data.length === 0;
    report('Anonymous user can NOT read admin_users', blocked, error?.message || `Returned ${data?.length || 0} rows (should be 0)`);
  } catch (err) {
    report('Anonymous user can NOT read admin_users', true, 'Access blocked with exception');
  }

  // 9. Anon CAN insert enquiry
  try {
    const { error } = await anonClient.from('enquiries').insert({
      channel: 'whatsapp',
      customer_name: 'RLS Test Visitor',
      total_paise: 29900,
      cart_snapshot: { items: [], totalPaise: 29900 }
    });
    report('Anonymous user CAN insert enquiry', !error, error?.message || 'Successfully saved');
  } catch (err) {
    report('Anonymous user CAN insert enquiry', false, err.message);
  }

  // 10. Anon can NOT update or delete enquiries
  try {
    const { data, error } = await anonClient.from('enquiries').update({ customer_name: 'Hacked' }).eq('channel', 'whatsapp').select();
    const noUpdate = error || !data || data.length === 0;
    report('Anonymous user can NOT update enquiries', noUpdate, error?.message || `Updated rows: ${data?.length || 0} (should be 0)`);
  } catch (err) {
    report('Anonymous user can NOT update enquiries', true, 'Update blocked');
  }

  // 11. Anon CAN insert review with status="pending"
  try {
    const { error } = await anonClient.from('reviews').insert({
      author_name: 'RLS Tester',
      rating: 5,
      review_text: 'Pending review submitted for moderation test',
      status: 'pending'
    });
    report('Anonymous user CAN insert review with status="pending"', !error, error?.message || 'Successfully submitted as pending');
  } catch (err) {
    report('Anonymous user CAN insert review with status="pending"', false, err.message);
  }

  // 12. Anon CANNOT insert review with status="approved"
  try {
    const { error } = await anonClient.from('reviews').insert({
      author_name: 'Malicious Reviewer',
      rating: 5,
      review_text: 'Bypassing moderation attempt',
      status: 'approved'
    });
    report('Anonymous user CANNOT insert review with status="approved"', Boolean(error), error ? `Correctly rejected: ${error.message}` : 'SECURITY RISK: Insert succeeded!');
  } catch (err) {
    report('Anonymous user CANNOT insert review with status="approved"', true, `Rejected: ${err.message}`);
  }

  // 13. Anon can NOT update or delete products
  try {
    const { data, error } = await anonClient.from('products').update({ price: 100 }).neq('id', '00000000-0000-0000-0000-000000000000').select();
    const noUpdate = error || !data || data.length === 0;
    report('Anonymous user can NOT update products', noUpdate, error?.message || `Updated rows: ${data?.length || 0} (should be 0)`);
  } catch (err) {
    report('Anonymous user can NOT update products', true, 'Update blocked');
  }

  // 14. Non-admin signed-in user test (simulated by checking is_admin with anonymous / non-whitelisted auth)
  try {
    const { data: adminCheck, error: fnError } = await anonClient.rpc('is_admin');
    report('Non-admin user returns is_admin = false', adminCheck === false || fnError, `is_admin() = ${adminCheck}`);
  } catch (err) {
    report('Non-admin user returns is_admin = false', true, 'Function execution restricted');
  }

  console.log(`\n------------------------------------------------------`);
  console.log(`Total Passed: ${passed} | Total Failed: ${failed}`);
  console.log(`------------------------------------------------------\n`);
  
  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
