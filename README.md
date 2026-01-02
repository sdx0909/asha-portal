# ASHA-PORTAL - Enterprise Login Authentication System

A secure, role-based authentication system for healthcare data management built with React (Vite) + Node.js + Express + MongoDB + JWT.

## 🎯 Features

- **LOGIN-ONLY Authentication** (No signup/registration)
- **Role-based Access Control** (ADMIN / ASHA)
- **JWT Authentication** with secure token management
- **OTP Verification** (Aadhaar-style 2FA)
- **Session Management** with 30-minute timeout
- **Mobile-Responsive UI** with healthcare-themed design
- **Protected Routes** with role guards
- **Real-time Session Monitoring**

## 👥 Predefined Users

### 🛡 ADMIN
- **Email:** admin@gmail.com
- **Password:** Admin@123
- **Role:** ADMIN

### 👩‍⚕️ ASHA Worker
- **Email:** sunita.dixit.asha@gmail.com
- **Password:** Dixit.Sunita@123
- **Role:** ASHA

## 🏗️ Project Structure

```
ASHA-PORTAL/
├── backend/                 # Node.js + Express API
│   ├── controllers/         # Route controllers
│   ├── middleware/          # Auth & role middleware
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   ├── utils/              # Utilities (JWT, OTP, etc.)
│   └── server.js           # Main server file
├── src/                    # React frontend
│   ├── components/         # Reusable components
│   ├── contexts/           # React contexts
│   ├── pages/              # Page components
│   ├── types/              # TypeScript types
│   └── utils/              # Frontend utilities
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16+)
- MongoDB (local or cloud)
- npm or yarn

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment:**
   - Update `backend/.env` with your MongoDB connection string
   - The file is already configured with default values

4. **Start the backend server:**
   ```bash
   npm run dev
   # or
   npm start
   ```

   The backend will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to project root:**
   ```bash
   cd ..
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

   The frontend will run on `http://localhost:5173`

## 🔐 Authentication Flow

1. **Login** with predefined credentials
2. **OTP Verification** (6-digit code)
3. **JWT Token** generation and storage
4. **Role-based Redirection:**
   - ADMIN → `/admin/dashboard`
   - ASHA → `/asha/dashboard`
5. **Session Management** with auto-logout

## 🛡️ Security Features

- **Password Hashing** with bcrypt
- **JWT Token** with expiration
- **Rate Limiting** on auth endpoints
- **Session Timeout** (30 minutes)
- **Role-based Access Control**
- **Protected Routes**
- **Input Validation**
- **CORS Configuration**

## 📱 Mobile Responsive

- **Fully responsive** design
- **Touch-friendly** interface
- **Healthcare-themed** UI
- **Accessibility** compliant
- **Cross-browser** compatible

## 🔧 Development Features

- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Axios** for API calls
- **Context API** for state management
- **Custom Hooks** for reusability

## 📊 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/verify-otp` - OTP verification
- `POST /api/auth/resend-otp` - Resend OTP
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user
- `GET /api/auth/validate-token` - Validate JWT token

### Health Check
- `GET /api/health` - Server health status

## 🎨 UI Components

### Login Page
- Email/password form
- Password visibility toggle
- Form validation
- Loading states
- Error handling

### OTP Verification
- 6-digit OTP input
- Timer countdown
- Resend functionality
- Auto-focus navigation

### Dashboards
- **Admin Dashboard:** System overview, user management, reports
- **ASHA Dashboard:** Patient care, tasks, health metrics

## 🔒 Environment Variables

### Backend (.env)
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=30m
OTP_EXPIRES_IN=2m
BCRYPT_ROUNDS=12
```

### Frontend (.env)
```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_APP_NAME=ASHA-PORTAL
VITE_APP_VERSION=1.0.0
```

## 🧪 Testing

### Manual Testing
1. Start both backend and frontend servers
2. Navigate to `http://localhost:5173`
3. Login with predefined credentials
4. Complete OTP verification
5. Test role-based access
6. Test session timeout

### Test Scenarios
- ✅ Valid login credentials
- ✅ Invalid login credentials
- ✅ OTP verification
- ✅ Role-based redirection
- ✅ Protected routes
- ✅ Session timeout
- ✅ Logout functionality

## 🚀 Deployment

### Backend Deployment
1. Set production environment variables
2. Configure MongoDB Atlas
3. Deploy to Heroku/Railway/DigitalOcean
4. Update CORS origins

### Frontend Deployment
1. Update API base URL
2. Build production bundle: `npm run build`
3. Deploy to Vercel/Netlify/AWS S3

## 📝 Production Checklist

- [ ] Remove development OTP logging
- [ ] Configure real SMS/Email OTP delivery
- [ ] Set secure JWT secrets
- [ ] Configure production database
- [ ] Enable HTTPS
- [ ] Set up monitoring
- [ ] Configure backup strategy
- [ ] Update CORS origins
- [ ] Enable rate limiting
- [ ] Set up logging

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

---

**ASHA-PORTAL** - Empowering healthcare through secure technology 🏥✨