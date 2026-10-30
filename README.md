# Shuvadeep Mondal | Developer Portfolio

A responsive, dependency-free portfolio website for a full-stack developer role, built with semantic HTML5, modern CSS and vanilla JavaScript.

**Live site:** https://YOUR-PROJECT.vercel.app

## Sections

- **Home**: introduction, role and calls to action
- **About**: background and highlights
- **Skills**: grouped by Languages, Frontend, Backend, Databases, AI and DevOps
- **Projects**: NexusLearn (featured), Smart Automated Pharmacy Vending System, Aetherion AI
- **Contact**: validated form with email, location and profile links

## Design and structure decisions

- **No framework, no build step.** This level evaluates frontend fundamentals, so everything is plain HTML, CSS and JS. The site loads fast and deploys as static files.
- **Three files with clear jobs:** `index.html` (semantic structure and content), `css/styles.css` (design tokens, layout, components, responsive rules), `js/main.js` (navigation, scroll effects, form validation).
- **Design tokens.** Colors, radius, fonts and header height live in CSS custom properties on `:root`, so the theme can be changed in one place.
- **Dark theme** with a mint and periwinkle accent, Inter for text and JetBrains Mono for small technical labels.
- **Layout.** CSS Grid for page-level layouts (hero, about, skills, projects, contact) and Flexbox for rows, chips and navigation.

## Responsiveness

Desktop-first with three breakpoints:

| Width | Behavior |
| --- | --- |
| above 1024px | 3-column skills grid, two-column hero, about and contact |
| 821px to 1024px | 2-column skills grid, tighter gaps |
| 820px and below (tablet and mobile) | hamburger navigation, single-column sections |
| 560px and below (small phones) | single-column skills, full-width buttons |

Headings use `clamp()` for fluid type, the container uses `min()` for fluid width, and the hero uses `100svh` so mobile browser toolbars do not cause jumps.

## Contact form validation

- Native constraint attributes (`required`, `minlength`, `maxlength`, `type="email"`) plus custom JavaScript rules with specific error messages.
- Validates on blur, re-validates live once a field is invalid, and focuses the first invalid field on submit.
- Errors are announced to screen readers (`role="alert"`, `aria-invalid`, `aria-describedby`), and the character counter updates live.
- A hidden honeypot field filters simple bots.
- **Sending:** by default the form opens the visitor's mail app with the message prefilled (works with no backend). To send real messages, set a form endpoint:
  1. Create a free form at [Formspree](https://formspree.io) or [Web3Forms](https://web3forms.com).
  2. Copy its URL into the `data-endpoint=""` attribute of `<form id="contact-form">` in `index.html`.

## Accessibility and quality

Skip link, visible focus styles, keyboard-operable menu (Escape closes it), `aria-expanded` on the toggle, `prefers-reduced-motion` support, alt-free decorative elements marked `aria-hidden`, and meta and Open Graph tags.

## Run locally

Open `index.html` in a browser, or serve the folder:

```bash
npx serve .
```

## Deploy

### Push to GitHub

```bash
cd portfolio
git init
git add .
git commit -m "Initial portfolio"
git branch -M main
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/portfolio.git
git push -u origin main
```

### Deploy on Vercel

1. Go to [vercel.com/new](https://vercel.com/new) and import the GitHub repository.
2. Framework preset: **Other**. Leave build command and output directory empty (it is a static site).
3. Click **Deploy**. Every push to `main` redeploys automatically.

Or with the CLI: `npx vercel --prod`.

## Before you publish: replace placeholders

Search the project for `YOUR_` and update:

- `YOUR_GITHUB_USERNAME` (GitHub links in `index.html`)
- `YOUR_LINKEDIN_HANDLE` (LinkedIn link)
- `https://nexuslearn-demo.vercel.app` (the NexusLearn live demo URL)
- `YOUR-PROJECT.vercel.app` in this README

## Project structure

```
portfolio/
├── index.html
├── css/styles.css
├── js/main.js
├── favicon.svg
├── vercel.json
├── .gitignore
└── README.md
```
