# DS Designs — Website

## How to open this in VS Code
1. Unzip this folder and open it in VS Code (`File > Open Folder`).
2. Install the **"Live Server"** extension (free, by Ritwick Dey) in VS Code.
3. Right-click `index.html` → **"Open with Live Server"**. The site opens in your browser and auto-refreshes as you edit.
   - You can also just double-click `index.html` to open it directly in a browser, but Live Server is better for development.

## Folder structure
```
ds-designs/
├── index.html          → Home page
├── projects.html        → Full project gallery (with filters)
├── project-detail.html  → Single project page (loads data based on ?id=...)
├── about.html           → About / vision / team
├── contact.html          → Contact form
├── css/style.css         → All styling (colors, fonts, layout)
├── js/
│   ├── projects-data.js → ALL your project content lives here
│   └── main.js          → Page behaviour (filters, nav, form)
└── images/
    ├── site/             → Hero/about images
    └── projects/         → One folder per project
```

## Replacing the placeholder images with your real photos
Right now every image is a generated placeholder (`.svg` files with project names on them), just so the site isn't blank.

To swap in your real photos:
1. Go to `images/projects/<project-name>/`
2. Add your photos there (e.g. `01.jpg`, `02.jpg`, `03.jpg`) — any name works as long as you update the path.
3. Open `js/projects-data.js` and update the `cover` and `images` paths for that project to point to your new files, e.g.:
   ```js
   cover: "images/projects/lantern-house/01.jpg",
   images: [
     "images/projects/lantern-house/01.jpg",
     "images/projects/lantern-house/02.jpg",
   ],
   ```
4. Do the same for the hero image: replace `images/site/hero.svg` with your best project photo (keep the filename `hero.svg`, or rename it and update the `src` in `index.html`).

## Editing project content
Everything about your past projects — title, category, year, location, "the thinking behind it" story, specs — lives in **`js/projects-data.js`**. Add a new project by copying one of the existing objects in the `PROJECTS` array and changing the values. No HTML editing needed — the gallery and detail pages build themselves from this file automatically.

## What's next
- **Admin panel** — next step is wiring up a simple login-protected page so you can upload/remove project photos without touching code. That will replace this static `projects-data.js` file with a small database (we'll use **Supabase**, which is free).
- **Free hosting** — once you're happy with the content, we'll deploy this to **Vercel** or **Netlify** (both free) so it's live on the internet.
- **Custom domain** — optional, costs ~₹700–900/year when you're ready.

## Notes
- The contact form currently only shows a confirmation message on your screen — it doesn't yet send anywhere. We'll connect it to an email service (e.g. Formspree, free tier) once the main site is finalized.
- The site is fully responsive — test it by resizing your browser or using VS Code's Live Server on your phone (same Wi-Fi network).
