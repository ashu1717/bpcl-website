# Bareilly Premier League — Player Registration Website

A fully static player registration website for BPL Season 2025. No build steps — just open `index.html` and go.

## Configuration

| Setting | Value | Status |
|---------|-------|--------|
| UPI ID | `9457962508@hdfc` | Done |
| QR Code | `qr-code.png` (HDFC) | Done |
| WhatsApp | +91 73107 33916 / +91 83848 88601 | Done |
| Email | help.bpcl2026@gmail.com | Done |
| Form Backend | Supabase (pending setup) | Pending |

## Pending Setup: Supabase

The form backend will use Supabase instead of Formspree. Provide the Supabase project URL and anon key to complete the integration.

## Deployment

### GitHub Pages (Free)

1. Create a GitHub repository
2. Push all files to the `main` branch
3. Go to **Settings → Pages → Source → Deploy from a branch**
4. Select `main` branch, `/ (root)` folder
5. Your site will be live at `https://yourusername.github.io/repo-name`

### Netlify (Free, Drag & Drop)

1. Go to [netlify.com](https://netlify.com) and sign up
2. Click **"Add new site" → "Deploy manually"**
3. Drag your project folder into the upload area
4. Done — Netlify gives you a live URL instantly

### Open Locally

Just double-click `index.html` in your browser. Everything works offline except form submission.

## Refund Policy

Displayed in three places (Step 2 banner, dedicated section, success state):
- ₹1,500 registration fee
- ₹750 (50%) refundable if not selected
- Refund within 7 working days after team announcement

To change amounts, search for `₹750` and `50%` in `index.html`.

## Project Structure

```
BPL/
├── index.html     ← Complete single-page site
├── style.css      ← All styles (mobile-first)
├── script.js      ← Form logic, validation, submission
├── qr-code.png    ← HDFC UPI QR code
├── docs/          ← Source assets
└── README.md      ← This file
```

## Tech Stack

- HTML5 / CSS3 / Vanilla JavaScript
- Google Fonts (Playfair Display + DM Sans)
- Supabase for form submissions & storage
- No npm, no frameworks, no build tools

---

**© 2025 Bareilly Premier League**
