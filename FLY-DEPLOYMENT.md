# 🚀 BloodLink - Fly.io Deployment Guide

Fly.io is a modern platform for deploying full-stack applications with excellent free tier support!

---

## ✨ Why Fly.io?

- ✅ Better than Heroku (faster, cheaper)
- ✅ Generous free tier
- ✅ Global deployment (30+ regions)
- ✅ Docker-native
- ✅ Auto-scaling
- ✅ 3GB free RAM
- ✅ 160GB bandwidth/month free

---

## 📋 Requirements

- Fly.io account (https://fly.io)
- Credit card (for free tier verification)
- Docker installed (Fly uses Docker)
- MongoDB Atlas account

---

## 🚀 Step 1: Install Fly CLI

### Mac (Homebrew)
```bash
brew install flyctl
```

### Linux
```bash
curl -L https://fly.io/install.sh | sh
```

### Windows (Chocolatey)
```bash
choco install flyctl
```

### Or use npm
```bash
npm install -g flyctl
```

---

## 🚀 Step 2: Login to Fly

```bash
flyctl auth login
# Opens browser to login
# Authorize and return to terminal
```

---

## 🚀 Step 3: Create MongoDB Atlas Database

1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create M0 free cluster
4. Create database user
5. Whitelist IP: 0.0.0.0/0 (testing) or your IP
6. Copy connection string: `mongodb+srv://user:pass@cluster.mongodb.net/bloodlink`

---

## 🚀 Step 4: Deploy Backend

### 4.1 Create Fly App

```bash
cd backend

# Create Fly app
flyctl launch

# When asked:
# App Name: bloodlink-api (or your choice)
# Region: Choose closest to you (e.g., iad for US East)
# Create Postgres? No
# Create Redis? No
```

This creates `fly.toml` config file.

### 4.2 Configure Environment Variables

```bash
flyctl secrets set \
  MONGODB_URI="your-mongodb-connection-string" \
  JWT_SECRET="your-super-secret-key-at-least-32-chars" \
  NODE_ENV=production \
  PORT=8080
```

**Note:** Fly uses port 8080 by default, not 5000

### 4.3 Deploy

```bash
# Deploy backend
flyctl deploy

# Monitor deployment
flyctl logs

# Get backend URL
flyctl open
```

Your backend is now live at: `https://bloodlink-api.fly.dev`

---

## 🚀 Step 5: Deploy Frontend

### 5.1 Create Fly App for Frontend

```bash
cd ../frontend

# Create Fly app
flyctl launch

# When asked:
# App Name: bloodlink-web (or your choice)
# Region: Same as backend if possible
# Create Postgres? No
# Create Redis? No
```

### 5.2 Configure Build & Start

Edit `fly.toml`:

```toml
[build]
builder = "paketobuildpacks"
buildpacks = ["heroku/nodejs"]

[env]
REACT_APP_API_URL = "https://bloodlink-api.fly.dev/api"

[[processes]]
type = "web"
command = "npm install -g serve && serve -s build -l 8080"
```

### 5.3 Build & Deploy

```bash
# Build frontend
npm run build

# Deploy
flyctl deploy

# View logs
flyctl logs

# Open in browser
flyctl open
```

Your frontend is now live at: `https://bloodlink-web.fly.dev`

---

## ✅ Verify Deployment

### Test Backend API

```bash
curl https://bloodlink-api.fly.dev/api/health

# Should return:
# {"success":true,"message":"BloodLink API is running"}
```

### Test Frontend

1. Visit `https://bloodlink-web.fly.dev`
2. Login: admin@bloodlink.com / admin123
3. Test features:
   - Dashboard
   - Donor search
   - Blood request
   - Admin panel

---

## 🔧 Useful Fly.io Commands

### Logs & Status

```bash
# View logs (real-time)
flyctl logs

# View specific number of logs
flyctl logs --lines 100

# Watch logs
flyctl logs -f
```

### Secrets & Config

```bash
# Set secrets (environment variables)
flyctl secrets set KEY=VALUE

# View secrets
flyctl secrets list

# Delete secret
flyctl secrets destroy KEY
```

### Deployment & Scaling

```bash
# Deploy latest code
flyctl deploy

# Restart app
flyctl restart

# Scale (change instance count)
flyctl scale count 2

# View status
flyctl status

# View apps
flyctl apps list
```

### Monitoring

```bash
# View metrics
flyctl metrics

# View CPU usage
flyctl metrics cpu

# View memory usage
flyctl metrics memory
```

---

## 🔄 Continuous Deployment (Recommended)

### Setup Auto-Deploy from GitHub

1. Go to https://fly.io/dashboard
2. Select your app
3. Go to "Settings" → "Integrations"
4. Connect GitHub
5. Select repository and branch
6. Deploy strategy: "Deploy on every push"

Now auto-deploy works:
```bash
git push origin main
# Fly automatically builds and deploys!
```

---

## 📊 Monitoring & Logs

### Via CLI

```bash
# Real-time logs
flyctl logs -f

# Check status
flyctl status

# View metrics
flyctl metrics

# Check app info
flyctl info
```

### Via Dashboard

1. Go to https://fly.io/dashboard
2. Select your app
3. View:
   - Deployments
   - Logs
   - Metrics
   - Settings

---

## 🆘 Common Issues & Solutions

### "Can't connect to MongoDB"

```
Check:
1. MONGODB_URI is set correctly
   flyctl secrets list

2. IP whitelist on MongoDB Atlas
   Add: 0.0.0.0/0 (or your Fly IP)

3. Connection string is valid
   Test locally first
```

### "Frontend can't reach API"

```
Check:
1. Backend is running
   flyctl logs (for backend app)

2. REACT_APP_API_URL is correct
   Should be: https://bloodlink-api.fly.dev/api

3. CORS is enabled in backend
   Check backend/server.js
```

### "Out of memory"

```
Solution: Scale up VM size
flyctl scale vm dedicated-cpu-1x

Options:
- shared-cpu-2x (512MB RAM)
- dedicated-cpu-1x (1GB RAM)
- dedicated-cpu-2x (2GB RAM)
```

### "Deployment hangs"

```
Solution:
1. Check logs: flyctl logs
2. Increase timeout: flyctl deploy --strategy canary
3. View build logs: flyctl logs -instance <instance-id>
```

---

## 💰 Pricing & Free Tier

### Free Tier Includes

- 3 shared-cpu-1x VMs (512MB each)
- 3GB persistent storage
- 160GB network bandwidth
- Unlimited deployments
- Auto-scaling within limits

### Pricing Beyond Free

- Shared CPU: $0.0000065/minute (≈$3/month)
- Dedicated CPU: $0.00015/minute (≈$65/month)
- RAM: $0.02GB/hour
- Storage: $0.15/GB/month

---

## 📈 Scaling

Fly.io handles scaling automatically:

### Vertical Scaling (More resources)

```bash
# Change VM size
flyctl scale vm shared-cpu-2x

# Options:
# shared-cpu-1x (512MB) - Free
# shared-cpu-2x (1GB)
# dedicated-cpu-1x (1GB)
# dedicated-cpu-2x (2GB)
# dedicated-cpu-4x (4GB)
```

### Horizontal Scaling (More instances)

```bash
# Run 2 instances
flyctl scale count 2

# Run 3 instances
flyctl scale count 3

# Fly balances traffic automatically
```

---

## 🌍 Global Deployment

Fly supports 30+ regions worldwide:

```bash
# List available regions
flyctl platform regions

# Deploy to specific region
flyctl regions set sjc,iad,lhr
# (San Jose, Washington DC, London)
```

---

## 🔐 Security

### HTTPS (Automatic)

- All Fly apps get automatic HTTPS
- Free SSL certificates
- Certificate auto-renewal

### Custom Domain

```bash
# Add custom domain
flyctl certs create yourdomain.com

# View certificates
flyctl certs list
```

---

## 🚀 Workflow Example

```bash
# 1. Local development
npm install
npm run dev

# 2. Test locally
# Visit http://localhost:3000

# 3. Commit and push
git add .
git commit -m "Add feature"
git push origin main

# 4. Fly auto-deploys
# Monitor with: flyctl logs -f

# 5. Verify live version
# Visit https://bloodlink-web.fly.dev
```

---

## 📚 Useful Resources

- **Fly Docs:** https://fly.io/docs
- **Reference:** https://fly.io/docs/reference
- **Guides:** https://fly.io/docs/guides
- **Community:** https://community.fly.io

---

## 🎯 Deployment Checklist

- [ ] Fly CLI installed and logged in
- [ ] MongoDB Atlas database created
- [ ] Connection string obtained
- [ ] `fly.toml` configured for backend
- [ ] Environment variables set for backend
- [ ] Backend deployed successfully
- [ ] Backend API tested (health check)
- [ ] `fly.toml` configured for frontend
- [ ] REACT_APP_API_URL set correctly
- [ ] Frontend deployed successfully
- [ ] Frontend loads without errors
- [ ] Can login with demo account
- [ ] All features working
- [ ] Auto-deploy from GitHub configured

---

## ✨ Success!

Your BloodLink application is now deployed on Fly.io and running globally!

### Your URLs

- **Frontend:** https://bloodlink-web.fly.dev
- **Backend API:** https://bloodlink-api.fly.dev/api
- **Admin:** https://bloodlink-web.fly.dev/admin

### What's Next

1. ✅ Test all features
2. ✅ Share URLs with users
3. ✅ Monitor logs and metrics
4. ✅ Add custom domain (optional)
5. ✅ Scale if needed
6. ✅ Plan enhancements

---

**Happy Flying! 🚀**

---

*Fly.io Deployment Guide for BloodLink*  
*Last Updated: January 2025*
