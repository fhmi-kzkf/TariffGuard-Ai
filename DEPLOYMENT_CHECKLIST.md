# 🚀 TariffGuard AI - Deployment Checklist

## Quick Start Guide for Render.com + Vercel (FREE)

---

## ✅ Pre-Deployment Checklist

### 1. Accounts Setup
- [ ] GitHub account created and code pushed
- [ ] Render.com account created (https://render.com)
- [ ] Vercel account created (https://vercel.com)
- [ ] Google Gemini API key obtained (https://makersuite.google.com/app/apikey)

### 2. Code Preparation
- [ ] All code committed to GitHub
- [ ] `.env` files NOT committed (check .gitignore)
- [ ] `requirements.txt` includes `psycopg2-binary` and `asyncpg`
- [ ] `render.yaml` file exists in backend folder
- [ ] `.env.production` file exists in frontend folder

---

## 🔧 Backend Deployment (Render.com)

### Step 1: Create Web Service
- [ ] Go to https://dashboard.render.com
- [ ] Click "New +" → "Web Service"
- [ ] Connect GitHub repository
- [ ] Select `TariffGuard-Ai` repository

### Step 2: Configure Service
- [ ] Name: `tariffguard-backend`
- [ ] Region: Choose closest to users
- [ ] Branch: `main`
- [ ] Root Directory: `tariff_auditor_backend`
- [ ] Runtime: `Python 3`
- [ ] Build Command: `pip install -r requirements.txt`
- [ ] Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
- [ ] Instance Type: **Free**

### Step 3: Add Environment Variables
- [ ] `GEMINI_API_KEY` = your_actual_key
- [ ] `FRONTEND_URL` = `https://your-app.vercel.app` (update later)
- [ ] `SERPER_API_KEY` = (leave empty if not using)
- [ ] `WCO_API_KEY` = (leave empty if not using)
- [ ] `REDIS_URL` = (leave empty if not using)

### Step 4: Add PostgreSQL Database
- [ ] Click "Add Database" → "PostgreSQL"
- [ ] Select **Free** tier
- [ ] Click "Create Database"
- [ ] Wait for `DATABASE_URL` to be auto-generated

### Step 5: Deploy
- [ ] Click "Create Web Service"
- [ ] Wait 5-10 minutes for deployment
- [ ] Check logs for errors
- [ ] Copy your backend URL (e.g., `https://tariffguard-backend.onrender.com`)

### Step 6: Test Backend
- [ ] Open: `https://your-backend-url.onrender.com/health`
- [ ] Should return: `{"status": "healthy"}`
- [ ] Open: `https://your-backend-url.onrender.com/docs`
- [ ] Should show API documentation

---

## 🎨 Frontend Deployment (Vercel)

### Step 1: Update Environment Variables
- [ ] Edit `tariff_auditor_frontend/.env.production`
- [ ] Set `NEXT_PUBLIC_API_URL` to your Render backend URL
- [ ] Commit and push changes to GitHub

### Step 2: Import Project
- [ ] Go to https://vercel.com/dashboard
- [ ] Click "Add New..." → "Project"
- [ ] Import `TariffGuard-Ai` repository
- [ ] Click "Import"

### Step 3: Configure Project
- [ ] Framework: Next.js (auto-detected)
- [ ] Root Directory: Click "Edit" → Select `tariff_auditor_frontend`
- [ ] Build Command: `npm run build` (auto-detected)
- [ ] Output Directory: `.next` (auto-detected)
- [ ] Install Command: `npm install` (auto-detected)

### Step 4: Add Environment Variables
- [ ] Click "Environment Variables"
- [ ] Add `NEXT_PUBLIC_API_URL` = your Render backend URL
- [ ] Example: `https://tariffguard-backend.onrender.com`

### Step 5: Deploy
- [ ] Click "Deploy"
- [ ] Wait 2-5 minutes
- [ ] Copy your frontend URL (e.g., `https://tariffguard-ai.vercel.app`)

### Step 6: Update Backend CORS
- [ ] Go back to Render.com dashboard
- [ ] Open your backend service
- [ ] Go to "Environment" tab
- [ ] Update `FRONTEND_URL` to your Vercel URL
- [ ] Click "Save Changes"
- [ ] Wait for automatic redeploy

---

## 🧪 Testing Deployment

### Backend Tests
- [ ] Health check: `curl https://your-backend.onrender.com/health`
- [ ] API docs: Open `https://your-backend.onrender.com/docs` in browser
- [ ] Test endpoint: Try creating an audit via API docs

### Frontend Tests
- [ ] Open your Vercel URL in browser
- [ ] Navigate to "New Audit" page
- [ ] Fill in form with test data:
  - Product: "Test Product"
  - Description: "Test description"
  - Origin: "CN"
  - Destination: "US"
  - HS Code: "1234.56"
  - Value: "1000"
- [ ] Click "Start Audit"
- [ ] Wait for processing (may take 30-60 seconds on first request)
- [ ] Check if audit completes successfully
- [ ] View audit results
- [ ] Test PDF download
- [ ] Check dashboard
- [ ] Check history page

### Full Integration Test
- [ ] Create 2-3 audits with different products
- [ ] Verify all audits appear in dashboard
- [ ] Test filtering in history
- [ ] Test PDF download for each audit
- [ ] Verify data persists after backend restart

---

## ⚠️ Important Notes

### Cold Start Warning
- [ ] Understand: First request after 15 min idle takes 30-60 seconds
- [ ] Solution: Set up uptime monitor (optional)
- [ ] UptimeRobot: https://uptimerobot.com (free)
- [ ] Ping backend every 14 minutes to keep it warm

### Database Limitations
- [ ] PostgreSQL free for 90 days
- [ ] After 90 days: $7/month or migrate data
- [ ] Plan ahead for database costs

### API Rate Limits
- [ ] Gemini API free tier: 15 requests/minute
- [ ] Solution: Wait between audits or upgrade API tier
- [ ] Monitor usage at: https://ai.dev/rate-limit

---

## 🔄 Post-Deployment Tasks

### Optional Enhancements
- [ ] Set up custom domain on Vercel
- [ ] Set up custom domain on Render
- [ ] Configure uptime monitoring
- [ ] Set up error tracking (e.g., Sentry)
- [ ] Enable analytics (Vercel Analytics)
- [ ] Set up backup strategy for database

### Monitoring
- [ ] Bookmark Render dashboard for logs
- [ ] Bookmark Vercel dashboard for deployments
- [ ] Set up email notifications for downtime
- [ ] Monitor API usage and costs

### Documentation
- [ ] Update README with live URLs
- [ ] Document any custom configurations
- [ ] Share deployment guide with team
- [ ] Create runbook for common issues

---

## 🆘 Troubleshooting Quick Reference

### Backend Not Responding
1. Check Render logs for errors
2. Verify environment variables are set
3. Check if service is sleeping (cold start)
4. Verify DATABASE_URL is set
5. Check PostgreSQL database status

### Frontend Can't Connect to Backend
1. Verify NEXT_PUBLIC_API_URL is correct
2. Check CORS settings (FRONTEND_URL in backend)
3. Test backend health endpoint directly
4. Check browser console for errors
5. Verify both services are deployed

### Database Errors
1. Check if PostgreSQL database is created
2. Verify DATABASE_URL is auto-generated
3. Check database connection in Render logs
4. Ensure psycopg2-binary is in requirements.txt
5. Check if database is within free tier limits

### Build Failures
1. Check build logs in Render/Vercel
2. Verify all dependencies are in requirements.txt/package.json
3. Test build locally first
4. Check for TypeScript errors (frontend)
5. Verify Python version compatibility (backend)

---

## 📊 Success Criteria

Your deployment is successful when:
- ✅ Backend health endpoint returns 200 OK
- ✅ Frontend loads without errors
- ✅ Can create new audit from frontend
- ✅ Audit processes and shows results
- ✅ PDF download works
- ✅ Dashboard shows audit history
- ✅ Data persists after page refresh
- ✅ No CORS errors in browser console

---

## 🎉 Congratulations!

If all checkboxes are checked, your TariffGuard AI is now live!

**Your URLs:**
- Frontend: `https://your-app.vercel.app`
- Backend: `https://your-backend.onrender.com`
- API Docs: `https://your-backend.onrender.com/docs`

**Share your app:**
- Test with real users
- Gather feedback
- Monitor performance
- Plan for scaling

---

## 📞 Need Help?

- 📖 Full Guide: See `DEPLOYMENT_GUIDE.md`
- 🐛 Issues: https://github.com/fhmi-kzkf/TariffGuard-Ai/issues
- 💬 Render Support: https://community.render.com
- 💬 Vercel Support: https://vercel.com/support

---

**Last Updated**: May 2024