# BloodLink Frontend

Blood Donor Management System - React Frontend

## 🚀 Quick Start

### Prerequisites
- Node.js 14+
- npm or yarn
- Backend API running on http://localhost:5000

### Installation

```bash
# 1. Navigate to frontend directory
cd frontend

# 2. Install dependencies
npm install

# 3. Start development server
npm start
```

The app will open at `http://localhost:3000`

## ⚙️ Configuration

### API URL
By default, the app connects to `http://localhost:5000/api`

To change the API URL, create a `.env` file:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

For production:
```env
REACT_APP_API_URL=https://api.yourdomain.com/api
```

## 🏗️ Project Structure

```
frontend/src/
├── components/
│   ├── auth/               # Authentication components
│   ├── donor/              # Donor-related components
│   ├── requests/           # Request-related components
│   ├── admin/              # Admin components
│   └── shared/
│       ├── Layout.js       # Main layout wrapper
│       ├── Sidebar.js      # Navigation sidebar
│       └── ProtectedRoute.js # Route protection
├── context/
│   └── AuthContext.js      # Global auth state
├── pages/
│   ├── Login.js
│   ├── Register.js
│   ├── Dashboard.js
│   ├── Donors.js
│   ├── MyProfile.js
│   ├── Requests.js
│   ├── NewRequest.js
│   ├── MyRequests.js
│   ├── AdminDashboard.js
│   ├── AdminDonors.js
│   ├── AdminRequests.js
│   └── AdminUsers.js
├── utils/
│   └── api.js              # Axios API instance
├── App.js                  # Main routing
├── index.js               # Entry point
└── index.css              # Global styles
```

## 🎨 Design System

### Colors (Healthcare Theme)
```css
--crimson: #C8102E          /* Primary red */
--crimson-dark: #9B0B22    /* Darker red */
--crimson-light: #F5C6CE   /* Light red */
--crimson-pale: #FDF0F2    /* Very light red */
--white: #FFFFFF
--gray-50 to --gray-900    /* Gray scale */
```

### Typography
- **Display Font:** Playfair Display (headings)
- **Body Font:** DM Sans (content)

### Responsive Breakpoints
- **Desktop:** 1200px+
- **Tablet:** 640px - 1199px
- **Mobile:** < 640px

## 🔐 Authentication Flow

1. **Register:** User creates account → JWT token stored in localStorage
2. **Login:** User authenticates → Token stored
3. **Protected Routes:** Routes check localStorage token
4. **Logout:** Token removed from localStorage
5. **Token Expiry:** 401 response clears token and redirects to login

Token stored as: `bloodlink_token` and `bloodlink_user`

## 🗂️ Feature Pages

### Public Pages
- `/login` - User login
- `/register` - User registration

### User Pages (Protected)
- `/dashboard` - Home dashboard with quick stats
- `/donors` - Search and filter blood donors
- `/my-profile` - Create/edit donor profile
- `/requests` - Browse all blood requests
- `/requests/new` - Submit emergency blood request
- `/my-requests` - Manage own blood requests

### Admin Pages (Admin Only)
- `/admin` - Admin dashboard with statistics
- `/admin/donors` - Manage all donor profiles
- `/admin/requests` - Manage all blood requests
- `/admin/users` - Manage system users

## 📦 Key Components

### Layout
- `<Layout>` - Wraps pages with sidebar and topbar
- `<Sidebar>` - Navigation menu with user info
- Shows different nav items based on user role

### Forms
- Input validation on change
- Error messages below fields
- Submit button with loading state
- Toast notifications for success/error

### Cards
- **DonorCard** - Displays donor information
- **RequestCard** - Shows blood request details
- **StatCard** - Dashboard statistics

### Tables
- Responsive table layout
- Hover effects
- Sortable columns (via API)
- Pagination controls

## 🔄 State Management

### Global State (AuthContext)
```javascript
const { user, loading, login, register, logout } = useAuth();
```

### Local State (useState)
Each page manages its own data fetching and filtering

### API Calls
Axios instance with interceptors:
- Automatically attaches JWT token
- Redirects to login on 401 errors

