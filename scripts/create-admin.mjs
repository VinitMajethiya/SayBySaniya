import { createClient } from '@supabase/supabase-js';

const url = 'https://rfijaadguucogerjnmdk.supabase.co';
const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJmaWphYWRndXVjb2dlcmpubWRrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIxNDIzMDksImV4cCI6MjEwNzcxODMwOX0.eJGuUMvGp0t3Dse3j5xz4SEzqu_hoS61jZvsL2gZpio';

const client = createClient(url, anonKey);

async function testAuth() {
  const testEmail = 'saylipss.admin@gmail.com';
  const testPass = 'SayLipsAdmin2026!';

  const { data, error } = await client.auth.signUp({
    email: testEmail,
    password: testPass,
  });

  console.log('Sign up result:', { email: data?.user?.email, error });
}

testAuth();
