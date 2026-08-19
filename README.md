# Mittal & Associates Static Website V2

This rebuild removes the blank policy modal issue and keeps the proper Bar Council of India compliant disclaimer gate.

## What changed in V2

- Removed the footer popup/modal completely.
- Kept the first-visit disclaimer gate.
- Added proper standalone legal pages:
  - `disclaimer.html`
  - `privacy-policy.html`
  - `terms-of-use.html`
  - `cookie-policy.html`
- Reduced hero heading size so it does not wrap awkwardly on desktop.
- Kept Google News RSS Legal Intelligence Hub through `api/news.js`.

## Add real assets

Add the founder image here:

```text
assets/founder.jpg
```

If you prefer using your uploaded logo image, save it as:

```text
assets/logo.png
```

Then change `assets/logo.svg` to `assets/logo.png` in `index.html`.

## Test locally

Static preview:

```bash
python -m http.server 3000
```

Open:

```text
http://localhost:3000
```

To test the Vercel API route:

```bash
vercel dev
```

## Deploy on Vercel

Import the folder into GitHub and deploy with Vercel using Framework Preset: Other.
