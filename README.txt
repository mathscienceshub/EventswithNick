EVENTS WITH NICK WEBSITE v2 ADMIN
=================================

This package contains the public Events with Nick website plus a front-end admin dashboard.

FILES
-----
index.html      - Public client-facing website
admin.html      - Admin dashboard
style.css       - Public website styling
admin.css       - Admin dashboard styling
script.js       - Public website behaviour and booking form
admin.js        - Admin dashboard behaviour
site-data.js    - Default business details and booking status lists
assets/logo.png - Logo taken from the flyer
assets/events-with-nick-flyer.jpeg - Original flyer image
images/         - Add gallery images here later

ADMIN LOGIN
-----------
Open admin.html in the browser.
Password: nick2026

WHAT THE ADMIN DASHBOARD CAN DO
-------------------------------
1. View total bookings, new bookings, confirmed bookings and completed bookings.
2. View and search booking requests.
3. Change booking status: New, Contacted, Quoted, Confirmed, Completed, Cancelled.
4. Add admin notes to each booking.
5. Copy booking details.
6. Export bookings to CSV.
7. Edit website details such as business name, slogan, about text, contacts, location and socials.

IMPORTANT DEPLOYMENT NOTE
-------------------------
This is a front-end/static admin version. It uses browser localStorage for demo and local testing.
That means bookings are saved in the browser where the form is submitted.
For a real live client system where bookings from all visitors appear in the owner's admin dashboard,
connect the website to a backend such as Firebase, Supabase, Google Sheets Apps Script, or a Node/Render backend.

HOW TO TEST LOCALLY
-------------------
1. Open index.html in your browser.
2. Submit a booking request.
3. Open admin.html in the same browser.
4. Login with password: nick2026
5. Go to Bookings to manage the request.

HOW TO DEPLOY ON GITHUB PAGES
-----------------------------
Upload all files and folders in this package to the repository root.
Then enable GitHub Pages from Settings > Pages > Deploy from branch.

NEXT PROFESSIONAL UPGRADE
-------------------------
For full production standard, the next build should connect the booking form and admin dashboard to a real database.
That will allow the business owner to log in from any device and see all client booking requests.
