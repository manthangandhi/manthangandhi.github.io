# Ankit & Kajal — Codex Development Handoff

## Goal
Build a polished, production-ready, mobile-first Indian wedding operations web app for Ankit and Kajal, deployed on GitHub Pages at `/ankit-kajal/`. This is a real coordination tool for the groom's family, not just a wedding invitation site.

## Existing state (inspect before editing)
- Current prototype: `ankit-kajal/index.html` (single-page app, static HTML/CSS/JS, localStorage).
- An earlier full-site package was generated in ChatGPT as `ankit-kajal-wedding-website.zip`. It includes illustrated Haldi/Sangeet/Shaadi couple images, `Bridge.html`, `README.md` and a Google Apps Script/Sheets integration. **That ZIP is not verified to be committed to this GitHub repository.** Ask the user to upload the ZIP to Codex if its contents are needed.
- Existing repository has other content under `flip/`. Do not overwrite unrelated paths.
- The site may already have a published Pages URL at `https://manthangandhi.github.io/ankit-kajal/`. Verify deploy status, don't assume it is live.

## Product requirements
1. Wedding-branded design for Ankit & Kajal: festive editorial look; maroon, cream, antique gold; responsive desktop/mobile; accessible form controls; illustration assets for Haldi, Sangeet, Shaadi if provided.
2. Admin command center: KPI dashboard, today's tasks, critical issues, event timeline, progress by department.
3. Departments & POCs: seed 24 departments; primary/backup contact name and phone, lead, notes and statuses; phone tap-to-call.
4. Tasks: department, owner, deadline, priority, status, notes, escalation. Filtering and sorting.
5. Events: Haldi, Mehendi, Sangeet, Baraat, Wedding, Reception, Vidaai; editable dates, locations, assigned captain, schedule/run of show.
6. Guests/RSVP/rooms: bride/groom side, headcount, accommodation, arrivals/departures, special needs, pickup assignment.
7. Vendors: category, contact, checklists, reporting time, agreed cost, payment status, deliverables.
8. Budget and payments: amount, advances, outstanding, due date, payment history; currency INR; no false totals.
9. Issues and incidents: severity, owner, resolution, log.
10. Inventory/gifts, transport, emergency contacts, backup plans.
11. CSV exports, JSON backup, import, search, filters, data validation, empty states, audit log.
12. Role-based access: wedding admins/editors vs limited viewers as appropriate. Do not put guest PII, phone numbers, private sheets, Apps Script secrets, tokens, or credentials into publicly readable GitHub Pages assets.

## Google Sheets backend
- Use a *private Google Sheet* as storage and a Google Apps Script Web App as the API **only if proper authentication and authorization can be implemented and verified**. A public Apps Script URL without robust access control is NOT an acceptable location for sensitive wedding data.
- Document manual Google authorization steps (requires user's account).
- Structure tabs: Departments, Tasks, Events, Guests, Vendors, Payments, Issues, Inventory, Transport, Audit.
- Design for concurrent updates; stable record IDs, timestamps, conflict handling, input validation, safe client access.
- Where Apps Script authentication is not adequate for the public Pages frontend, recommend a more secure backend or Google sign-in + access-controlled service; never fake security.

## Development and acceptance
- Prefer a maintainable modular codebase with scripts, not an unmaintainable giant inline HTML file.
- Scope the app to `ankit-kajal/`; do not disturb other repository paths.
- Commit working code, tests, setup docs, and any legally usable assets. Support GitHub Pages routing correctly.
- Verify key workflows: add/edit/delete POC, task lifecycle, event updates, calculations, export/import, mobile usability and no cross-user data leakage.
- Provide deployment documentation for GitHub Pages and Google integration, plus a concise list of remaining user-only setup actions.

## First action for Codex
Inspect repository state and the existing `ankit-kajal/index.html`, then propose and implement a phased improvement. Prioritize safe persistent storage, core CRUD modules, and polished design.
