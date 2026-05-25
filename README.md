# Services Booking Platform

A comprehensive service booking platform connecting service providers and clients with an advanced payment system, ratings, and smart recommendations.

## 🌟 Key Features

- ✅ **Authentication & Authorization System** - Secure login and role management
- 📅 **Booking Management** - Service booking and appointment scheduling
- 💳 **Advanced Payment System** - Payment processing, invoicing, and transfers
- ⭐ **Ratings & Reviews System** - Service and provider ratings
- 💬 **Real-time Chat** - Direct communication between clients and providers
- 🔔 **Notifications System** - Real-time notifications for important activities
- 🤖 **Smart Recommendations** - AI-powered personalized recommendations
- 📸 **Media Management** - Image upload and storage via Cloudinary

---

## 📁 Project Structure

```
project-root/
├── app.js                      # Main entry point
├── server.js                   # Server configuration
├── package.json                # Project dependencies
│
├── src/
│   ├── ai/                     # Artificial Intelligence Module
│   │   ├── ai.controller.js    # AI request handling
│   │   ├── ai.routes.js        # AI API routes
│   │   ├── ai.service.js       # Core services and operations
│   │   └── prompts/
│   │       └── recommendation.prompt.js  # AI recommendation templates
│   │
│   ├── config/                 # Configuration Files
│   │   ├── db.js              # Database configuration
│   │   ├── cloudinary.js      # Cloud image service configuration
│   │   └── socket.js          # WebSocket configuration (chat & notifications)
│   │
│   ├── constants/              # Application Constants
│   │   ├── events.js          # WebSocket events
│   │   ├── roles.js           # User roles
│   │   └── status.js          # Operation statuses
│   │
│   ├── middlewares/            # Middlewares
│   │   ├── auth.js            # Authorization verification
│   │   ├── errorHandler.js    # Error handling
│   │   └── upload.js          # File upload handling
│   │
│   ├── modules/                # Main Feature Modules
│   │   │
│   │   ├── auth/               # Authentication System
│   │   │   ├── auth.controller.js
│   │   │   ├── auth.model.js
│   │   │   ├── auth.routes.js
│   │   │   ├── auth.service.js
│   │   │   └── auth.validation.js
│   │   │
│   │   ├── users/              # User Management
│   │   │   ├── users.controller.js
│   │   │   ├── users.model.js
│   │   │   ├── users.routes.js
│   │   │   ├── users.service.js
│   │   │   └── users.validation.js
│   │   │
│   │   ├── providers/          # Service Providers Management
│   │   │   ├── providers.controller.js
│   │   │   ├── providers.model.js
│   │   │   ├── providers.routes.js
│   │   │   ├── providers.service.js
│   │   │   └── providers.validation.js
│   │   │
│   │   ├── services/           # Services Management
│   │   │   ├── services.controller.js
│   │   │   ├── services.model.js
│   │   │   ├── services.routes.js
│   │   │   ├── services.service.js
│   │   │   └── services.validation.js
│   │   │
│   │   ├── bookings/           # Booking System
│   │   │   ├── bookings.controller.js
│   │   │   ├── bookings.model.js
│   │   │   ├── bookings.routes.js
│   │   │   ├── bookings.service.js
│   │   │   └── bookings.validation.js
│   │   │
│   │   ├── payments/           # Payment System
│   │   │   ├── payments.controller.js
│   │   │   ├── payments.model.js
│   │   │   ├── payments.routes.js
│   │   │   ├── payments.service.js
│   │   │   └── payments.webhook.js  # Payment webhook handler
│   │   │
│   │   ├── reviews/            # Reviews System
│   │   │   ├── reviews.controller.js
│   │   │   ├── reviews.model.js
│   │   │   ├── reviews.routes.js
│   │   │   ├── reviews.service.js
│   │   │   └── reviews.validation.js
│   │   │
│   │   ├── chat/               # Real-time Chat System
│   │   │   ├── chat.gateway.js      # WebSocket gateway
│   │   │   ├── chat.model.js
│   │   │   └── chat.service.js
│   │   │
│   │   └── notifications/      # Notifications System
│   │       ├── notifications.gateway.js  # WebSocket gateway
│   │       ├── notifications.model.js
│   │       └── notifications.service.js
│   │
│   └── utils/                  # Utility Functions
│       ├── apiResponse.js      # Unified response format
│       ├── AppError.js         # Custom error class
│       └── catchAsync.js       # Async error handler

```

