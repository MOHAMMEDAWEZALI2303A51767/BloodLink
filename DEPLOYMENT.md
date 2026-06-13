# 🚀 BloodLink - Complete Setup & Deployment Guide

## 📦 Table of Contents

1. [Local Development Setup](#local-development-setup)
2. [Docker Setup](#docker-setup)
3. [MongoDB Setup](#mongodb-setup)
4. [Frontend Deployment](#frontend-deployment)
5. [Backend Deployment](#backend-deployment)
6. [Environment Configuration](#environment-configuration)
7. [Post-Deployment Checklist](#post-deployment-checklist)
8. [Troubleshooting](#troubleshooting)

---

## 🏠 Local Development Setup

### System Requirements

```
Node.js:   14.x or higher
npm/yarn:  6.x or higher (npm comes with Node)
MongoDB:   4.4+ (local) OR MongoDB Atlas (cloud)
RAM:       2GB minimum
Storage:   500MB minimum
```

### Step 1: Verify Prerequisites

```bash
# Check Node.js
node --version  # Should be v14.0.0 or higher

# Check npm
npm --version   # Should be 6.0.0 or higher

# Check Git (optional)
git --version   # If you're cloning from repository
```

### Step 2: Clone/Extract Project

**Using Git:**
```bash
git clone <repository-url>
cd bloodlink
```

**Or manually:**
- Download ZIP
- Extract to desired location
- Open terminal in extracted folder

### Step 3: Backend Setup

```bash
# Navigate to backend
cd backend

# Install all dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env file with your settings
# Open with: nano .env (Linux/Mac) or notepad .env (Windows)
```

**Configure .env:**
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/bloodlink
JWT_SECRET=your_very_secret_key_at_least_32_chars_long
JWT_EXPIRE=7d
NODE_ENV=development
```

### Step 4: Seed Database

```bash
# Run seed script to populate demo data
node seed.js

# You should see:
# ✅ Connected to MongoDB
# 🧹 Cleared existing data
# 👥 Created users
# 🩸 Created donor profiles
# 📋 Created blood requests
```

### Step 5: Start Backend

```bash
# Option A: Development mode (with hot reload)
npm run dev

# Option B: Production mode
npm start

# Success output:
# 🚀 BloodLink server running on port 5000
# 📍 Environment: development
```

**Keep this terminal open!**

### Step 6: Frontend Setup (New Terminal)

```bash
# Navigate to frontend (from project root)
cd frontend

# Install dependencies
npm install

# Start development server
npm start

# Browser should automatically open at http://localhost:3000
```

### Step 7: Login & Test

Visit http://localhost:3000

**Login Credentials:**
- Email: `admin@bloodlink.com`
- Password: `admin123`

**Or user account:**
- Email: `user@bloodlink.com`
- Password: `user123`

---

## 🐳 Docker Setup

### Option A: Docker Desktop (Easiest)

#### Step 1: Install Docker

- **Mac:** https://docs.docker.com/desktop/install/mac-install/
- **Windows:** https://docs.docker.com/desktop/install/windows-install/
- **Linux:** https://docs.docker.com/engine/install/

#### Step 2: Verify Docker Installation

```bash
docker --version
docker run hello-world
```

#### Step 3: Run with Docker Compose

```bash
# From project root
docker-compose up

# This will:
# 1. Start MongoDB
# 2. Build and start Backend
# 3. Build and start Frontend

# Access at http://localhost:3000
```

#### Step 4: Stop Services

```bash
docker-compose down

# To also remove volumes:
docker-compose down -v
```

### Option B: Manual Docker Commands

```bash
# Build images
docker build -t bloodlink-backend ./backend
docker build -t bloodlink-frontend ./frontend

# Run MongoDB
docker run -d --name mongodb \
  -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=bloodlink \
  -e MONGO_INITDB_ROOT_PASSWORD=bloodlink123 \
  mongo:5.0

# Run Backend
docker run -d --name backend \
  -p 5000:5000 \
  -e MONGODB_URI="mongodb://bloodlink:bloodlink123@mongodb:27017/bloodlink?authSource=admin" \
  -e JWT_SECRET="your_secret_key" \
  --link mongodb \
  bloodlink-backend

# Run Frontend
docker run -d --name frontend \
  -p 3000:3000 \
  -e REACT_APP_API_URL="http://localhost:5000/api" \
  bloodlink-frontend
```

---

## 🗄️ MongoDB Setup

### Option 1: Local MongoDB

#### Mac (Using Homebrew)

```bash
# Install MongoDB
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB service
brew services start mongodb-community

# Verify connection
mongosh

# Exit MongoDB shell
exit

# Stop service
brew services stop mongodb-community
```

#### Windows

```bash
# Download from: https://www.mongodb.com/try/download/community
# Run installer and follow GUI steps

# Start MongoDB (if installed as service)
# Services will start automatically

# Verify connection
mongosh
```

#### Linux (Ubuntu/Debian)

```bash
# Import GPG key
wget -qO - https://www.mongodb.org/static/pgp/server-5.0.asc | sudo apt-key add -

# Add repository
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/5.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-5.0.list

# Install
sudo apt-get update
sudo apt-get install -y mongodb-org

# Start service
sudo systemctl start mongod

# Enable auto-start
sudo systemctl enable mongod

# Verify
mongosh
```

### Option 2: MongoDB Atlas (Cloud - Recommended)

#### Step 1: Create Free Account

1. Go to https://www.mongodb.com/cloud/atlas
2. Click "Sign Up"
3. Create account with email

#### Step 2: Create Cluster

1. Login to Atlas
2. Click "Create" cluster
3. Select "Free Tier" (M0)
4. Choose cloud provider & region
5. Create cluster (wait 5-10 minutes)

#### Step 3: Get Connection String

1. Click "Cluster" → "Connect"
2. Select "Drivers"
3. Copy connection string:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/bloodlink?retryWrites=true&w=majority
   ```

#### Step 4: Configure .env

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/bloodlink?retryWrites=true&w=majority
```

#### Step 5: Whitelist IP

1. In Atlas: "Network Access" → "Add IP Address"
2. Add your IP or 0.0.0.0/0 (for testing)
3. Click "Confirm"

#### Step 6: Create Database User

1. In Atlas: "Database Access" → "Add New Database User"
2. Create username and password
3. Add to connection string in .env

---

## 🌐 Frontend Deployment

### Deploy to Vercel (Easiest)

#### Step 1: Prepare Repository

```bash
# Initialize git (if not already done)
git init
git add .
git commit -m "Initial commit"
```

#### Step 2: Create Vercel Account

1. Go to https://vercel.com
2. Sign up with GitHub/GitLab/Bitbucket
3. Authorize Vercel

#### Step 3: Deploy Frontend

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy (from frontend folder)
cd frontend
vercel
```

#### Step 4: Configure Environment

In Vercel Dashboard:
1. Go to Project → Settings → Environment Variables
2. Add:
   ```
   REACT_APP_API_URL=https://your-backend-url/api
   ```

### Deploy to Netlify

#### Step 1: Create Netlify Account

1. Go to https://netlify.com
2. Sign up with GitHub/Email

#### Step 2: Deploy

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Build project
cd frontend
npm run build

# Deploy
netlify deploy --prod --dir=build
```

#### Step 3: Set Environment Variables

In Netlify Dashboard:
1. Site → Settings → Build & Deploy → Environment
2. Add REACT_APP_API_URL

### Manual Deployment to Hosting

```bash
# Build production bundle
cd frontend
npm run build

# Output in 'build' folder
# Upload 'build' contents to your hosting:
# - AWS S3 + CloudFront
# - Azure Static Web Apps
# - Google Cloud Storage
# - Traditional web hosting via FTP
```

---

## 🔧 Backend Deployment

### Deploy to Heroku

#### Step 1: Create Heroku Account

1. Go to https://www.heroku.com
2. Sign up with email

#### Step 2: Install Heroku CLI

```bash
# Mac
brew tap heroku/brew && brew install heroku

# Windows
# Download from https://devcenter.heroku.com/articles/heroku-cli

# Verify
heroku --version
```

#### Step 3: Create App

```bash
# Login
heroku login

# Navigate to backend
cd backend

# Create app
heroku create your-app-name

# Or if app already created
heroku git:remote -a your-app-name
```

#### Step 4: Add MongoDB Atlas

```bash
# Set environment variables
heroku config:set MONGODB_URI=your_atlas_connection_string
heroku config:set JWT_SECRET=your_secret_key
heroku config:set NODE_ENV=production
```

#### Step 5: Deploy

```bash
# Deploy to Heroku
git push heroku main

# View logs
heroku logs --tail

# To view live app
heroku open
```

### Deploy to Railway

#### Step 1: Create Account

1. Go to https://railway.app
2. Sign up with GitHub

#### Step 2: Create Project

1. New Project
2. Select "Deploy from GitHub"
3. Connect repository

#### Step 3: Add Services

1. Add MongoDB (Railway provides MongoDB)
2. Configure variables:
   ```
   PORT=5000
   MONGODB_URI=provided_by_railway
   JWT_SECRET=your_secret
   ```

#### Step 4: Deploy

Push to GitHub and Railway deploys automatically.

### Deploy to AWS EC2

#### Step 1: Launch EC2 Instance

```bash
# Use Ubuntu 20.04 LTS
# Configure security group:
# - Allow SSH (22)
# - Allow HTTP (80)
# - Allow HTTPS (443)
# - Allow Custom (5000) for backend
```

#### Step 2: Connect & Setup

```bash
# SSH into instance
ssh -i your-key.pem ubuntu@your-instance-ip

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2 (process manager)
sudo npm install -g pm2

# Install nginx (reverse proxy)
sudo apt install -y nginx
```

#### Step 3: Clone & Setup Project

```bash
# Clone repository
git clone <repo-url>
cd bloodlink/backend

# Install dependencies
npm install

# Create .env
cp .env.example .env
# Edit .env with production values

# Start with PM2
pm2 start server.js --name "bloodlink-api"
pm2 startup
pm2 save
```

#### Step 4: Configure Nginx

```bash
# Create nginx config
sudo nano /etc/nginx/sites-available/default
```

Add:
```nginx
upstream backend {
    server localhost:5000;
}

server {
    listen 80 default_server;
    server_name _;

    location / {
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Test config
sudo nginx -t

# Restart nginx
sudo systemctl restart nginx
```

---

## ⚙️ Environment Configuration

### Development (.env)

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/bloodlink
JWT_SECRET=dev_secret_key_change_in_production
JWT_EXPIRE=7d
NODE_ENV=development
```

### Production (.env.production)

```env
PORT=5000
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/bloodlink
JWT_SECRET=production_secret_key_very_long_and_random_32_chars_minimum
JWT_EXPIRE=7d
NODE_ENV=production
```

### Frontend (.env)

```env
REACT_APP_API_URL=http://localhost:5000/api
```

### Production Frontend (.env.production)

```env
REACT_APP_API_URL=https://api.youromain.com/api
```

---

## ✅ Post-Deployment Checklist

### Security
- [ ] Changed JWT_SECRET
- [ ] Updated MongoDB credentials
- [ ] Enabled HTTPS
- [ ] Configured CORS for production domain
- [ ] Set secure cookie flags
- [ ] Disabled debug logging
- [ ] Removed demo accounts (optional)

### Performance
- [ ] Enabled database indexing
- [ ] Configured caching headers
- [ ] Set up CDN for static assets
- [ ] Enabled compression (gzip)
- [ ] Optimized images
- [ ] Minified CSS/JS

### Monitoring
- [ ] Set up error tracking (Sentry)
- [ ] Configure logging service
- [ ] Monitor CPU/Memory usage
- [ ] Monitor database performance
- [ ] Set up uptime monitoring
- [ ] Configure alerts

### Testing
- [ ] Test login/registration
- [ ] Test CRUD operations
- [ ] Test admin functions
- [ ] Test responsiveness
- [ ] Test on different browsers
- [ ] Test on mobile devices

### Backup & Recovery
- [ ] Set up database backups
- [ ] Test backup restoration
- [ ] Document recovery procedures
- [ ] Implement automated backups
- [ ] Store backups securely

---

## 🐛 Troubleshooting

### MongoDB Connection Issues

**Error: `connect ECONNREFUSED 127.0.0.1:27017`**

```bash
# MongoDB not running
# Mac: 
brew services start mongodb-community

# Linux:
sudo systemctl start mongod

# Windows: Check Services app
```

**Error: `Authentication failed`**

- Check username/password in connection string
- Verify user exists in MongoDB
- Check IP whitelist (if Atlas)

### Port Already in Use

```bash
# Find process on port
lsof -i :5000  # Mac/Linux
netstat -ano | findstr :5000  # Windows

# Kill process
kill -9 <PID>  # Mac/Linux
taskkill /PID <PID> /F  # Windows
```

### JWT Token Issues

```bash
# Token expired
# → User needs to login again

# Invalid token
# → Clear localStorage and login again

# Wrong secret
# → Ensure JWT_SECRET matches between sessions
```

### Frontend Not Connecting to API

```bash
# Check if backend is running
curl http://localhost:5000/api/health

# Verify REACT_APP_API_URL
# Should match backend URL

# Check CORS in backend/server.js
```

### Deployment Issues

```bash
# Check server logs
heroku logs --tail  # Heroku
docker logs <container>  # Docker
pm2 logs  # PM2

# Verify environment variables
heroku config  # Heroku
env | grep REACT_APP  # Environment
```

---

## 📞 Support Resources

- **Backend README:** See `backend/README.md`
- **Frontend README:** See `frontend/README.md`
- **Features:** See `FEATURES.md`
- **Quick Start:** See `QUICK_START.md`

---

**Version:** 1.0.0  
**Last Updated:** January 2025  
**Status:** Complete & Ready for Deployment ✨
