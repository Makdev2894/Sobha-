# Sobha Hoskote Landing Page — Session Context

> Last updated: 2026-05-14  
> Use this file to resume work in a new conversation.

---

## Project Overview

- **Site**: `sobhaofficial.co.in`
- **Project**: Sobha One World Hoskote — pre-launch luxury township landing page
- **Marketed by**: Propterra Advisors
- **Stack**: Static HTML + CSS + JS (no npm, no bundler, no framework)
- **Repo path**: `/Users/mypc/Documents/sobha-hoskote-landing`

---

## Current Branch State

| Branch | Status |
|--------|--------|
| `main` | Last deployed; has GSC tag, GA4 tag, Google Ads tag |
| `dev`  | **Active work branch** — includes all fixes below; NOT yet merged to main |

**Pending action**: Merge `dev` → `main` and deploy to production.

---

## Completed Work (on `dev` branch)

### 1. Google Search Console Verification
- Added HTML tag method in `index.html` `<head>`:
  ```html
  <meta name="google-site-verification" content="google2a9aad1626ef5ad7">
  ```
- In GSC, switch verification method to **"HTML tag"** (not HTML file method).

### 2. GA4 Tag Installation (`G-QX01307QV4`)
- Placed as the **first element** inside `<head>`:
  ```html
  <!-- Google tag (gtag.js) -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-QX01307QV4"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-QX01307QV4');
  </script>
  ```

### 3. Google Ads Tag (`AW-18033548473`)
- Separate script block **after** GA4 block — no duplicate `dataLayer`/`gtag` declarations:
  ```html
  <!-- Google Ads tag -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=AW-18033548473"></script>
  <script>
    gtag('js', new Date());
    gtag('config', 'AW-18033548473');
  </script>
  ```

### 4. `generate_lead` Event Fix (`script.js`)
- `showSuccess()` function fires gtag events **before** `container.innerHTML` replacement (DOM mutation was blocking the event in some browsers):
  ```js
  function showSuccess(container) {
      if (typeof gtag === 'function') {
          gtag('event', 'generate_lead', { 'send_to': 'G-QX01307QV4' });
          gtag('event', 'conversion', { 'send_to': 'AW-18033548473/Z4jJCJTeo6EcELm5iJdD' });
      }
      container.innerHTML =
          '<div class="form-success">' +
          '  <div class="success-icon">&#10003;</div>' +
          '  <h4>Thank You!</h4>' +
          '  <p>Our property consultant will reach out to you shortly.</p>' +
          '</div>';
  }
  ```

### 5. Hero Form Success State — White Text Fix (`style.css`)
- `.form-success` base styles use `var(--navy)` and `var(--text-muted)` — fine on light backgrounds.
- Hero card has a dark semi-transparent background, so text was invisible.
- Added scoped override after `.form-success p` block (~line 1294):
  ```css
  /* Hero form card has a dark background — override success text to white */
  .hero-form-card .form-success h4 {
      color: #ffffff;
  }
  .hero-form-card .form-success p {
      color: rgba(255, 255, 255, 0.8);
  }
  ```

### 6. Brand Name Rename (`index.html`)
- Changed all instances of **"World City"** / **"WORLD CITY"** → **"One World"** / **"ONE WORLD"**
- Covers: navbar logo, footer heading, page title, meta tags, OG/Twitter tags, JSON-LD structured data, all body copy.

---

## Key Files

| File | Purpose |
|------|---------|
| `index.html` | Main HTML — all content, meta tags, structured data |
| `style.css` | All styles — ~1300+ lines |
| `script.js` | All JS — modal, forms, GA tracking, hamburger nav, scroll reveal |
| `Master Plan.png` | Downloadable master plan asset (triggered after masterplan form submit) |
| `Google map pin.png` | Location map image |
| `sitemap.xml` | XML sitemap for SEO |
| `favicon.png` | Site favicon |

---

## Lead Forms

| Form ID | Location | Success Container |
|---------|----------|-------------------|
| `#heroLeadForm` | Hero section card | `.hero-form-card` |
| `#ctaLeadForm` | CTA section | `.cta-form-container` |
| `#popupForm` | Modal popup | `.modal-card` |

- All forms POST to Google Apps Script: `SCRIPT_URL` in `script.js`
- All forms trigger `generate_lead` (GA4) + conversion (Google Ads) on success

---

## Tracking IDs

| Tag | ID |
|-----|----|
| GA4 | `G-QX01307QV4` |
| Google Ads | `AW-18033548473` |
| Conversion label | `Z4jJCJTeo6EcELm5iJdD` |
| GSC verification | `google2a9aad1626ef5ad7` |

---

## Next Steps

- [ ] Merge `dev` → `main`: `git checkout main && git merge dev`
- [ ] Push to remote / deploy to `sobhaofficial.co.in`
- [ ] In Google Search Console: switch verification method to **"HTML tag"** and click Verify
- [ ] Test a live lead submission and confirm `generate_lead` appears in GA4 Realtime
