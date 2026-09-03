import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://yahvddokdffidkywmxqe.supabase.co';
const supabaseKey = 'sb_publishable_Lq96lovf6MB_jA95-vyVDg_wvbfGjkf';
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTable() {
  console.log("Fetching students table...");
  const { data, error } = await supabase
    .from('students')
    .select('*')
    .limit(5);

  if (error) {
    console.error("Error fetching students:", error);
  } else {
    console.log("Students found:", data);
  }
}

checkTable();
