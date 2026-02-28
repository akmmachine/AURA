# Deploy AURA on Render

This app is a **static site** (Vite + React). Use Render’s **Static Site** type.

## Option A: Deploy from Dashboard (recommended)

1. **Push your code to GitHub**  
   Create a repo and push this project (if not already).

2. **Go to [Render Dashboard](https://dashboard.render.com)** → **New** → **Static Site**.

3. **Connect the repo**  
   Authorize GitHub and select the `aura-_-modern-minimalist-clothing` (or your repo name).

4. **Configure the static site**

   | Field | Value |
   |--------|--------|
   | **Name** | `aura` (or any name) |
   | **Branch** | `main` (or your default branch) |
   | **Build Command** | `npm install && npm run build` |
   | **Publish Directory** | `dist` |

5. **Deploy**  
   Click **Create Static Site**. Render will install deps, run `npm run build`, and serve the `dist` folder.

6. **URL**  
   You’ll get a URL like `https://aura-xxxx.onrender.com`. The app uses **HashRouter**, so all routes work (e.g. `https://aura-xxxx.onrender.com/#/shop`).

---

## Option B: Deploy with Blueprint (`render.yaml`)

1. Push the project to GitHub (including `render.yaml` in the repo root).

2. In Render: **New** → **Blueprint**.

3. Connect the same GitHub repo.

4. Render will read `render.yaml` and create a **Static Site** with:
   - **Build:** `npm install && npm run build`
   - **Publish directory:** `dist`

5. Click **Apply** and wait for the first deploy.

---

## Notes

- **No backend:** Data is in `localStorage`; each visitor’s cart/account is local to their browser.
- **Admin:** Use `#/admin/login` with `admin@aura.com` / `admin123` (see `constants.ts`).
- **Env vars:** No `.env` or API keys are required for the app to run. If you add optional ones (e.g. analytics), set them in Render: **Environment** tab for the static site.
- **Custom domain:** In the static site’s **Settings** → **Custom Domains**, add your domain and follow Render’s DNS instructions.
