# 🩸 BloodLink - Quick Start Guide

Get BloodLink running in minutes!

## ⚡ Ultra Quick Start (3 Steps)

### 1️⃣ Setup Backend

```bash
cd backend
npm install
cp .env.example .env
node seed.js
npm run dev
```

✅ Backend running at http://localhost:5000

### 2️⃣ Setup Frontend

Open **NEW TERMINAL**:

```bash
cd frontend
npm install
npm start
```

✅ Frontend running at http://localhost:3000

### 3️⃣ Login & Explore

Visit http://localhost:3000 and login:

| Role  | Email                  | Password |
|-------|------------------------|----------|
| Admin | admin@bloodlink.com    | admin123 |
| User  | user@bloodlink.com     | user123  |

---

## 🎯 Key Demo Flows

### As a Regular User

1. Login as `user@bloodlink.com`
2. Go to **"My Donor Profile"** → Create donor profile
3. Go to **"Find Donors"** → Search by blood group/city
4. Go to **"Emergency Request"** → Submit blood request
5. Go to **"My Requests"** → View your requests

### As an Admin

1. Login as `admin@bloodlink.com`
2. View **Admin Dashboard** → See statistics
3. Go to **Manage Donors** → View all donors
4. Go to **Manage Requests** → Update request status
5. Go to **Manage Users** → View all users

---

## 📋 Checklist

- [x] Backend running on port 5000
- [x] Frontend running on port 3000
- [x] MongoDB connected
- [x] Demo data seeded
- [x] Can login with demo credentials
- [x] Can create donor profile
- [x] Can submit blood request
- [x] Admin dashboard works

---

## 🔧 Environment Setup

### Prerequisites Needed

```bash
# Check Node.js version (need 14+)
node --version

# Check npm version
npm --version

# Check if MongoDB is running (if local)
# For MongoDB Atlas, skip this
```

### Setup Options

#### Option A: Local MongoDB
```bash
# Start MongoDB (Mac/Linux)
mongod

# Or Windows (if installed)
"C:\Program Files\MongoDB\Server\X.X\bin\mongod.exe"
```

#### Option B: MongoDB Atlas (Cloud - Recommended)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create cluster
4. Get connection string
5. Update in `.env`:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/bloodlink
```

---

## 📱 Features Overview

### User Features ✨
- ✅ Register & Login with JWT auth
- ✅ Create/Edit donor profile
- ✅ Search donors by blood group, city
- ✅ Submit emergency blood requests
- ✅ Track request status
- ✅ Manage profile

### Admin Features 🔑
- ✅ View system statistics
- ✅ Manage all donors
- ✅ Manage all blood requests
- ✅ Update request status
- ✅ Manage user accounts
- ✅ Delete invalid records

---

## 🎨 UI Features

- 🏥 Healthcare-themed design (Red & White)
- 📱 Fully responsive (mobile, tablet, desktop)
- 🎯 Clean, intuitive navigation
- ⚡ Fast loading with spinners
- 🔔 Toast notifications
- ✔️ Form validation

---

## 🐛 Common Issues & Fixes

### Issue: "Cannot find module 'mongoose'"
```bash
cd backend
npm install
```

### Issue: "Port 5000 already in use"
```bash
# Kill process on port 5000
# Mac/Linux:
lsof -i :5000
kill -9 <PID>

# Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### Issue: "MongoDB connection refused"
- Ensure MongoDB is running
- Check MONGODB_URI in .env
- For Atlas: verify IP whitelist

### Issue: "Cannot connect to localhost:3000"
- Check if frontend is running
- Clear browser cache (Ctrl+Shift+Del)
- Try incognito/private mode

---

## 🚀 Next Steps

### To Learn More:
- Read `backend/README.md` for API details
- Read `frontend/README.md` for UI components
- Review database schema in main README
- Check API endpoints documentation

### To Deploy:
- Backend: Deploy to Heroku/Railway
- Frontend: Deploy to Vercel/Netlify
- Database: Use MongoDB Atlas
- See deployment section in main README

### To Customize:
- Change colors in `frontend/src/index.css`
- Modify API endpoints in `frontend/src/utils/api.js`
- Add new routes in backend `routes/` folder
- Extend schemas in backend `models/` folder

---

## 📞 Emergency Contacts

If stuck:
1. Check detailed README files
2. Review error messages in terminal
3. Check browser DevTools console
4. Verify all prerequisites installed
5. Restart backend and frontend

---

## 🎉 Success!

You now have a complete blood donation management system running locally!

### What You Can Do:
- Register new users
- Create donor profiles
- Search for available donors
- Submit emergency requests
- Manage everything as admin
- Test on mobile/tablet

**Happy coding! 🩸**

---

**Need Help?**
- Check main README.md
- Read backend/README.md
- Read frontend/README.md
- Check error messages carefully
