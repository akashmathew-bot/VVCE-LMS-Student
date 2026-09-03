import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://yahvddokdffidkywmxqe.supabase.co';
const supabaseKey = 'sb_publishable_Lq96lovf6MB_jA95-vyVDg_wvbfGjkf';
const supabase = createClient(supabaseUrl, supabaseKey);

async function syncUsers() {
  console.log("Fetching students table...");
  const { data: students, error } = await supabase
    .from('students')
    .select('*');

  if (error) {
    console.error("Error fetching students:", error);
    return;
  }

  console.log(`Found ${students.length} students. Creating auth accounts...`);

  let successCount = 0;
  let failCount = 0;

  for (const student of students) {
    const usn = student.usn; 
    const name = student.name || "Student"; 
    if (!usn) continue;

    const email = `${usn}@vvce.ac.in`.toLowerCase();
    
    console.log(`Creating account for ${usn}...`);
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password: 'vvce@11',
      options: {
        data: {
          name: name,
        }
      }
    });

    if (authError) {
      console.error(`Failed to create ${usn}:`, authError.message);
      failCount++;
    } else {
      console.log(`Success: ${usn}`);
      successCount++;
    }
  }

  console.log(`Done! Success: ${successCount}, Failed: ${failCount}`);
}

syncUsers();
