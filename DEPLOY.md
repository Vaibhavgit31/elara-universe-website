# Deploying the Elara Universe website

The site is a fully static export: `npm run build` writes the whole website into the `out/`
folder (HTML, CSS, JavaScript, images). Any static host can serve that folder. Two easy
options are described here: **Netlify Drop** (drag and drop, no Git needed) and **Vercel**
(connected to the GitHub repository). Then: connecting `elarauniversepublications.com`,
checking HTTPS, and the launch checklist.

## 0. Build the site on your computer

1. Install Node.js 20 or newer (https://nodejs.org) and run `npm install` once in the project
   folder.
2. Contact form key: create a free Web3Forms account (https://web3forms.com), copy the
   **access key**, and put it in a file called `.env.local` in the project folder:

   ```
   NEXT_PUBLIC_WEB3FORMS_KEY=paste-the-key-here
   ```

   The key is baked into the build, so set it **before** building. Without it the contact page
   shows the email and WhatsApp buttons instead of the letter form (the site still works).
3. Run `npm run build`. When it finishes, the `out/` folder is the website. You can preview it
   with `npm start` (opens http://localhost:3000).

## 1. Option A — Netlify Drop (drag and drop)

1. Sign in at https://app.netlify.com and open https://app.netlify.com/drop.
2. Drag the `out` folder from your computer onto the page. In a few seconds you get a working
   address like `https://sparkly-name-123456.netlify.app`.
3. Rename it: *Site configuration → Site details → Change site name* (for example
   `elara-universe`).
4. To publish an update later: run `npm run build` again, open the site's **Deploys** page and
   drag the new `out` folder onto the box that says "Drag and drop your site output folder here".

Netlify reads `public/_redirects` (it is copied into `out/`), so future QR Corner redirects go
in that file (see `docs/qr-addresses.md`).

**Option A2 — Netlify connected to GitHub** (every `git push` publishes automatically):
*Add new site → Import an existing project → GitHub → choose the repository*. Settings:
build command `npm run build`, publish directory `out`. Add the environment variable
`NEXT_PUBLIC_WEB3FORMS_KEY` under *Site configuration → Environment variables*, then deploy.

## 2. Option B — Vercel

1. Sign in at https://vercel.com, *Add New → Project*, import the GitHub repository.
2. Framework preset: **Next.js** (detected automatically). No build settings need changing:
   `output: 'export'` in `next.config.ts` makes the build static.
3. Under *Settings → Environment Variables* add `NEXT_PUBLIC_WEB3FORMS_KEY`, then **Deploy**.
   You get `https://<project>.vercel.app`.
4. Every push to the production branch redeploys. Future QR Corner redirects go in
   `vercel.json` (examples in `vercel.redirects.example.json`).

## 3. Connect elarauniversepublications.com

You need access to the company that the domain was registered with (the registrar, where the
domain's DNS records are managed) — [PLACEHOLDER] which registrar that is.

### On Netlify

1. *Domain management → Add a domain → `elarauniversepublications.com` → Verify → Add domain*.
   Add `www.elarauniversepublications.com` too, and choose which of the two is the primary
   domain (the other one redirects to it).
2. Netlify then shows the exact DNS records to create. There are two ways:
   - **Netlify DNS (simplest):** at the registrar, replace the domain's nameservers with the
     four `…nsone.net` nameservers Netlify shows. Netlify then manages every record itself.
   - **Keep the registrar's DNS:** at the registrar add two records, copying the values from
     the Netlify panel (at the time of writing: an `A` record for `@` pointing to Netlify's
     load balancer `75.2.60.5`, and a `CNAME` record for `www` pointing to
     `<your-site-name>.netlify.app`).

### On Vercel

1. *Project → Settings → Domains → Add* `elarauniversepublications.com`, then add
   `www.elarauniversepublications.com` and pick which one redirects to the other.
2. Vercel shows the records to create at the registrar (at the time of writing: an `A` record
   for `@` pointing to `76.76.21.21`, and a `CNAME` record for `www` pointing to
   `cname.vercel-dns.com`). Nameserver delegation to Vercel is offered as an alternative.

### Step by step at the registrar

1. Log in to the registrar, open the domain, find **DNS management / DNS records**.
2. Delete any old `A` record for `@` (often a "parking page") and any old `CNAME` for `www`.
3. Add the records the host showed you, exactly as shown. Leave MX records (email) untouched.
4. Save. DNS changes usually take a few minutes, sometimes a few hours (up to 48 h in the
   worst case). https://dnschecker.org shows when the new records are visible worldwide.

## 4. Check that HTTPS works

Both Netlify and Vercel issue a free certificate (Let's Encrypt) automatically once the DNS
records resolve. On Netlify, if the padlock does not appear within an hour, open
*Domain management → HTTPS → Verify DNS configuration → Provision certificate*. Then:

1. Open https://elarauniversepublications.com in a browser: padlock, no warning, site loads.
2. Open http://elarauniversepublications.com (no `s`): it must redirect to the `https://`
   address (Netlify: *Domain management → HTTPS → Force HTTPS*; Vercel does this by default).
3. Open https://www.elarauniversepublications.com: it must redirect to the primary domain.
4. In a terminal: `curl -I https://elarauniversepublications.com/` should answer `HTTP/2 200`.

## 5. Launch checklist

- Open the 24 QR Corner addresses listed in `docs/qr-addresses.md`; each shows the QR Corner
  page with the series and class. The form without the trailing slash
  (`/resources/hindi/1`) must redirect to `/resources/hindi/1/` — both hosts do this
  (`trailingSlash` is set in `next.config.ts` and `vercel.json`).
- Send one test enquiry through the contact form and confirm it arrives in the inbox that
  the Web3Forms key is registered to.
- Open https://pagespeed.web.dev and test the home page on mobile.
- Submit `https://elarauniversepublications.com/sitemap.xml` in Google Search Console.

## 6. Updating the site later

Edit the content files (see `README.md`), run the checks (`npm test`), then either run
`npm run build` and drag the new `out` folder to Netlify, or `git push` if the host is
connected to GitHub.

## Troubleshooting

- **The contact page shows email and WhatsApp buttons instead of the form:** the key was not
  set when the site was built. Add `NEXT_PUBLIC_WEB3FORMS_KEY` and build again.
- **A page shows the old version after an update:** hard-refresh (Ctrl/Cmd + Shift + R); the
  hosts clear their caches on every deploy.
- **Domain shows the host's "not found" page:** the domain was not added to the site in the
  host's panel, or DNS has not propagated yet.