## 🎯 User Workflows

### Donor Registration
1. User registers account
2. Goes to "My Donor Profile"
3. Fills donor information
4. Profile appears in donor search results

### Finding Donors
1. User goes to "Find Donors"
2. Filters by blood group, city, availability
3. Views donor cards with contact info
4. Can contact donors directly

### Emergency Blood Request
1. User clicks "Emergency Request"
2. Fills request form
3. Submits with urgency level
4. Appears in requests list
5. Admin can update status
6. Donors can see and respond

## 🎨 Styling Approach

- **CSS Variables** for colors and sizing
- **Responsive Grid/Flex** layouts
- **Mobile-First** design approach
- **Transition Effects** for smooth interactions
- **Semantic HTML** for accessibility

### Key CSS Classes
```css
.btn                    /* Buttons */
.btn-primary           /* Primary button */
.form-control          /* Form inputs */
.card                  /* Content cards */
.stats-grid            /* Statistics grid */
.donor-grid            /* Donor cards grid */
.table-wrapper         /* Tables */
.empty-state           /* Empty states */
```

## 📱 Mobile Responsiveness

- Sidebar converts to hamburger menu
- Single column layouts on mobile
- Touch-friendly button sizes
- Optimized form layouts
- Mobile-optimized typography

## 🚀 Building for Production

```bash
# Build optimized production bundle
npm run build

# Output in 'build' folder ready for deployment
```

### Deployment Options

**Vercel (Recommended)**
```bash
vercel
```

**Netlify**
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=build
```

**Traditional Hosting**
Copy `build` folder contents to your web server

## 🔗 Backend Integration

### API Endpoints Used
```javascript
// Auth
POST   /auth/register
POST   /auth/login
GET    /auth/me

// Donors
GET    /donors (with filters)
POST   /donors
PUT    /donors/:id
DELETE /donors/:id
GET    /donors/my

// Requests
GET    /requests (with filters)
POST   /requests
PUT    /requests/:id
DELETE /requests/:id
GET    /requests/my

// Admin
GET    /admin/stats
GET    /admin/users
DELETE /admin/users/:id
GET    /admin/donors
GET    /admin/requests
PUT    /admin/requests/:id/status
```

## 🧪 Testing

### Manual Testing Checklist
- [ ] User registration with validation
- [ ] User login with wrong credentials
- [ ] Create donor profile
- [ ] Edit donor profile
- [ ] Delete donor profile
- [ ] Search donors by filters
- [ ] Submit blood request
- [ ] View my requests
- [ ] Admin can view all donors
- [ ] Admin can update request status
- [ ] Logout functionality
- [ ] Mobile responsive layout

## 🐛 Debugging

### Enable Console Logs
```javascript
// In App.js or any component
console.log('Data:', data);
```

### Check Network Requests
- Open DevTools → Network tab
- Check API requests and responses
- Verify token in Authorization header

### Common Issues

**Blank Page**
- Check browser console for errors
- Verify backend is running
- Check REACT_APP_API_URL

**Login Not Working**
- Verify backend credentials
- Check network request in DevTools
- Ensure token is saved to localStorage

**Donor Profile Not Showing**
- Verify donor profile exists
- Check GET /donors/my endpoint
- Verify JWT token is valid

## 📚 Available Scripts

```bash
npm start          # Start development server
npm run build      # Build for production
npm test           # Run tests
npm run eject      # Eject from create-react-app (irreversible)
```

## 📦 Dependencies

- **react** - UI library
- **react-router-dom** - Routing
- **axios** - HTTP client
- **react-hot-toast** - Notifications

## 🔐 Security Best Practices

1. **JWT Storage:** Stored in localStorage (consider sessionStorage for higher security)
2. **HTTPS:** Always use HTTPS in production
3. **CORS:** Backend restricts to trusted origins
4. **Input Validation:** All forms validate before submission
5. **Token Expiry:** 7 days by default

## 📄 License

MIT License

---

**Last Updated:** January 2025
**Frontend Version:** 1.0.0
