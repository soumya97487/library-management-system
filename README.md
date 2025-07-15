# 📚 **Rent-a-Book Application**

> A comprehensive digital library management system that allows users to rent and manage books online with role-based access control.

## 🌟 **Features**

### **🔐 Authentication & Authorization**
- **User Registration & Login** with email verification
- **Role-based Access Control** (Admin, Librarian, Member)
- **Email Verification** for account activation
- **Secure Session Management**

### **👨‍💼 Admin & Librarian Features**
- **Complete CRUD Operations** for:
  - 📖 Books Management
  - ✍️ Authors Management
  - 📂 Categories Management
  - 💳 Loan Management
- **PDF Upload & Management** for books
- **Full Administrative Control**

### **👥 Member Features**
- **Book Browsing** with search functionality
- **Book Rental System** with flexible duration (1-12 months)
- **PDF Access** for rented books
- **Integrated Payment System** (Razorpay & COD)
- **Personal Rental Dashboard**

### **🔍 Search & Filter**
- **Advanced Search** by book name
- **Category-based Filtering**
- **Real-time Search Results**

## 🛠️ **Tech Stack**

### **Frontend**
- **React.js** - User Interface
- **React Router** - Navigation
- **Axios** - API Communication
- **CSS3/SCSS** - Styling

### **Backend**
- **Node.js** - Runtime Environment
- **Express.js** - Web Framework
- **MongoDB** - Database
- **Mongoose** - ODM

### **Additional Technologies**
- **JWT** - Authentication
- **Nodemailer** - Email Services
- **Razorpay API** - Payment Integration
- **Multer** - File Upload Handling

## 🚀 **Getting Started**

### **Prerequisites**
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### **Installation**

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/rent-a-book-app.git
   cd rent-a-book-app
   ```

2. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Environment Setup**
   
   Create `.env` file in backend directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/rentabook
   JWT_SECRET=your_jwt_secret_key
   EMAIL_SERVICE=gmail
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_email_password
   RAZORPAY_KEY_ID=your_razorpay_key
   RAZORPAY_KEY_SECRET=your_razorpay_secret
   ```

5. **Start the Application**
   
   Backend:
   ```bash
   cd backend
   npm start
   ```
   
   Frontend:
   ```bash
   cd frontend
   npm start
   ```

## 📱 **User Flow**

### **🔐 Authentication Flow**
1. **Landing Page** → Login/Signup options
2. **Signup** → Fill details with role selection
3. **Email Verification** → Activate account
4. **Login** → Access dashboard based on role

### **👨‍💼 Admin/Librarian Workflow**
1. **Dashboard Access** → Navigate through Admin panel
2. **Book Management** → Add/Edit/Delete books with PDF upload
3. **Author & Category Management** → Organize library content
4. **Loan Management** → Track and manage book rentals

### **👥 Member Workflow**
1. **Browse Books** → Search and filter available books
2. **Select Duration** → Choose rental period (1-12 months)
3. **Add to Cart** → Multiple book selection
4. **Checkout** → Choose payment method (Razorpay/COD)
5. **Access Books** → View PDF after successful payment
6. **Auto-expiry** → Books return to rental status after period

## 🎨 **Key Pages & Components**

### **🔑 Authentication Pages**
- **Login Page** - User authentication
- **Signup Page** - New user registration
- **Email Verification** - Account activation

### **📊 Dashboard Pages**
- **Admin Dashboard** - Complete management interface
- **Member Dashboard** - Book browsing and rental interface

### **📚 Management Pages**
- **Books Page** - Book catalog with CRUD operations
- **Authors Page** - Author management
- **Categories Page** - Category organization
- **Loans Page** - Rental tracking and management

### **🛒 Transaction Pages**
- **Rent Page** - Shopping cart for book rentals
- **Checkout Page** - Payment processing
- **Payment Gateway** - Razorpay/COD integration

## 🔧 **API Endpoints**

### **Authentication**
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/verify` - Email verification

### **Books**
- `GET /api/books` - Get all books
- `POST /api/books` - Add new book (Admin/Librarian)
- `PUT /api/books/:id` - Update book (Admin/Librarian)
- `DELETE /api/books/:id` - Delete book (Admin/Librarian)

### **Rentals**
- `POST /api/rentals` - Create rental
- `GET /api/rentals/user/:userId` - Get user rentals
- `PUT /api/rentals/:id` - Update rental status

### **Payments**
- `POST /api/payments/create-order` - Create Razorpay order
- `POST /api/payments/verify` - Verify payment

## 🔒 **Security Features**

- **JWT Token Authentication**
- **Role-based Route Protection**
- **Input Validation & Sanitization**
- **Secure File Upload**
- **Password Hashing**
- **CORS Configuration**

## 📈 **Future Enhancements**

- **📱 Mobile App** - React Native implementation
- **🔔 Notifications** - Email/SMS alerts for due dates
- **⭐ Rating System** - Book reviews and ratings
- **📊 Analytics** - Admin dashboard with insights
- **🌐 Multi-language Support**
- **💰 Subscription Plans**

## 🤝 **Contributing**

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 **Author**

- **Your Name** - *Initial work* - [YourGitHub](https://github.com/yourusername)

## 🙏 **Acknowledgments**

- Thanks to all contributors who helped build this project
- Special thanks to the open-source community
- Inspiration from modern library management systems

---

### 📞 **Support**

For support, email support@rentabook.com or join our Slack channel.

### 🔗 **Links**

- [Live Demo](https://your-demo-link.com)
- [Documentation](https://your-docs-link.com)
- [Report Bug](https://github.com/yourusername/rent-a-book-app/issues)
- [Request Feature](https://github.com/yourusername/rent-a-book-app/issues)

---

**⭐ Star this repository if you found it helpful!**