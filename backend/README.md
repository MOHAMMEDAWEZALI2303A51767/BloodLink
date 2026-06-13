# BloodLink Backend API

Blood Donor Management and Emergency Request System - Backend Server

## 🚀 Quick Start

### Prerequisites
- Node.js 14+ 
- MongoDB 4.4+
- npm or yarn

### Installation

```bash
# 1. Navigate to backend directory
cd backend

# 2. Install dependencies
npm install

# 3. Create .env file
cp .env.example .env

# 4. Configure MongoDB URI in .env
# MONGODB_URI=mongodb://localhost:27017/bloodlink
# JWT_SECRET=your_super_secret_key_here

# 5. Seed database with demo data
node seed.js

# 6. Start server
npm run dev
```

## 📝 Environment Variables

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/bloodlink
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
NODE_ENV=development
```

## 🏗️ Project Structure

```
backend/
├── config/
│   └── db.js                 # MongoDB connection
├── models/
│   ├── User.js              # User schema
│   ├── Donor.js             # Donor profile schema
│   └── BloodRequest.js      # Blood request schema
├── middleware/
│   └── auth.js              # JWT authentication & authorization
├── routes/
│   ├── auth.js              # Authentication endpoints
│   ├── donors.js            # Donor CRUD endpoints
│   ├── requests.js          # Blood request endpoints
│   └── admin.js             # Admin management endpoints
├── .env.example             # Environment template
├── package.json
├── seed.js                  # Database seeding script
└── server.js                # Express app entry point
```

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Protected)

### Donors
- `GET /api/donors` - Get all donors (with filters)
- `GET /api/donors/my` - Get my donor profile (Protected)
- `GET /api/donors/:id` - Get single donor
- `POST /api/donors` - Create donor profile (Protected)
- `PUT /api/donors/:id` - Update donor profile (Protected)
- `DELETE /api/donors/:id` - Delete donor profile (Protected)

**Query Parameters for GET /api/donors:**
- `bloodGroup` - Filter by blood group (A+, A-, B+, B-, AB+, AB-, O+, O-)
- `city` - Filter by city (case-insensitive)
- `available` - Filter available donors only (true/false)
- `page` - Page number (default: 1)
- `limit` - Results per page (default: 12)

### Blood Requests
- `GET /api/requests` - Get all requests (with filters)
- `GET /api/requests/my` - Get my requests (Protected)
- `GET /api/requests/:id` - Get single request
- `POST /api/requests` - Create blood request (Protected)
- `PUT /api/requests/:id` - Update blood request (Protected)
- `DELETE /api/requests/:id` - Delete blood request (Protected)

**Query Parameters for GET /api/requests:**
- `bloodGroup` - Filter by blood group
- `urgencyLevel` - Filter by urgency (Low, Medium, High)
- `status` - Filter by status (Pending, Fulfilled, Closed)
- `page` - Page number (default: 1)
- `limit` - Results per page (default: 10)

### Admin (Require Admin Role)
- `GET /api/admin/stats` - Get dashboard statistics
- `GET /api/admin/users` - Get all users
- `DELETE /api/admin/users/:id` - Delete a user
- `GET /api/admin/donors` - Get all donors (admin view)
- `GET /api/admin/requests` - Get all requests (admin view)
- `PUT /api/admin/requests/:id/status` - Update request status

## 🔐 Authentication

All protected routes require JWT token in Authorization header:

```
Authorization: Bearer <token>
```

Token is returned after login/register and should be stored in localStorage on client.

## 🗄️ Database Collections

### Users
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (user | admin),
  createdAt: Date
}
```

### Donors
```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: User),
  fullName: String,
  age: Number (18-65),
  gender: String (Male | Female | Other),
  bloodGroup: String (A+ | A- | B+ | B- | AB+ | AB- | O+ | O-),
  phone: String,
  email: String,
  city: String,
  lastDonationDate: Date,
  isAvailable: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### BloodRequests
```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: User),
  patientName: String,
  bloodGroup: String,
  unitsRequired: Number (1-20),
  hospitalName: String,
  contactNumber: String,
  city: String,
  urgencyLevel: String (Low | Medium | High),
  status: String (Pending | Fulfilled | Closed),
  additionalNotes: String,
  createdAt: Date,
  updatedAt: Date
}
```

## 📋 API Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "email",
      "msg": "Email already registered"
    }
  ]
}
```

## 🧪 Testing Endpoints

Use Postman, Insomnia, or curl to test:

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'

# Get all donors
curl http://localhost:5000/api/donors?bloodGroup=O+&city=Chennai

# Create donor profile (requires token)
curl -X POST http://localhost:5000/api/donors \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"fullName":"John Doe","age":30,"gender":"Male","bloodGroup":"O+","phone":"9876543210","email":"john@example.com","city":"Chennai","isAvailable":true}'
```

## 🌐 CORS Configuration

CORS is enabled for all origins. For production, update `cors()` in server.js:

```javascript
app.use(cors({
  origin: 'https://yourdomain.com',
  credentials: true
}));
```

## 🔒 Security Notes

1. **JWT Secret**: Change `JWT_SECRET` in production
2. **Password Hashing**: Passwords are hashed with bcryptjs (salt rounds: 10)
3. **Input Validation**: All inputs are validated using express-validator
4. **Authorization**: Routes check user ownership and admin role

## 📊 Deployment

### MongoDB Atlas (Cloud)
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/bloodlink?retryWrites=true
```

### Heroku Deployment
```bash
# Install Heroku CLI
heroku login
heroku create your-app-name
heroku config:set MONGODB_URI=your_mongodb_url
heroku config:set JWT_SECRET=your_secret
git push heroku main
```

### Docker Deployment
```bash
docker build -t bloodlink-backend .
docker run -p 5000:5000 \
  -e MONGODB_URI=mongodb://mongo:27017/bloodlink \
  -e JWT_SECRET=your_secret \
  bloodlink-backend
```

## 🐛 Troubleshooting

**MongoDB Connection Error:**
- Ensure MongoDB is running
- Check MONGODB_URI in .env
- Verify network access (if using MongoDB Atlas)

**JWT Token Invalid:**
- Token may have expired (default 7 days)
- Check Authorization header format: `Bearer <token>`
- Verify JWT_SECRET matches

**Validation Errors:**
- Check field requirements in models
- Ensure correct data types
- Validate email format, phone length, blood group enum

## 📞 Support

For issues or questions:
1. Check error messages carefully
2. Verify .env configuration
3. Check database connection
4. Review API documentation above
5. Enable debug logging: `DEBUG=* npm run dev`

## 📄 License

MIT License - Feel free to use this project

---

**Last Updated:** January 2025
**Backend Version:** 1.0.0
