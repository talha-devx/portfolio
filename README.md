# Muhammad Talha — Developer Portfolio

A clean, dark personal portfolio. The pages are plain HTML/CSS/JS; a small
Node.js + Express backend serves a **projects CRUD API** (no database — projects live in
`data/projects.js`) and handles the **contact form** (emailed with Nodemailer / Gmail SMTP).

**Stack:** HTML5 · CSS3 · Vanilla JavaScript · Node.js · Express · Nodemailer

---

## Folder structure

```
Portfolio/
├── public/                 ← everything the browser sees
│   ├── css/style.css       ← the whole design (one file)
│   ├── js/
│   │   ├── main.js         ← shared: fetch helper, navbar, toasts, animations
│   │   ├── home.js         ← typing effect in the hero heading
│   │   ├── projects.js     ← loads projects from the API
│   │   └── contact.js      ← sends the contact form
│   ├── images/             ← favicon + technology logos (images/icons)
│   ├── files/              ← downloadable CV
│   └── index.html  about.html  skills.html  projects.html  contact.html
├── config/mailer.js        ← Nodemailer (Gmail SMTP)
├── data/projects.js        ← the project list (edit this to change projects)
├── routes/
│   ├── projects.js         ← CRUD /api/projects
│   └── contact.js          ← POST /api/contact
├── utils/validate.js       ← input validation helpers
├── api/index.js            ← Vercel entry point
├── server.js               ← app entry point
├── package.json
└── .env.example            ← copy to .env
```

---

## 1. Installation

Requirements: **Node.js 18+**. No database needed.

```bash
cd Portfolio
npm install
```

## 2. Environment (.env)

Copy the template and fill in your values:

```bash
copy .env.example .env        # Windows (cmd)
cp .env.example .env          # Git Bash / macOS / Linux
```

| Variable | What to put |
|---|---|
| `PORT` | `3000` |
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_SECURE` | `smtp.gmail.com` / `465` / `true` |
| `SMTP_USER` | your Gmail address |
| `SMTP_PASS` | a 16-character Gmail **App Password** (see below) |
| `MAIL_FROM_NAME` | sender name shown in emails |
| `CONTACT_RECEIVER` | where contact-form notifications go |
| `ADMIN_KEY` | secret for creating / editing / deleting projects (empty = editing disabled) |

**Getting a Gmail App Password:** Google Account → **Security** → turn on **2-Step Verification** →
search **"App passwords"** → create one called "Portfolio" → paste the 16 characters (no spaces) into `SMTP_PASS`.
Your normal Gmail password will **not** work.

> SMTP must be filled in for the contact form to work — there is no database, so if the email
> can't be sent the visitor gets an error and is asked to try again.

## 3. Projects (no database)

Projects are stored in **`data/projects.js`**. To add one permanently, copy a block, give it the
next id and edit the text. The CRUD API below changes the list **in memory only** — changes are
lost when the server restarts (on Vercel, whenever the serverless instance is recycled).

## 4. Run the project

```bash
npm start          # normal start
npm run dev        # auto-restarts when you edit server files
```

Open **http://localhost:3000**. The terminal should show:

```
✔  SMTP ready — connected to smtp.gmail.com
🚀 Portfolio running at http://localhost:3000
```

---

## API endpoints

| Method | URL | Purpose |
|---|---|---|
| GET | `/api/projects` | list all projects (newest first) |
| GET | `/api/projects/:id` | one project |
| POST | `/api/projects` | create a project (needs `x-admin-key` header) |
| PUT | `/api/projects/:id` | update a project (needs `x-admin-key` header) |
| DELETE | `/api/projects/:id` | delete a project (needs `x-admin-key` header) |
| POST | `/api/contact` | validate + email notification |

Example (Git Bash):

```bash
curl -X POST http://localhost:3000/api/projects   -H "Content-Type: application/json" -H "x-admin-key: YOUR_ADMIN_KEY"   -d '{"title":"New App","category":"Web Application","description":"What it does, at least 10 chars","tech_stack":"HTML, CSS"}'
```

Body fields: `title`, `category`, `description` (one bullet per line), `tech_stack` (comma separated),
`project_url` (optional).

---

## 5. Lab demonstration guide (≈ 5 minutes)

Keep the browser and the terminal running `npm start` open.

| # | What to show | What to point at |
|---|---|---|
| 1 | Walk through Home → About → Skills → Projects → Contact. Show the typing effect and resize the window (or DevTools phone mode) to show it is responsive. | `public/css/style.css` — variables at the top, `@media` rules at the bottom |
| 2 | Projects page: the cards and category filters come from the API. Run a `PUT /api/projects/4` (see the curl example) to change the title → refresh the page → the title changes. Then `DELETE` it and refresh again. | `routes/projects.js` (CRUD) and `public/js/projects.js` (`fetch`) |
| 3 | Submit the Contact form → success message → notification email arrives in `CONTACT_RECEIVER` (press Reply to answer the visitor). | `routes/contact.js`, `config/mailer.js` |
| 4 | Submit the form with an empty name / bad email / short message → clear error messages. | Browser check in `public/js/contact.js`, server check in `routes/contact.js` + `utils/validate.js` |
| 5 | Explain security basics: server-side validation, admin key on write routes, HTML escaping before showing data (`escapeHTML`), secrets kept in `.env`. | `routes/projects.js`, `public/js/main.js` |

**Good questions to be ready for**

- *How does the frontend talk to the backend?* — `fetch()` calls the JSON API (`/api/projects`, `/api/contact`).
- *Where is the data stored?* — projects start from `data/projects.js` and are kept in server memory; there is no database.
- *Who can edit projects?* — only requests with the right `x-admin-key` header (`ADMIN_KEY` in `.env`).
- *What happens if Gmail is down?* — `sendContactNotification` catches the error and the visitor is asked to try again.

---

## Customising

- **Profile photo:** replace `public/images/profile.jpg` with a new square photo (keep the same name) —
  it is used in the Home hero card and the small navbar avatar on every page.
- **Project links:** fill the `project_url` field of a project in `data/projects.js` (e.g. a GitHub link) — a **View project** button appears on its card.
- **CV:** replace `public/files/Muhammad_Talha_CV.pdf` with an updated version (keep the same name).

## Troubleshooting

| Problem | Fix |
|---|---|
| `Editing is disabled` / `Wrong or missing admin key` | Set `ADMIN_KEY` in `.env` and send it as `x-admin-key` |
| Contact form says "Could not send your message" | SMTP is not configured or the login failed — check `SMTP_*` in `.env` |
| `SMTP login failed: Invalid login` | Use a Gmail **App Password**; 2-Step Verification must be on |
| `EADDRINUSE: port 3000` | Another app uses port 3000 — change `PORT` in `.env` |
