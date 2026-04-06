# Bareilly Premier Corporate League — Player Registration Website

Player registration website for BPCL Season 2026.

## Configuration

| Setting | Value | Status |
|---------|-------|--------|
| UPI ID | `9457962508@hdfc` | Done |
| QR Code | `qr-code.png` (HDFC) | Done |
| WhatsApp | +91 73107 33916 / +91 83848 88601 | Done |
| Email | help.bpcl2026@gmail.com | Done |
| Form Backend | Supabase | Done |
| Storage | Supabase Storage (`payment-screenshots`) | Done |

## Deployment

Live at: https://ashu1717.github.io/bpcl-website

## Refund Policy

Displayed in three places (Step 2 banner, dedicated section, success state):
- ₹1,500 registration fee
- ₹750 (50%) refundable if not selected
- Refund within 7 working days after team announcement

## Project Structure

```
BPCL/
├── index.html     ← Complete single-page site
├── style.css      ← All styles (mobile-first)
├── script.js      ← Form logic, validation, Supabase submission
├── qr-code.png    ← HDFC UPI QR code
└── README.md      ← This file
```

## Tech Stack

- HTML5 / CSS3 / Vanilla JavaScript
- Google Fonts (Playfair Display + DM Sans)
- Supabase (database + file storage)
- No npm, no frameworks, no build tools

---

**© 2026 Bareilly Premier Corporate League**
