# DS Designs — Complete Setup Guide
## Supabase (Database) + Vercel (Free Hosting)

This guide takes you from a folder on your computer to a live website with a
working admin panel — for free. Follow the steps in order.

---

## PART 1 — LOCAL PREVIEW (Before anything)

1. Open this folder in VS Code.
2. Install the **Live Server** extension (by Ritwick Dey — free).
3. Right-click `index.html` → **Open with Live Server**.
4. The site opens in your browser. The admin panel is at `admin.html`.
   - Until Supabase is connected, projects are loaded from the static
     `js/projects-data.js` file and the admin login will show an error —
     that's expected. Complete Part 2 first.

---

## PART 2 — SET UP SUPABASE (Database + Image Storage)

Supabase is a free cloud database. Your projects and images will live here.

### Step 1 — Create a Supabase account
1. Go to **https://supabase.com** and click **Start your project**.
2. Sign up with GitHub or email — both are free.

### Step 2 — Create a new project
1. On your Supabase dashboard, click **New Project**.
2. Choose any Organisation (or create one called "DS Designs").
3. Fill in:
   - **Name:** `ds-designs`
   - **Database Password:** choose something strong and save it somewhere safe
   - **Region:** pick the one closest to you (e.g. South Asia — Mumbai)
4. Click **Create new project**. Wait ~2 minutes for it to set up.

### Step 3 — Run the SQL schema
This creates your database table and storage bucket in one go.

1. In your Supabase project, click **SQL Editor** in the left sidebar.
2. Click **New query**.
3. Open `supabase-schema.sql` from this folder.
4. Copy the **entire contents** of that file.
5. Paste it into the Supabase SQL Editor.
6. Click **Run** (or press Ctrl/Cmd + Enter).
7. You should see "Success. No rows returned." at the bottom — that's correct.

### Step 4 — Get your API keys
1. In the left sidebar, click **Project Settings** (gear icon).
2. Click **API**.
3. You'll see two values you need:
   - **Project URL** — looks like `https://abcdefghijk.supabase.co`
   - **Project API Keys → anon / public** — a long string starting with `eyJhbGci…`

### Step 5 — Add keys to your website
1. Open `js/supabase-config.js` in VS Code.
2. Replace the two placeholder values:

```js
const SUPABASE_URL      = 'https://abcdefghijk.supabase.co'; // your URL
const SUPABASE_ANON_KEY = 'eyJhbGci...your-key-here...';     // your anon key
```

3. Save the file. The site will now read from Supabase automatically.

---

## PART 3 — CREATE YOUR ADMIN LOGIN

Your admin email and password are stored securely in Supabase Auth
(not in your code — never put passwords in code).

### Step 1 — Create an admin user in Supabase
1. In your Supabase project, click **Authentication** in the left sidebar.
2. Click **Users**, then **Invite user** (or **Add user** → **Create new user**).
3. Enter your email address and a strong password.
4. Click **Create user**.

### Step 2 — Test the login
1. Open `admin.html` in Live Server (or just click it in VS Code → Live Server).
2. Enter the email and password you just created.
3. Click **Sign In** — you should land on the dashboard.

---

## PART 4 — ADD YOUR REAL PROJECT PHOTOS

Now that Supabase is connected, add your actual project photos via the admin:

1. Open `admin.html` and sign in.
2. Click **Add New Project** in the sidebar.
3. Fill in the project details (title, category, year, location, brief).
4. Write the story paragraphs explaining the thinking behind the project.
5. In the **Images** section — drag and drop your photos or click to browse.
   - Photos upload directly to Supabase Storage (cloud) — no file paths to manage.
   - The first uploaded image becomes the cover automatically.
   - Click **"Set as cover"** on hover to change which photo is the cover.
6. Click **Save Project**.

The project immediately appears on the live website.

### What to do with the old placeholder projects
The static `js/projects-data.js` file still has the 6 sample projects. Once
you've added your real projects to Supabase, the site will show those instead.
The static file is only used as a fallback when Supabase is not configured —
so once your keys are in `supabase-config.js`, the placeholders are gone.

---

## PART 5 — DEPLOY TO VERCEL (Free Live Hosting)

Vercel hosts your site for free and gives you a URL like `ds-designs.vercel.app`.
Later you can connect your own domain (yourfirmname.in) cheaply (~₹700–900/year).

### Step 1 — Create a GitHub account (if you don't have one)
Go to **https://github.com** and sign up — free.

