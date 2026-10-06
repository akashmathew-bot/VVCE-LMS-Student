import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error(
    'Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env. ' +
    'Add SUPABASE_SERVICE_ROLE_KEY from Project Settings -> API -> service_role.'
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

const TEMP_PASSWORD = 'vvce@11';

async function syncUsers() {
  console.log('Fetching students table...');
  const { data: students, error } = await supabase.from('students').select('*');

  if (error) {
    console.error('Error fetching students:', error);
    return;
  }

  console.log(`Found ${students.length} students. Creating login accounts...`);

  let successCount = 0;
  let skippedCount = 0;
  let failCount = 0;

  for (const student of students) {
    const usn = student.usn;
    const name = student.name || 'Student';
    if (!usn) continue;

    const email = `${usn}@vvce.ac.in`.toLowerCase();

    const { error: authError } = await supabase.auth.admin.createUser({
      email,
      password: TEMP_PASSWORD,
      email_confirm: true,
      user_metadata: {
        name,
        must_change_password: true,
      },
    });

    if (authError) {
      if (authError.message?.toLowerCase().includes('already been registered')) {
        console.log(`Skipped (already exists): ${usn}`);
        skippedCount++;
      } else {
        console.error(`Failed to create ${usn}:`, authError.message);
        failCount++;
      }
    } else {
      console.log(`Created: ${usn}`);
      successCount++;
    }
  }

  console.log(
    `Done! Created: ${successCount}, Skipped (existing): ${skippedCount}, Failed: ${failCount}`
  );
  console.log(`Temporary password for all new accounts: ${TEMP_PASSWORD}`);
}

syncUsers();