# Ankit & Kajal — Wedding Command Centre V3

A responsive Indian wedding operations tracker using **the actual generated illustrations** of Ankit & Kajal: yellow Haldi outfits, dancing Sangeet outfits, and traditional wedding outfits.

## Website
- GitHub Pages: https://manthangandhi.github.io/ankit-kajal/
- Main file: `index.html` (self-contained, illustration images embedded as data URIs to avoid broken SVG wrappers).
- Modules: Overview, 24 Department POCs, Tasks, Events, Guests & Rooms, Vendors, Budget & Payments, Issues, Inventory & Gifts, Transport, Settings & Sync.
- Local mode uses browser localStorage. CSV and JSON exports available.

## Create your Google Sheet in ONE Run
Google requires a one-time authorization; the website cannot bypass it.

1. Open https://script.google.com/home/projects/create and create a project called `Ankit Kajal Wedding Tracker`.
2. Replace the starter `Code.gs` with the contents of this repo's `Code.gs`.
3. Add an HTML file named **Bridge** and paste this repo's `Bridge.html` into it.
4. In the Apps Script function picker, choose **setupWeddingSheet**, click **Run** and authorize Google.
5. Open the **Execution log** to copy the **GOOGLE SHEET URL** and **ACCESS PIN**. The one run creates the private Sheet, all nine tabs, 24 departments and seven initial events; it also generates a private 64-character PIN. Running the setup again reuses the existing spreadsheet.
6. Choose **Deploy → New deployment → Web app**, set **Execute as Me**, access **Anyone**, click Deploy and copy the `/exec` URL.
7. On the wedding site, open **Settings & Sync**, enter the /exec URL and PIN, Save Connection, then **Download from Sheets** to get the seeded data. Alternatively export a local JSON backup and deliberately use **Upload local to Sheets** to replace the sheet dataset.

## Important security and collaboration limits
The Apps Script bridge is a shared-PIN MVP, not secure per-user authentication. Anyone who learns the PIN can access ALL records. Don't store sensitive personal/financial information without stronger authentication. GitHub Pages remains public. Never commit guest data, passwords, PINs or spreadsheet IDs.

Whole-dataset saves are **last-write-wins**. Simultaneous editing may overwrite another user's updates. For multi-coordinator use, implement proper server-side per-record updates, version checks, and role-based Google authentication before relying on it as the sole system of record. Take frequent backups.

## Files
- `index.html`: fully responsive dashboard, illustrations and tracking modules
- `Code.gs`: one-run spreadsheet creation, load and save operations
- `Bridge.html`: browser-to-Apps-Script cross-origin message bridge
- `assets/`: additional art versions
