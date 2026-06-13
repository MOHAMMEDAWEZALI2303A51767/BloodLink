# 🩸 BloodLink - Blood Donor Management & Emergency Request System

A complete full-stack web application that connects blood donors with people in need of blood. Submit emergency requests, search for available donors, and manage blood donation records—all in one platform.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Installation & Setup](#installation--setup)
- [Project Structure](#project-structure)
- [Database Schema](#database-schema)
- [API Documentation](#api-documentation)
- [Usage Guide](#usage-guide)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)

## 🎯 Overview

**BloodLink** is a healthcare platform designed to:
- ✅ Reduce blood shortage in hospitals
- ✅ Enable faster donor-to-patient connections
- ✅ Track donor availability and blood groups
- ✅ Manage emergency blood requests
- ✅ Provide admin dashboard for oversight

## ✨ Features

### Authentication & User Management
- ✅ User registration with email validation
- ✅ Secure JWT-based login
- ✅ Password hashing with bcryptjs
- ✅ Role-based access (User/Admin)
- ✅ Automatic logout on token expiry

### Donor Management
- ✅ Create detailed donor profiles
- ✅ Update availability status
- ✅ Track last donation date
- ✅ Filter by blood group and location
- ✅ Search donors by city or blood type

### Blood Request System
- ✅ Submit emergency blood requests
- ✅ Set urgency levels (Low/Medium/High)
- ✅ Track request status (Pending/Fulfilled/Closed)
- ✅ Manage multiple units required
- ✅ Add additional patient notes

### Admin Dashboard
- ✅ System-wide statistics
- ✅ Blood group distribution analytics
- ✅ Manage all users and donors
- ✅ Update request statuses
- ✅ View recent activity
- ✅ Delete invalid records

### User Interface
- ✅ Responsive design (desktop, tablet, mobile)
- ✅ Modern healthcare theme (red & white)
- ✅ Intuitive navigation sidebar
- ✅ Loading indicators
- ✅ Toast notifications
- ✅ Form validation
- ✅ Empty states

## 🛠️ Tech Stack

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB
- **Authentication:** JWT (JSON Web Tokens)
- **Password Hashing:** bcryptjs
- **Validation:** express-validator
- **CORS:** Enable cross-origin requests

### Frontend
- **Library:** React.js (v18)
- **Routing:** React Router v6
- **HTTP Client:** Axios
- **Notifications:** React Hot Toast
- **Styling:** Custom CSS with variables
- **Fonts:** Playfair Display + DM Sans

### Deployment
- MongoDB Atlas (Cloud Database)
- Heroku/Vercel (Backend & Frontend)
- Docker Support

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     FRONTEND (React)                        │
│  Login  Dashboard  Donors  Requests  Admin  Profiles        │
└────────────────────────┬────────────────────────────────────┘
                         │
                    Axios HTTP
                    JWT Token
                         │
┌────────────────────────▼────────────────────────────────────┐
│                   EXPRESS API (Node.js)                     │
│                                                              │
│  Routes:                                                     │
│  ├── /api/auth     (Login, Register)                       │
│  ├── /api/donors   (CRUD Donor Profiles)                   │
│  ├── /api/requests (CRUD Blood Requests)                   │
│  └── /api/admin    (Statistics, Management)                │
└────────────────────────┬────────────────────────────────────┘
                         │
                    Mongoose ODM
                         │
┌────────────────────────▼────────────────────────────────────┐
│              MONGODB (Database)                             │
│                                                              │
│  Collections:                                                │
│  ├── users                                                   │
│  ├── donors                                                  │
│  └── bloodrequests                                           │
└─────────────────────────────────────────────────────────────┘
```

## 📦 Installation & Setup

### Prerequisites

Before starting, ensure you have:
- **Node.js** v14+ ([Download](https://nodejs.org))
- **MongoDB** 4.4+ ([Download](https://www.mongodb.com/try/download/community) or use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))
- **Git**
- **npm** or **yarn**

### Step 1: Clone or Download Project

```bash
# If using git
git clone <repository-url>
cd bloodlink

# Or extract downloaded zip file
cd bloodlink
```

### Step 2: Setup Backend

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env with your settings
# MONGODB_URI=mongodb://localhost:27017/bloodlink
# JWT_SECRET=your_secret_key_here

# Seed database with demo data
node seed.js

# Start backend server
npm run dev
```

**Backend will run on:** http://localhost:5000

### Step 3: Setup Frontend

Open a **new terminal** and:

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

**Frontend will run on:** http://localhost:3000

### Step 4: Access Application

1. Open http://localhost:3000 in your browser
2. Login with demo credentials:
   - **Admin:** admin@bloodlink.com / admin123
   - **User:** user@bloodlink.com / user123

## 📁 Project Structure

```
bloodlink/
│
├── backend/
│   ├── config/
│   │   └── db.js                      # MongoDB connection
│   ├── models/
│   │   ├── User.js                    # User schema (auth)
│   │   ├── Donor.js                   # Donor profile schema
│   │   └── BloodRequest.js            # Request schema
│   ├── middleware/
│   │   └── auth.js                    # JWT auth & admin role check
│   ├── routes/
│   │   ├── auth.js                    # Login/register endpoints
│   │   ├── donors.js                  # Donor CRUD endpoints
│   │   ├── requests.js                # Request CRUD endpoints
│   │   └── admin.js                   # Admin endpoints
│   ├── server.js                      # Express app
│   ├── seed.js                        # Database seeding
│   ├── .env.example                   # Environment template
│   ├── package.json
│   └── README.md                      # Backend documentation
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── shared/
│   │   │   │   ├── Layout.js          # Page wrapper
│   │   │   │   ├── Sidebar.js         # Navigation
│   │   │   │   └── ProtectedRoute.js  # Route protection
│   │   │   ├── auth/                  # Auth components
│   │   │   ├── donor/                 # Donor components
│   │   │   ├── requests/              # Request components
│   │   │   └── admin/                 # Admin components
│   │   ├── context/
│   │   │   └── AuthContext.js         # Global auth state
│   │   ├── pages/
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   ├── Dashboard.js
│   │   │   ├── Donors.js
│   │   │   ├── MyProfile.js
│   │   │   ├── Requests.js
│   │   │   ├── NewRequest.js
│   │   │   ├── MyRequests.js
│   │   │   ├── AdminDashboard.js
│   │   │   ├── AdminDonors.js
│   │   │   ├── AdminRequests.js
│   │   │   └── AdminUsers.js
│   │   ├── utils/
│   │   │   └── api.js                 # Axios config
│   │   ├── App.js                     # Routing
│   │   ├── index.js                   # Entry point
│   │   └── index.css                  # Global styles
│   ├── public/
│   │   └── index.html
│   ├── package.json
│   └── README.md                      # Frontend documentation
│
└── README.md                          # This file
```

## 🗄️ Database Schema

### Users Collection
```json
{
  "_id": ObjectId,
  "name": "John Doe",
  "email": "john@example.com",
  "password": "$2a$10$hashed_password",
  "role": "user",
  "createdAt": "2024-01-15T10:30:00Z"
}
```

### Donors Collection
```json
{
  "_id": ObjectId,
  "user": ObjectId,
  "fullName": "John Doe",
  "age": 30,
  "gender": "Male",
  "bloodGroup": "O+",
  "phone": "9876543210",
  "email": "john@example.com",
  "city": "Chennai",
  "lastDonationDate": "2024-12-01T00:00:00Z",
  "isAvailable": true,
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

### BloodRequests Collection
```json
{
  "_id": ObjectId,
  "user": ObjectId,
  "patientName": "Suresh Kumar",
  "bloodGroup": "B+",
  "unitsRequired": 2,
  "hospitalName": "Apollo Hospital",
  "contactNumber": "9876543200",
  "city": "Chennai",
  "urgencyLevel": "High",
  "status": "Pending",
  "additionalNotes": "Emergency surgery",
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

## 🔌 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Response Format
```javascript
// Success
{ "success": true, "message": "...", "data": {...} }

// Error
{ "success": false, "message": "...", "errors": [...] }
```

### Authentication Routes

**Register User**
```
POST /auth/register
Body: { name, email, password }
Response: { token, user }
```

**Login**
```
POST /auth/login
Body: { email, password }
Response: { token, user }
```

**Get Current User**
```
GET /auth/me
Headers: { Authorization: Bearer <token> }
```

### Donor Routes

**Get All Donors**
```
GET /donors?bloodGroup=O+&city=Chennai&available=true&page=1&limit=12
```

**Create Donor Profile**
```
POST /donors
Headers: { Authorization: Bearer <token> }
Body: { fullName, age, gender, bloodGroup, phone, email, city, isAvailable }
```

**Update Donor Profile**
```
PUT /donors/:id
Headers: { Authorization: Bearer <token> }
Body: { fullName, age, ... }
```

**Delete Donor Profile**
```
DELETE /donors/:id
Headers: { Authorization: Bearer <token> }
```

### Blood Request Routes

**Get All Requests**
```
GET /requests?bloodGroup=B+&urgencyLevel=High&status=Pending
```

**Create Blood Request**
```
POST /requests
Headers: { Authorization: Bearer <token> }
Body: { patientName, bloodGroup, unitsRequired, hospitalName, contactNumber, city, urgencyLevel }
```

**Update Request Status**
```
PUT /admin/requests/:id/status
Headers: { Authorization: Bearer <token> }
Body: { status: "Pending|Fulfilled|Closed" }
```

## 📖 Usage Guide

### For Blood Donors

1. **Register Account**
   - Go to Sign Up page
   - Enter name, email, password

2. **Create Donor Profile**
   - Go to "My Donor Profile"
   - Fill in blood group, age, city
   - Set availability status

3. **Search Requests**
   - Go to "Blood Requests"
   - View emergency requests
   - Contact patients via phone number

### For Patients/Requesters

1. **Register Account**
   - Create account with email

2. **Submit Emergency Request**
   - Go to "Emergency Request"
   - Fill patient info and blood needed
   - Set urgency level
   - Submit request

3. **Search Donors**
   - Go to "Find Donors"
   - Filter by blood group and city
   - View donor contact information

### For Administrators

1. **Access Admin Dashboard**
   - Login as admin
   - View statistics and analytics
   - See blood group distribution

2. **Manage Donors**
   - View all donor profiles
   - Delete invalid profiles
   - Search and filter donors

3. **Manage Requests**
   - View all blood requests
   - Update request status
   - Delete closed requests

4. **Manage Users**
   - View all registered users
   - Delete user accounts

## 🚀 Deployment

### Deploy Backend (Heroku)

```bash
cd backend

# Login to Heroku
heroku login

# Create app
heroku create your-app-name

# Set environment variables
heroku config:set MONGODB_URI=your_atlas_url
heroku config:set JWT_SECRET=your_secret

# Deploy
git push heroku main
```

### Deploy Frontend (Vercel)

```bash
cd frontend

# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

Update `REACT_APP_API_URL` in Vercel environment variables.

### Docker Deployment

**Backend Dockerfile:**
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5000
CMD ["node", "server.js"]
```

**Build & Run:**
```bash
docker build -t bloodlink-backend .
docker run -p 5000:5000 -e MONGODB_URI=... bloodlink-backend
```

## 🔒 Security Features

- ✅ JWT-based authentication
- ✅ Password hashing with bcryptjs
- ✅ Input validation on all endpoints
- ✅ CORS protection
- ✅ Role-based access control
- ✅ Secure HTTP headers
- ✅ SQL injection prevention (MongoDB)

## 🐛 Troubleshooting

### MongoDB Connection Error

**Error:** `connect ECONNREFUSED 127.0.0.1:27017`

**Solution:**
- Ensure MongoDB is running: `mongod`
- Check MONGODB_URI in .env
- If using Atlas: verify network access and connection string

### Cannot Connect to Backend

**Error:** `Failed to fetch from http://localhost:5000/api`

**Solution:**
- Check backend is running: `npm run dev`
- Verify REACT_APP_API_URL in frontend
- Check CORS settings in backend

### JWT Token Expired

**Error:** `401 Unauthorized`

**Solution:**
- Login again to get new token
- Token expires after 7 days
- Clear localStorage if issues persist

### Blank Page on Frontend

**Error:** White screen with no content

**Solution:**
- Open DevTools (F12)
- Check Console for errors
- Verify backend API is running
- Check network requests

## 📞 Support & Documentation

### Additional Resources
- **Backend Docs:** See `backend/README.md`
- **Frontend Docs:** See `frontend/README.md`
- **API Postman Collection:** Import from backend/postman-collection.json

### Contact
For issues or questions, review the detailed README files in each folder.

## 📝 License

MIT License - Free to use and modify

## ✅ Checklist

Before deploying:
- [ ] Changed JWT_SECRET in production
- [ ] Updated database connection string
- [ ] Verified CORS settings
- [ ] Tested all auth flows
- [ ] Tested all CRUD operations
- [ ] Tested admin functions
- [ ] Responsive design on mobile
- [ ] Error handling on edge cases

---

**Version:** 1.0.0  
**Last Updated:** January 2025  
**Status:** Production Ready ✨

Built with ❤️ for saving lives through blood donation.