---

## 🔧 Requirements & Setup

### Prerequisites

- **Node.js** (v14+)
- **npm** or **yarn**
- **MongoDB** (or any NoSQL database)
- **Redis** (optional - for Caching and Sessions)

### Main Libraries Used

```json
{
  "express": "^5.2.1", // Main framework
  "nodemon": "^3.1.14" // Development tool
}
```

---

## 🚀 Installation & Running

### 1. Clone the Project

```bash
git clone <repository-url>
cd m3allem-backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

Create a `.env` file in the project root:

```env
PORT=3000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/services-booking

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# JWT
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d

# Stripe (for payments)
STRIPE_API_KEY=your_stripe_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret
```

### 4. Run the Project

```bash
# Development mode
npm run dev

# Production mode
npm start
```

---

## 📋 Main API Routes

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh-token` - Refresh token

### Users

- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `GET /api/users` - List all users (Admin)

### Service Providers

- `GET /api/providers` - List of service providers
- `GET /api/providers/:id` - Provider details
- `POST /api/providers` - Create provider profile
- `PUT /api/providers/:id` - Update provider info

### Services

- `GET /api/services` - List available services
- `GET /api/services/:id` - Service details
- `POST /api/services` - Add new service (providers)
- `PUT /api/services/:id` - Update service

### Bookings

- `POST /api/bookings` - Create new booking
- `GET /api/bookings` - List bookings
- `GET /api/bookings/:id` - Booking details
- `PUT /api/bookings/:id` - Update booking
- `DELETE /api/bookings/:id` - Cancel booking

### Payments

- `POST /api/payments/create-payment-intent` - Create payment intent
- `GET /api/payments/history` - Payment history
- `POST /api/payments/webhook` - Stripe webhook handler

### Reviews

- `POST /api/reviews` - Add review
- `GET /api/reviews/:serviceId` - Service reviews
- `PUT /api/reviews/:id` - Update review
- `DELETE /api/reviews/:id` - Delete review

### Recommendations

- `GET /api/ai/recommendations` - Get personalized recommendations

---

## 🔐 User Roles

The system supports three main roles:

1. **Client**
   - Search for services
   - Book services
   - Process payments
   - Leave reviews
   - Chat with providers

2. **Service Provider**
   - Add and manage services
   - Accept/reject bookings
   - Chat with clients
   - View income and ratings

3. **Administrator**
   - Manage users and providers
   - Manage services
   - Monitor payments
   - Analyze reports

---

## 💬 Chat & Notifications System

The system uses **WebSocket** for real-time communication:

### Chat

- Two-way communication between clients and providers
- Message storage
- Support for images and media

### Notifications

- Real-time notifications for new bookings
- Payment alerts
- Service status updates
- New review notifications

---

## 🤖 Smart Recommendations System

Uses AI to provide personalized recommendations based on:

- Search and booking history
- Ratings and preferences
- Similar services
- User behavior

---

## 🐛 Error Handling

The system uses a custom `AppError` class for unified error handling:

```javascript
throw new AppError("Error message", statusCode);
```

---

## 📸 Media Management

Images and files are stored via **Cloudinary**:

- Provider images
- Service images
- Gallery images

---

## 🧪 Testing

```bash
npm test
```

---

## 📚 Additional Documentation

- API Documentation: `/docs` (if available)
- Database Schema: `/docs/schema`
- Configuration: `/docs/config`

---

## 👥 Development Team

Developed as a graduation project from the **ITI** program.

---

## 📝 License

ISC License

---

## 📧 Support & Contact

For questions and issues, please open an issue in the project repository.

---

**Last Updated:** May 2026
