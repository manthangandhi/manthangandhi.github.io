# Ankit & Kajal Wedding Command Centre

Responsive wedding operations app for the family and coordination team. The dashboard is hosted at `/ankit-kajal/`, with Haldi, Sangeet and Shaadi illustrations in `assets/*.svg`.

## Tracking modules

24 Departments and POCs; tasks; ceremony events and timelines; guest room / RSVP tracker; vendors; payments; issues; inventory and gift lists; transportation. Add, edit, delete, search and filter records, export per-module CSV, export or restore full JSON backups. Responsive navigation is optimized for phones.

## Storage and security

By default the app stores records only in the browser's localStorage, **not** on GitHub or across devices. The publicly hosted GitHub Pages frontend has no sign-in. Do not enter sensitive personal information until a private authenticated backend is installed.

An optional starter Google Sheets backend is included as `Code.gs` and `Bridge.html`. To configure: open script.google.com under the Google account that will own the private Sheet; create a project; paste Code.gs and create a Bridge.html HTML file; run setupWeddingSheet() and approve Google permissions; set a Script Property named AK_ACCESS_PIN with a strong random passphrase (16+ chars); deploy Web App as yourself with access Anyone; enter the /exec URL and PIN in Settings & Sync; manually upload local data or download cloud data.

**Security limitation:** This is a shared-PIN prototype, not secure per-user authentication. A person with the PIN can access and overwrite all records. Cross-device saves use last-write-wins and can lose concurrent changes. For actual guest PII and finance records, replace this with strong user authentication, granular authorization and per-record updates. Do not publicly share the Google Sheet or the PIN. Back up frequently.

## Deployment

GitHub Pages should serve this folder from `https://manthangandhi.github.io/ankit-kajal/` once the repository's Pages settings are enabled. All artwork is committed as optimized embedded-image SVG assets so the repository remains text-file deployable.

## Development

Open the `index.html` in your browser or use a static web server from the folder. Check `CODEX_HANDOFF.md` and the linked GitHub issue for the fuller production roadmap.
