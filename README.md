# CRM‑project (SASS)

A lightweight educational/demo CRM interface built with **HTML + SASS/SCSS**, deployed on **GitHub Pages**.

> Live page: `https://<your‑github‑username>.github.io/crm-project/`

---

## Stack

* **HTML5**
* **SASS/SCSS** (compiled via `npx sass`)
* (optional) **JavaScript** for UI logic
* **GitHub Pages** for hosting

> Minimum requirement: **Node.js 18+** (for `npx sass`).

---

## Structure

Key file: compiled CSS used in the final page.

```
CRM-project/
├─ dist/
│  └─ assets/
│     └─ index.css          ← compiled CSS (production)
├─ src/                     ← source files (example)
│  └─ scss/
│     └─ index.scss         ← main SCSS entry
├─ index.html               ← main HTML (or /dist/index.html if deploying dist)
└─ .github/workflows/       ← CI configs (optional)
```

> Adjust paths below if your structure differs.

---

## Quick Start

Clone the repo:

```bash
git clone https://github.com/<your-github-username>/crm-project.git
cd crm-project
```

You don’t need dependencies — compile directly via `npx`:

```bash
# one-time compilation
npx sass src/scss/index.scss dist/assets/index.css --no-source-map --style=compressed
```

---

## Development (watch mode)

To automatically recompile SASS when changes occur:

```bash
# Option 1: single input → single output
npx sass src/scss/index.scss dist/assets/index.css --watch

# Option 2: directory → directory
# (adjust paths to your project)
# npx sass src/scss:dist/assets --watch
```

---

## License

2025 MaxBorei
