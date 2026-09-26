# Deploying VENTURE AI Backend to Render

This guide explains how to deploy the **VENTURE AI** backend to [Render](https://render.com) using either the **Automatic Blueprint** or **Manual Web Service** setup.

---

## 🚀 Option 1: Automatic Blueprint Deployment (Recommended)

1. Push this entire repository to your GitHub account.
2. Log in to [Render Dashboard](https://dashboard.render.com).
3. Click **New +** > **Blueprint**.
4. Connect your GitHub repository.
5. Render will automatically read [`render.yaml`](file:///e:/aibusiness/render.yaml) and configure the Python web service with all build and start commands.
6. Click **Apply** to deploy!

---

## 🛠️ Option 2: Manual Web Service Setup on Render

1. Log in to your [Render Dashboard](https://dashboard.render.com).
2. Click **New +** > **Web Service**.
3. Connect your GitHub repository.
4. Fill in the following deployment settings:

| Setting | Value |
| :--- | :--- |
| **Name** | `venture-ai-backend` |
| **Language / Runtime** | `Python 3` |
| **Region** | `Singapore (Southeast Asia)` or closest to your users |
| **Branch** | `main` (or your default branch) |
| **Root Directory** | `backend` |
| **Build Command** | `pip install --upgrade pip && pip install -r requirements.txt` |
| **Start Command** | `uvicorn app.main:app --host 0.0.0.0 --port $PORT` |
| **Instance Type** | `Free` or `Starter` |

---

## 🔑 Environment Variables Configuration

In your Render Web Service settings, go to the **Environment** tab and add these variables:

| Key | Recommended Value | Notes |
| :--- | :--- | :--- |
| `PYTHON_VERSION` | `3.11.9` | Ensures compatible Python runtime |
| `ENVIRONMENT` | `production` | Enables production mode |
| `PROJECT_NAME` | `VENTURE AI` | Platform brand title |
| `API_V1_STR` | `/api` | Base API route prefix |
| `JWT_SECRET` | *(Click "Generate" or enter a 32+ char random string)* | Used for JWT signing |
| `ALGORITHM` | `HS256` | JWT cryptographic algorithm |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | `1440` | Token validity (24 hours) |
| `GOOGLE_MAPS_API_KEY` | `AIzaSyDDpPni56kABZhzzfeskfEJ4Fhse_bZ3gE` | Location geocoding & maps |
| `CORS_ORIGINS` | `*` or `https://your-frontend.vercel.app` | Allows your frontend to talk to API |
| `DATABASE_URL` | *(Optional: PostgreSQL / Supabase / Neon / Render DB connection string)* | If using managed DB |

> [!TIP]
> The backend automatically converts legacy `postgres://` URLs to `postgresql://` for SQLAlchemy 2.0 compatibility.

---

## 🔗 Connecting Frontend to the Render Backend

Once Render gives you your live service URL (e.g., `https://venture-ai-backend.onrender.com`):

1. Go to your frontend hosting provider (e.g. **Vercel** or Render static site).
2. Set the environment variable:
   ```env
   VITE_API_URL=https://venture-ai-backend.onrender.com
   ```
3. Redeploy your frontend. Your complete full-stack **VENTURE AI** application is now live!
