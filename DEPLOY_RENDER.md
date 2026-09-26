# Deploying VENTURE AI Backend to Render (with MongoDB Atlas)

This guide provides the exact settings and commands to deploy the **VENTURE AI** backend to [Render](https://render.com) connected with **MongoDB Atlas**.

---

## 🚀 Option 1: Automatic Blueprint Deployment (Recommended)

1. Push your latest code to GitHub:
   ```bash
   git add .
   git commit -m "feat: integrate MongoDB Atlas for user credentials and business plans"
   git push origin main
   ```
2. Log in to [Render Dashboard](https://dashboard.render.com).
3. Click **New +** ➔ **Blueprint**.
4. Select your repository (`AI-business-planning-and-execution-`).
5. Render will automatically read [`render.yaml`](./render.yaml) and configure all settings, Python runtime, and MongoDB Atlas credentials.
6. Click **Apply** to deploy!

---

## 🛠️ Option 2: Manual Web Service Setup on Render

1. In [Render Dashboard](https://dashboard.render.com), click **New +** ➔ **Web Service**.
2. Connect your GitHub repository: `https://github.com/jagadeesh7780/AI-business-planning-and-execution-.git`.
3. Configure the following fields:

| Field | Value |
| :--- | :--- |
| **Name** | `venture-ai-backend` |
| **Language / Runtime** | `Python 3` |
| **Region** | `Singapore` or closest to your users |
| **Branch** | `main` |
| **Root Directory** | `backend` |
| **Build Command** | `pip install --upgrade pip && pip install -r requirements.txt` |
| **Start Command** | `uvicorn app.main:app --host 0.0.0.0 --port $PORT` |
| **Instance Type** | `Free` or `Starter` |

---

## 🔑 Environment Variables to Set in Render

In your Render service's **Environment** tab, add these keys:

```env
PYTHON_VERSION=3.11.9
ENVIRONMENT=production
PROJECT_NAME=VENTURE AI
API_V1_STR=/api
JWT_SECRET=85ZAFXvfOm7b5CeB_venture_jwt_secret_key_2026
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
MONGODB_URI=mongodb+srv://kodurujagadeeshbabu77_db_user:85ZAFXvfOm7b5CeB@cluster0.wwuikwr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
MONGODB_DB_NAME=venture_ai_db
GOOGLE_MAPS_API_KEY=AIzaSyDDpPni56kABZhzzfeskfEJ4Fhse_bZ3gE
CORS_ORIGINS=*
```

---

## 💾 How User Data & Business Plans Are Stored in MongoDB Atlas

- **User Accounts (`users` collection)**:
  - Stores user full name, email, and Argon2-hashed passwords.
  - Generates secure JWT access tokens for authorization.
- **Business Plans (`businesses` collection)**:
  - Stores each user's business name, category, budget, geographic coordinates, equipment manifest, and multi-agent feasibility analysis under `user_email`.
  - **When a user logs back in with the same credentials**, all their previous business planning simulations and models are retrieved!

---

## 🔗 Connecting Your Frontend to Render Backend

Once Render finishes building and gives you your live service URL (e.g., `https://venture-ai-backend.onrender.com`):

1. Go to your frontend hosting provider (e.g. **Vercel** or Render).
2. Set the environment variable:
   ```env
   VITE_API_URL=https://venture-ai-backend.onrender.com
   ```
3. Your full-stack **VENTURE AI** application is now permanently connected to MongoDB Atlas!
