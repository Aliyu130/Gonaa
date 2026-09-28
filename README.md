# Gonaaaaaa.com — Full Website Deployment (Landing Page + App, linked)

ONE folder. ONE deployment. The landing page and the app are already
linked to each other — you don't have to wire anything manually.

## What's inside and how the linking works

gonaaaa-website/
├── index.html        → the LANDING PAGE (opens at gonaaaaaa.com)
├── app/
│   └── index.html    → the REAL APP (opens at gonaaaaaa.com/app)
└── api/
    └── chat.js       → the AI backend (runs at gonaaaaaa.com/api/chat)

The links between them:
1. Landing page → App:
   The "Open Gonaaaa Now →" button on the request form's success screen
   points to /app/ — same website, so it always works, on any domain,
   even before you connect gonaaaaaa.com.
2. App → AI backend:
   The app calls /api/chat — again same website, works automatically.
   Vercel runs api/chat.js as a serverless function; your secret key
   stays on the server.

Because all three live under one roof, there is nothing to "connect"
— deploy once and every link works.

---

## DEPLOY — Step by step (about 20 minutes total)

### Step 1 — AI key (5 min)
1. https://console.anthropic.com → create account
2. Settings → Billing → add $5–10 credit
3. API Keys → Create Key → copy the sk-ant-... value. Keep it secret.

### Step 2 — Put the folder on Vercel (free)
EASIEST (no coding tools needed):
1. https://vercel.com → sign up free
2. Add New → Project
3. If you use GitHub: upload this folder to a new repo, then Import it.
   If not: install Node.js, run `npm i -g vercel`, then inside this
   folder run `vercel` and press Enter through the questions.
4. IMPORTANT before/after first deploy:
   Project → Settings → Environment Variables → add
     ANTHROPIC_API_KEY = sk-ant-... (your key)
   Then redeploy (Deployments → ⋯ → Redeploy) so the key takes effect.
5. Vercel gives you a URL like gonaaaa.vercel.app — open it:
   • You should see the landing page
   • Fill the request form → success screen → "Open Gonaaaa Now" → the app
   • Ask the app a question → you get a REAL AI answer
   If that whole journey works on the vercel.app URL, you're done with
   the hard part.

### Step 3 — Connect your domain gonaaaaaa.com (10 min)
1. Vercel → your project → Settings → Domains → Add → gonaaaaaa.com
   (also add www.gonaaaaaa.com and app.gonaaaaaa.com if you want them)
2. Vercel shows the DNS records to create, typically:
     A     @      76.76.21.21
     CNAME www    cname.vercel-dns.com
     CNAME app    cname.vercel-dns.com   (optional)
3. Log in at your domain registrar (where you bought gonaaaaaa.com) →
   DNS settings for gonaaaaaa.com → add those records exactly.
4. Wait 5–30 min. Then:
     gonaaaaaa.com        → landing page
     gonaaaaaa.com/app    → the app
     app.gonaaaaaa.com    → (optional) also the app, if you added the CNAME
   HTTPS certificates are automatic and free.

### Step 4 — Final touches
- Replace the placeholder WhatsApp number (+234 800 GONAAAA) in
  index.html with your real business line (search for "GONAAAA" in the file)
- Test everything on a real phone over mobile data

---

## The user journey you've now built
Farmer/visitor → gonaaaaaa.com (learns, watches demo, tries demo)
→ fills "Request the app" form → success screen with 4-step guide
→ taps "Open Gonaaaa Now" → gonaaaaaa.com/app → real AI conversations.

## If something doesn't work
- App says "Connection problem": the API key env variable is missing
  or you didn't redeploy after adding it.
- Domain not loading: DNS can take up to an hour; check the records
  match exactly what Vercel showed.
- Photo answers failing: photos are sent as base64; very large images
  can exceed limits — test with normal phone photos first.
