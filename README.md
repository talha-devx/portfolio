# Muhammad Talha — Developer Portfolio

A clean, dark personal portfolio. The pages are plain HTML/CSS/JS; a small
Node.js + Express backend loads the **projects from MySQL** and handles the
**contact form** (saved in MySQL + emailed with Nodemailer / Gmail SMTP).

**Stack:** HTML5 · CSS3 · Vanilla JavaScript · Node.js · Express · MySQL · Nodemailer

---

## Folder structure

```
Portfolio/
├── public/                 ← everything the browser sees
│   ├── css/style.css       ← the whole design (one file)
│   ├── js/
│   │   ├── main.js         ← shared: fetch helper, navbar, toasts, animations
│   │   ├── home.js         ← typing effect in the hero heading
│   │   ├── projects.js     ← loads projects from MySQL
│   │   └── contact.js      ← sends the contact form
│   ├── images/             ← favicon + technology logos (images/icons)
│   ├── files/              ← downloadable CV
│   └── index.html  about.html  skills.html  projects.html  contact.html
├── config/
│   ├── db.js               ← MySQL connection pool
│   └── mailer.js           ← Nodemailer (Gmail SMTP)
├── routes/
│   ├── projects.js         ← GET /api/projects
│   └── contact.js          ← POST /api/contact
├── utils/validate.js       ← input validation helpers
├── database/
│   ├── schema.sql          ← creates DB + 2 tables + CV projects
│   └── setup.js            ← runs schema.sql (npm run db:setup)
├── server.js               ← app entry point
├── package.json
└── .env.example            ← copy to .env
```

---

## 1. Installation

Requirements: **Node.js 18+** and **MySQL 8**.

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
| `DB_HOST` / `DB_PORT` | `localhost` / `3306` |
| `DB_USER` / `DB_PASSWORD` | your MySQL login (usually `root` + your password) |
| `DB_NAME` | `portfolio_db` |
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_SECURE` | `smtp.gmail.com` / `465` / `true` |
| `SMTP_USER` | your Gmail address |
| `SMTP_PASS` | a 16-character Gmail **App Password** (see below) |
| `MAIL_FROM_NAME` | sender name shown in emails |
| `CONTACT_RECEIVER` | where contact-form notifications go |

**Getting a Gmail App Password:** Google Account → **Security** → turn on **2-Step Verification** →
search **"App passwords"** → create one called "Portfolio" → paste the 16 characters (no spaces) into `SMTP_PASS`.
Your normal Gmail password will **not** work.

> If SMTP is not filled in, the site still works — the message is saved in MySQL, the email is skipped
> and a warning is printed in the terminal.

## 3. MySQL database setup

**Option A — one command (recommended):**

```bash
npm run db:setup
```

**Option B — MySQL Workbench:** *File → Open SQL Script* → choose `database/schema.sql` → click ⚡ Execute.

**Option C — command line (PowerShell):**

```powershell
Get-Content database\schema.sql | & "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -p
```

This creates `portfolio_db` with 2 tables — `projects` and `contact_messages` — and inserts the
4 projects from the CV. It is safe to run again (nothing is deleted or duplicated).

**Adding a project:** copy one of the `INSERT` rows in `schema.sql`, give it the next id and run it in
Workbench — it appears on the Projects page immediately.

## 4. Run the project

```bash
npm start          # normal start
npm run dev        # auto-restarts when you edit server files
```

Open **http://localhost:3000**. The terminal should show:

```
✔  Connected to MySQL database "portfolio_db"
✔  SMTP ready — connected to smtp.gmail.com
🚀 Portfolio running at http://localhost:3000
```

---

## API endpoints

| Method | URL | Purpose |
|---|---|---|
| GET | `/api/projects` | list all projects (newest first) |
| GET | `/api/projects/:id` | one project |
| POST | `/api/contact` | validate + save message in MySQL + email notification |

---

## 5. Lab demonstration guide (≈ 5 minutes)

Keep the browser, the terminal running `npm start`, and **MySQL Workbench** open.

| # | What to show | What to point at |
|---|---|---|
| 1 | Walk through Home → About → Skills → Projects → Contact. Show the typing effect and resize the window (or DevTools phone mode) to show it is responsive. | `public/css/style.css` — variables at the top, `@media` rules at the bottom |
| 2 | Projects page: the cards and category filters come from MySQL. In Workbench run `UPDATE projects SET title = 'SmartSort AI (updated)' WHERE id = 4;` → refresh the page → the title changes. | `routes/projects.js` (`SELECT` with `db.execute`) and `public/js/projects.js` (`fetch`) |
| 3 | Submit the Contact form → success message → notification email arrives in `CONTACT_RECEIVER` (press Reply to answer the visitor). | `routes/contact.js`, `config/mailer.js`; Workbench: `SELECT * FROM contact_messages;` |
| 4 | Submit the form with an empty name / bad email / short message → clear error messages. | Browser check in `public/js/contact.js`, server check in `routes/contact.js` + `utils/validate.js` |
| 5 | Explain security basics: prepared statements (`?` placeholders), HTML escaping before showing data (`escapeHTML`), secrets kept in `.env`. | `config/db.js`, `public/js/main.js` |

**Good questions to be ready for**

- *How does the frontend talk to the backend?* — `fetch()` calls the JSON API (`/api/projects`, `/api/contact`).
- *What stops SQL injection?* — every query uses `?` placeholders with `db.execute()`, so input is never glued into SQL.
- *What happens if Gmail is down?* — the message is still saved in MySQL; `sendContactNotification` catches the error.

---

## Customising

- **Profile photo:** replace `public/images/profile.jpg` with a new square photo (keep the same name) —
  it is used in the Home hero card and the small navbar avatar on every page.
- **Project links:** fill the `project_url` column of a project (e.g. a GitHub link) — a **View project** button appears on its card.
- **CV:** replace `public/files/Muhammad_Talha_CV.pdf` with an updated version (keep the same name).

## Troubleshooting

| Problem | Fix |
|---|---|
| `Could not connect to MySQL: Access denied` | Wrong `DB_USER` / `DB_PASSWORD` in `.env` |
| `Unknown database 'portfolio_db'` | Run `npm run db:setup` |
| `SMTP login failed: Invalid login` | Use a Gmail **App Password**; 2-Step Verification must be on |
| `EADDRINUSE: port 3000` | Another app uses port 3000 — change `PORT` in `.env` |