### Step 2 — Create a GitHub repository
1. On GitHub, click the **+** icon (top right) → **New repository**.
2. Name it `ds-designs-website` (or anything you like).
3. Set it to **Public** (required for Vercel free tier).
4. Click **Create repository**.

### Step 3 — Upload your files to GitHub

**Option A — Using GitHub's website (no command line needed):**
1. In your new empty repository, click **uploading an existing file**.
2. Drag the entire `ds-designs` folder contents into the browser window.
   ⚠️ Upload the files *inside* the folder, not the folder itself.
3. Wait for them to upload, then click **Commit changes**.

**Option B — Using VS Code's built-in Git:**
1. In VS Code, open the Source Control panel (left sidebar, branch icon).
2. Click **Initialize Repository**.
3. Stage all files → Commit with message "Initial commit".
4. Click **Publish Branch** → choose GitHub → name the repository.

### Step 4 — Connect Vercel
1. Go to **https://vercel.com** and click **Sign Up** → choose **Continue with GitHub**.
2. Once logged in, click **Add New Project**.
3. Find and select your `ds-designs-website` repository → click **Import**.
4. On the configuration screen:
   - Framework Preset: **Other** (leave it — this is a plain HTML site)
   - Root Directory: leave blank
   - Build Command: leave blank
   - Output Directory: leave blank
5. Click **Deploy**.
6. Vercel builds and deploys in ~30 seconds.
7. You'll get a URL like `https://ds-designs-website.vercel.app` — share it!

### Step 5 — Future updates
Whenever you change code locally:
- Option A: Re-upload changed files to GitHub via the website → Vercel auto-redeploys.
- Option B: In VS Code Source Control, commit → push → Vercel auto-deploys.
- **Projects and images** added via the admin panel update instantly (they live in
  Supabase, not in the code files), so no redeploy needed for content changes.

---

## PART 6 — CONNECT THE CONTACT FORM TO EMAIL (Optional)

The contact form currently shows a confirmation message on screen but doesn't
send an email. To actually receive enquiries, use Formspree (free):

1. Go to **https://formspree.io** → sign up free.
2. Create a new form, copy your form endpoint URL (looks like `https://formspree.io/f/xxxxxxxx`).
3. In `contact.html`, change the form tag to:
   ```html
   <form id="contact-form" action="https://formspree.io/f/xxxxxxxx" method="POST">
   ```
4. In `js/main.js`, find `initContactForm()` and change the submit handler to do a real fetch:
   ```js
   // Replace the fake confirmation with:
   const res = await fetch(form.action, { method:'POST', body: new FormData(form), headers:{'Accept':'application/json'} });
   if(res.ok){ status.textContent = '...'; status.className = 'form-status ok'; form.reset(); }
   ```
5. Deploy the updated file to GitHub → Vercel redeploys automatically.

---

## QUICK REFERENCE — File Map

| File | Purpose |
|------|---------|
| `js/supabase-config.js` | **Your keys go here** — fill this in after Step 2.4 |
| `js/db.js` | All Supabase operations — don't edit |
| `js/projects-data.js` | Static fallback data — used locally before Supabase is set up |
| `js/main.js` | Page behaviour — gallery, filters, detail page |
| `admin.html` | Admin panel — login, add/edit/delete projects, upload images |
| `js/admin.js` | Admin panel logic |
| `css/admin.css` | Admin panel styles |
| `supabase-schema.sql` | SQL to run once in Supabase — creates table + storage |

---

## TROUBLESHOOTING

**"Sign In" shows "Supabase not configured"**
→ You haven't filled in `js/supabase-config.js` yet. Do Part 2 first.

**Projects not showing on the live site**
→ Check that `SUPABASE_URL` and `SUPABASE_ANON_KEY` are correct in `supabase-config.js`.
→ Open browser DevTools (F12) → Console — look for red error messages.

**Image upload fails**
→ Go to Supabase → Storage → check that the `project-images` bucket exists and is set to Public.
→ If not, run the SQL schema again (Part 2, Step 3).

**Admin login says "Invalid credentials"**
→ Go to Supabase → Authentication → Users → check your user exists and the email/password matches.

**Site looks broken on Vercel but fine locally**
→ File/folder names are case-sensitive on Vercel (Linux). Make sure `images/` is lowercase,
  not `Images/`, and that all paths in your HTML/JS match exactly.

---

*Guide version: 1.0 — DS Designs website*
