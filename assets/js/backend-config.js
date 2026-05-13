// Optional production database configuration.
// Keep this as local while presenting/testing without Supabase.
// When the Supabase project is ready, use Step 4 below.

// STEP 4: Add the Supabase values into the website.
// Change this:
// window.EWN_BACKEND = {
//   provider: 'local',
//   supabaseUrl: '',
//   supabaseAnonKey: ''
// };
//
// To this, using your real Supabase Project URL and anon/public key:
// window.EWN_BACKEND = {
//   provider: 'supabase',
//   supabaseUrl: 'https://your-project-id.supabase.co',
//   supabaseAnonKey: 'your-anon-public-key-here'
// };
//
// IMPORTANT: Never place the Supabase service_role key in website files.
// Only use the anon/public key here.
window.EWN_BACKEND = {
  provider: 'local',
  supabaseUrl: '',
  supabaseAnonKey: ''
};
