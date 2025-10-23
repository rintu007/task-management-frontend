# Task Management System - Frontend

Vue.js 3 frontend for the task management system with real-time Kanban board.

## 🚀 Quick Setup

### Prerequisites
- Node.js 16+
- Backend API running on http://localhost:8000

### Installation
```bash
# Clone repository
git clone https://github.com/rintu007/task-management-frontend.git
cd task-management-frontend

# Install dependencies
npm install

# Configure API URL in .env
VITE_API_BASE_URL=http://localhost:8000/api

# Start development server
npm run dev
```

## 🎯 Features
- User authentication
- Task Kanban board with drag & drop
- Real-time task management
- Responsive design with Tailwind CSS
- Role-based UI (Admin/User views)

## 📱 Usage
1. Open http://localhost:5173
2. Login with credentials:
   - Admin: admin@example.com / password
   - User: john@example.com / password
3. Create, update, and manage tasks via drag & drop

## 🏗 Development
```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🔧 Configuration
Update `VITE_API_BASE_URL` in `.env` to match your backend API URL.

## 🚀 Production
```bash
npm run build
# Deploy dist/ folder to your web server
```

## 🔗 API Integration
The frontend automatically integrates with the backend API:
- Authentication via Laravel Sanctum
- Real-time task updates
- Automatic token management
- Error handling

Both projects are designed to work together seamlessly. Start the backend first, then the frontend.