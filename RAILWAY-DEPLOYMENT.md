# 🚀 BloodLink - Railway Deployment Guide

Railway is the easiest way to deploy both frontend and backend together!

## ✨ Why Railway?

- ✅ Free tier with generous limits
- ✅ Automatic GitHub integration
- ✅ One-click MongoDB setup
- ✅ Environment variables built-in
- ✅ Automatic SSL/HTTPS
- ✅ Easy scaling

---

## 🚀 Step 1: Setup GitHub Repository

```bash
# Navigate to your project
cd bloodlink

# Initialize git (if not already done)
git init
git add .
git commit -m "Initial BloodLink commit"

# Create GitHub repository and push
# Go to https://github.com/new and create 'bloodlink' repo
git remote add origin https://github.com/YOUR_USERNAME/bloodlink.git
git branch -M main
git push -u origin main
```

---

## 🚀 Step 2: Create Railway Account

1. Go to https://railway.app
2. Sign up with GitHub
3. Authorize Railway to access your GitHub account

---

## 🚀 Step 3: Create Backend Service

### Option A: Automatic (Recommended)

1. Click "New Project"
2. Select "Deploy from GitHub"
3. Choose your `bloodlink` repository
4. Select the `backend` folder as root directory
5. Railway will auto-detect Node.js

### Option B: Manual Setup

1. In Railway Dashboard: New → GitHub Repo
2. Search and select `bloodlink`
3. Click "Deploy"

---

## 🚀 Step 4: Configure Backend Environment

Once deployed:

1. Go to your Railway project
2. Click "Backend" service
3. Go to Variables tab
4. Add environment variables:

```
MONGODB_URI = mongodb+srv://username:password@cluster.mongodb.net/bloodlink
JWT_SECRET = your_secret_key_here_at_least_32_chars
NODE_ENV = production
PORT = 5000
```

**Get MongoDB URI:**
- Go to https://www.mongodb.com/cloud/atlas
- Create free account
- Create cluster
- Get connection string
- Add to Railway variables

---

## 🚀 Step 5: Add MongoDB Service

1. In Railway Dashboard: New → Database → MongoDB
2. Select your backend service to link it
3. Connection string auto-added to `DATABASE_URL`
4. Replace `MONGODB_URI` with: `${{ DATABASE_URL }}`

---

## 🚀 Step 6: Deploy Frontend

### Using Vercel (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Navigate to frontend
cd frontend

# Deploy
vercel --prod

# Set environment variable in Vercel:
# REACT_APP_API_URL = https://your-railway-backend-url/api
```

### Or Using Railway Frontend Service

1. In Railway: New → GitHub Repo (same bloodlink repo)
2. Set root directory to `frontend`
3. Add build command: `npm run build`
4. Add start command: `npm install -g serve && serve -s build -l 3000`
5. Set environment variable:
   ```
   REACT_APP_API_URL = https://your-backend-service.railway.app/api
   ```

---

## ✅ Verify Deployment

### Test Backend

```bash
# Check API health
curl https://your-backend.railway.app/api/health

# Should return:
# {"success":true,"message":"BloodLink API is running","timestamp":"..."}
```

### Test Frontend

1. Visit your frontend URL
2. Login with: admin@bloodlink.com / admin123
3. Test features:
   - View dashboard
   - Search donors
   - Create blood request
   - Access admin panel

---

## 🔧 Useful Railway Commands

### Via CLI

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Deploy from current directory
railway up

# View logs
railway logs

# View variables
railway env

# Add variable
railway variables set KEY=VALUE
```

### Via Dashboard

1. Go to https://railway.app/dashboard
2. Select your project
3. Click service
4. View logs, variables, metrics
5. Configure settings

---

## 📊 Monitoring

Railway provides:
- Real-time logs
- CPU/Memory usage
- Network metrics
- Build history
- Deployment status

Access from: Project → Service → Monitoring tab

---

## 🔄 Auto-Deployment

When you push to GitHub:
1. Railway automatically detects changes
2. Rebuilds your service
3. Deploys new version
4. No manual intervention needed

```bash
# Just git push and Railway handles the rest!
git add .
git commit -m "Update feature"
git push origin main
```

---

## 🆘 Troubleshooting

### Service won't start

Check logs:
1. Railway Dashboard → Service → Logs
2. Look for error messages
3. Verify environment variables are set
4. Check MongoDB connection string

### Frontend can't connect to API

1. Verify `REACT_APP_API_URL` is set correctly
2. Check if backend service is running (green status)
3. Test API directly: `curl https://your-backend-url/api/health`
4. Check CORS in backend/server.js

### MongoDB connection failed

1. Verify connection string is correct
2. Check if database user exists
3. Verify IP whitelist (if using Atlas)
4. Test connection locally first

---

## 📈 Scaling

Railway makes scaling easy:

### Vertical Scaling (More resources)
1. Go to Service → Settings
2. Select plan (Free, Basic, Standard, Pro)
3. Upgrade for more CPU/RAM

### Horizontal Scaling
1. Multiple instances support
2. Load balancing included
3. No additional configuration needed

---

## 💰 Pricing

Railway offers:
- **Free Tier:** $5 credit/month (great for hobby projects)
- **Pay-as-you-go:** $0.30/vCPU hour, $0.15/GB hour
- **Included:** 500GB bandwidth/month free

See full pricing: https://railway.app/pricing

---

## ✨ Summary

### What You Get

✅ Frontend deployed and live  
✅ Backend API running  
✅ MongoDB database connected  
✅ Auto-deployment on git push  
✅ Free SSL/HTTPS  
✅ Monitoring and logs  
✅ Easy scaling  

### Your URLs

- **Frontend:** https://your-frontend.railway.app
- **Backend API:** https://your-backend.railway.app/api
- **Admin Dashboard:** https://your-frontend.railway.app/admin

---

## 🎉 You're Deployed!

Your BloodLink application is now live and accessible to the world!

Next steps:
1. Test all features
2. Share the URL with users
3. Monitor performance
4. Plan future enhancements
5. Add domain name (optional)

---

**For more help:** https://docs.railway.app
