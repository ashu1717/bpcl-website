# BPCL 2 — Bareilly Corporate Premier League

Player registration website for BPCL 2 — Season 2026.

## Live Site

https://ashu1717.github.io/bpcl-website

## Configuration

| Setting | Value |
|---------|-------|
| UPI ID | `9457962508@hdfc` |
| QR Code | `qr-code.png` (HDFC) |
| WhatsApp | +91 73107 33916 / +91 83848 88601 |
| Email | help.bpcl2026@gmail.com |
| Form Backend | Supabase |
| Storage | Supabase Storage (`payment-screenshots`) |
| Confirmation Email | Supabase Edge Function + Brevo API |

## Refund Policy

- ₹2,000 registration fee
- ₹1,000 (50%) refundable if not selected
- Refund within 7 working days after team announcement

## Project Structure

```
BPL/
├── index.html                                      ← Single-page site
├── style.css                                       ← All styles (mobile-first)
├── script.js                                       ← Form logic, validation, Supabase submission
├── qr-code.png                                     ← HDFC UPI QR code
├── supabase/functions/send-registration-email/      ← Edge Function (Brevo email)
└── README.md
```

## Tech Stack

- HTML5 / CSS3 / Vanilla JavaScript
- Google Fonts (Playfair Display + DM Sans)
- Supabase (database + file storage + edge functions)
- Brevo (transactional email)

---

**© 2026 Bareilly Corporate Premier League**
