EVENTS WITH NICK - OFFICIAL WEBSITE + OWNER PORTAL v6

WHAT IS INCLUDED
1. Public luxury website
2. Real booking request form
3. Owner portal / admin dashboard
4. Online-ready booking records and status tracking
5. Quote builder
6. Price Settings page for the quote builder
7. Editable Banking Details page for official quote text and PDF quotes
8. Professional quote PDF with logo, legal details, generated date/time, footer and light watermark
9. Website Details editor
10. Gallery manager
11. CSV export, PDF booking report, JSON backup
12. Supabase-ready production database file
13. Step 4 Supabase configuration instructions included in the admin dashboard and backend-config.js
14. Quote communication buttons for WhatsApp and email draft preparation

OWNER PORTAL
Open admin.html
Presentation password: nick2026

WHERE QUOTE BUILDER PRICES ARE SET
Admin / Owner Portal -> Price Settings
You can edit:
- Service level prices
- Decor level prices
- Catering support prices
- Extra charges
- Per guest coordination amount
The Quote Builder uses these saved price settings automatically.

WHERE BANKING DETAILS ARE SET
Admin / Owner Portal -> Banking Details
You can edit:
- Account holder
- Bank name
- Account number
- Account type
- Branch code
- Payment reference instruction
- Payment note
These banking details appear in the copied quote text and downloaded quote PDF, not openly on the public website.

BOOKING RECORD BACKUP
Admin / Owner Portal -> Backup & Go Live
Use:
- Download Bookings PDF Report
- Download Full JSON Backup
- Export CSV button in the dashboard header
Save these on Nick's computer as manual backup records.

GITHUB PAGES DEMO
Upload these files to the root of the GitHub repository:
index.html
admin.html
assets folder
backend folder
README_DEPLOYMENT.txt
GO_LIVE_CHECKLIST.txt
SUPABASE_STEP_4.txt

SUPABASE STEP 4
Open assets/js/backend-config.js
Change this:

window.EWN_BACKEND = {
  provider: 'local',
  supabaseUrl: '',
  supabaseAnonKey: ''
};

To this, using Nick's real Supabase project values:

window.EWN_BACKEND = {
  provider: 'supabase',
  supabaseUrl: 'https://your-project-id.supabase.co',
  supabaseAnonKey: 'your-anon-public-key-here'
};

IMPORTANT
Never put the Supabase service_role key inside website files.
Only use the anon/public key in backend-config.js.

REAL LIVE USE
GitHub Pages is perfect for showing the website to Nick.
For true live business use where bookings appear across all devices, connect Supabase using backend/supabase-schema.sql and fill in assets/js/backend-config.js.
For real secure owner login, move authentication to Supabase Auth or a backend server before handling serious client data.


CLIENT COMMUNICATION
See CLIENT_COMMUNICATION_NOTES.txt for the difference between manual WhatsApp/email sending and automatic email/WhatsApp integration.
