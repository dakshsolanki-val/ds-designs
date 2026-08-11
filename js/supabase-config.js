/* ============================================
   DS DESIGNS — Supabase Configuration
   ============================================
   STEP 1: Replace the two values below with
   your actual Supabase project URL and anon key.
   (See SETUP_GUIDE.md for exactly where to find them.)

   Until you fill these in, the site runs on the
   local static data in projects-data.js — no errors.
   ============================================ */

const SUPABASE_URL      = 'https://xxzmkkttgukwwdeotqze.supabase.co';       // e.g. https://abcdefgh.supabase.co
const SUPABASE_ANON_KEY = 'sb_publishable_Spbu-dmlWd5RaZ51DOkyEw_ynBVrAt-';  // starts with "eyJhbGci..."

// Set this to your Formspree, EmailJS, or webhook endpoint to receive contact submissions.
const CONTACT_FORM_ENDPOINT = '';
const CONTACT_FORM_EMAIL = 'auminterieurs@gmail.com';

// Do not edit this line — it's read by db.js
const SUPABASE_CONFIGURED = (
  SUPABASE_URL      !== 'YOUR_SUPABASE_URL' &&
  SUPABASE_ANON_KEY !== 'YOUR_SUPABASE_ANON_KEY' &&
  SUPABASE_URL.startsWith('https://')
);

