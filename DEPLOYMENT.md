# GoTrippy Deployment Guide

GoTrippy is a MERN project with two deployable parts:

- Frontend: React/Vite static site
- Backend: Node.js/Express API with MongoDB

GitHub Pages can host only the frontend. The Express backend must be deployed separately to Render, Railway, Vercel serverless, or another Node.js host.

## Push Project to GitHub

From the project root:

```bash
git init
git add .
git commit -m "Initial GoTrippy full-stack project"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/gotrippy.git
git push -u origin main
```

Do not commit `.env` files. The repository includes `.env.example` files only.

## Frontend: GitHub Pages

The frontend is inside `client/`.

Install frontend dependencies:

```bash
cd client
npm install
```

Set frontend production environment values in `client/.env`:

```env
VITE_API_BASE_URL=https://gotrippy.onrender.com/api
VITE_SOCKET_URL=https://gotrippy.onrender.com
VITE_BASE_PATH=/GoTrippy/
VITE_BUSINESS_PHONE=8885863662
VITE_WHATSAPP_NUMBER=918885863662
```

If your GitHub repository name is different, update `VITE_BASE_PATH`:

```env
VITE_BASE_PATH=/REPOSITORY_NAME/
```

Build:

```bash
npm run build
```

Deploy to GitHub Pages:

```bash
npm run deploy
```

The frontend package includes:

```json
{
  "predeploy": "npm run build",
  "deploy": "gh-pages -d dist"
}
```

In GitHub:

1. Open the repository settings.
2. Go to **Pages**.
3. Select the `gh-pages` branch.
4. Save.
5. Open the generated GitHub Pages URL.

## Routing on GitHub Pages

React Router routes are handled by:

- `BrowserRouter basename={import.meta.env.BASE_URL}`
- Vite `base`
- `client/public/404.html`

This helps direct refreshes on routes like `/driver/login` or `/book-now` work after deployment.

## Backend Deployment

GitHub Pages does not run Express. Deploy the backend separately.

Recommended options:

- Render
- Railway
- Vercel serverless adaptation
- Any Node.js hosting provider

For Render:

```text
Root Directory: server
Build Command: npm install
Start Command: npm start
```

Backend environment variables:

```env
MONGO_URI=mongodb+srv://<db-user>:<db-password>@<cluster-host>/gotrippy
JWT_SECRET=use_a_long_random_secret
JWT_EXPIRES_IN=7d
PORT=5000
CLIENT_URL=https://YOUR_USERNAME.github.io/gotrippy

ADMIN_NAME=Mahesh Chilukamari
ADMIN_EMAIL=admin@gotrippy.in
ADMIN_PASSWORD=ChangeMe123!
```

After backend deployment, update frontend:

```env
VITE_API_BASE_URL=https://gotrippy.onrender.com/api
VITE_SOCKET_URL=https://gotrippy.onrender.com
```

Then redeploy the frontend:

```bash
cd client
npm run deploy
```

## MongoDB Atlas

1. Create a MongoDB Atlas free cluster.
2. Create a database user.
3. Allow network access for your backend host.
4. Copy the connection string.
5. Add it as `MONGO_URI` in the backend host environment variables.

## Production Build Test

From `client/`:

```bash
npm run build
npm run preview
```

With a GitHub Pages base path:

```bash
$env:VITE_BASE_PATH="/GoTrippy/"
npm run build
Remove-Item Env:\VITE_BASE_PATH
```

On macOS/Linux:

```bash
VITE_BASE_PATH=/GoTrippy/ npm run build
```

## Important Notes

- GitHub Pages hosts static files only.
- Do not expect `/api` routes to work on GitHub Pages.
- Set `VITE_API_BASE_URL` to the deployed backend API.
- Do not commit `.env`, MongoDB URI, JWT secrets, or private keys.
- If the deployed page is blank, check `VITE_BASE_PATH` and browser console asset paths.
