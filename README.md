# 🏨 Hotel Booking Management System

<div align="center">

[![Java](https://img.shields.io/badge/Java-17+-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)](#)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-2.7.18-6DB33F?style=for-the-badge&logo=spring&logoColor=white)](#)
[![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](#)
[![MySQL](https://img.shields.io/badge/MySQL-8.0+-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](#)
[![H2](https://img.shields.io/badge/H2-Database-0078D4?style=for-the-badge&logo=h2&logoColor=white)](#)

**A modern, full-stack hotel booking management system with enterprise-grade features**

🚀 **Live Demo** • 📚 **Documentation** • 🛠️ **Setup Guide** • 🔧 **API Reference**

![Visitors](https://visitor-badge.laobi.icu/badge?page_id=hotel-booking-system)
![GitHub last commit](https://img.shields.io/github/last-commit/yourusername/hotel-booking-system)
![GitHub issues](https://img.shields.io/github/issues/yourusername/hotel-booking-system)
![GitHub stars](https://img.shields.io/github/stars/yourusername/hotel-booking-system?style=social)

</div>

---

## ✨ Features at a Glance

<table>
<tr>
<td width="50%">

### 🎯 **Core Features**
- 🔐 **JWT Authentication** with role-based access
- 🏨 **Multi-Hotel Management** with room inventory
- 📅 **Smart Booking System** with date validation
- 📊 **Real-time Analytics Dashboard**
- 👥 **User Management** (Admin/Manager/Customer)
- 💰 **Revenue Tracking** and reporting
- 🛏️ **Room Availability** management
- 📱 **Responsive Design** for all devices

</td>
<td width="50%">

### 🚀 **Advanced Features**
- ⚡ **Real-time Updates** and notifications
- 🎨 **Modern UI/UX** with animations
- 🔄 **Auto-refresh** dashboard metrics
- 📈 **Visual Analytics** with charts
- 🛡️ **Security Hardened** with Spring Security
- 🌐 **RESTful API** with comprehensive endpoints
- 💾 **Dual Database** support (H2/MySQL)
- 🎭 **Role-based** interface customization

</td>
</tr>
</table>

---

## 🎯 Quick Start

### 🚀 **30-Second Setup**

```bash
# 1️⃣ Clone and start backend
git clone <repo-url>
cd hotel-booking-system
mvn spring-boot:run

# 2️⃣ Start frontend (new terminal)
cd frontend
npm install && npm start

# 3️⃣ Access the application
# 🌐 Frontend: http://localhost:3000
# 🔧 Backend:  http://localhost:8080
# 💾 Database: http://localhost:8080/h2-console
```

### 🔑 **Demo Accounts**

| Role | Username | Password | Access Level |
|------|----------|----------|-------------|
| 👑 **Admin** | `admin` | `password` | 🌟 Full system access |
| 👨‍💼 **Manager** | `manager1` | `password` | 🏨 Hotel & booking management |
| 👤 **Customer** | `customer1` | `password123` | 📝 Personal bookings |

---

## 🏗️ Architecture

<div align="center">

```mermaid
graph TB
    A[React Frontend] --> B[Spring Boot API]
    B --> C[H2/MySQL Database]
    B --> D[JWT Authentication]
    B --> E[Spring Security]
    A --> F[React Router]
    A --> G[Context API]
    B --> H[REST Controllers]
    B --> I[Data Access Layer]
```

</div>

### 🔧 **Technology Stack**

<table>
<tr>
<td width="50%">

#### 🖥️ **Backend**
- **Framework:** Spring Boot 2.7.18
- **Language:** Java 17+
- **Security:** Spring Security + JWT
- **Database:** H2 (dev) / MySQL (prod)
- **Build Tool:** Maven
- **API Style:** RESTful

</td>
<td width="50%">

#### 🎨 **Frontend**
- **Framework:** React 18.2.0
- **Language:** JavaScript/JSX
- **Routing:** React Router DOM 6.3.0
- **HTTP Client:** Axios 0.27.2
- **State Management:** Context API
- **Styling:** Custom CSS3 + Variables

</td>
</tr>
</table>

---

## 📜 **Project Structure**

```
📁 hotel-booking-system/
├── 📁 src/main/java/com/example/hotelbooking/     # ⚙️ Spring Boot Backend
│   ├── 📄 HotelBookingApplication.java           # 🚀 Main application
│   ├── 📁 model/                                 # 📋 Entity classes
│   ├── 📁 dao/                                   # 💾 Data Access Objects
│   ├── 📁 controller/                            # 🌐 REST Controllers
│   ├── 📁 service/                               # 🛠️ Business Logic
│   ├── 📁 config/                                # ⚙️ Configuration
│   └── 📁 util/                                  # 🔧 Utilities
│
├── 📁 frontend/                                  # ⚔️ React Frontend
│   ├── 📁 public/                                # 🌍 Static assets
│   ├── 📁 src/
│   │   ├── 📁 components/                        # 🧩 React Components
│   │   │   ├── 📁 ui/                            # 🎨 UI Components
│   │   │   ├── 📄 Dashboard.js                   # 📊 Main Dashboard
│   │   │   ├── 📄 Hotels.js                      # 🏨 Hotel Management
│   │   │   ├── 📄 Rooms.js                       # 🛏️ Room Management
│   │   │   └── 📄 Bookings.js                    # 📅 Booking System
│   │   ├── 📁 contexts/                          # 🔄 State Management
│   │   ├── 📄 App.js                             # 🚀 Main App Component
│   │   └── 📄 index.js                           # 🔗 Entry Point
│   └── 📄 package.json                           # 📦 Dependencies
│
├── 📁 database/                                  # 💾 Database Scripts
│   └── 📄 hotel_booking_db.sql                   # 🗺️ Schema Definition
│
├── 📄 pom.xml                                    # 🛠️ Maven Configuration
└── 📄 README.md                                  # 📚 This amazing documentation!
```

---

## 🎆 **Feature Showcase**

### 📊 **Analytics Dashboard**
- **Real-time Metrics**: Live booking counts, revenue tracking
- **Visual Charts**: Booking trends, occupancy rates, revenue graphs
- **Role-based Views**: Customized dashboards per user type
- **Performance Indicators**: Key business metrics at a glance

### 🔐 **Authentication System**
- **JWT Security**: Industry-standard token-based authentication
- **Role Management**: Three-tier access control (Admin/Manager/Customer)
- **Session Management**: Secure login/logout with token validation
- **Protected Routes**: Frontend route protection based on user roles

### 🏨 **Hotel & Room Management**
- **Multi-Hotel Support**: Manage multiple hotel properties
- **Room Inventory**: Comprehensive room type management
- **Dynamic Pricing**: Flexible pricing per room type and season
- **Amenity Tracking**: Detailed amenities and features per room
- **Availability Engine**: Real-time room availability checking

### 📅 **Advanced Booking System**
- **Date Selection**: Interactive date pickers for check-in/check-out
- **Room Assignment**: Specific room assignment with preferences
- **Status Workflow**: Complete booking lifecycle management
- **Price Calculation**: Automatic total calculation with taxes
- **Special Requests**: Customer notes and special requirements

### 👥 **User Management**
- **Customer Profiles**: Complete customer information management
- **Loyalty Program**: Points system and customer rewards
- **Staff Management**: Manager and admin account management
- **Activity Tracking**: User login and activity monitoring

---

## 🚀 **Detailed Setup Guide**

### 📎 **Prerequisites**

<table>
<tr>
<td width="50%">

#### ⚙️ **Development Tools**
- **Java Development Kit** 17+
- **Node.js** 14+ and npm
- **Maven** 3.6+
- **Git** for version control

</td>
<td width="50%">

#### 💾 **Optional (Production)**
- **MySQL** 8.0+ server
- **Docker** for containerization
- **Nginx** for reverse proxy
- **SSL Certificate** for HTTPS

</td>
</tr>
</table>

### 🔧 **Installation Steps**

#### **Step 1: Clone Repository**
```bash
git clone <repository-url>
cd hotel-booking-system
```

#### **Step 2: Backend Setup**
```bash
# Build the application
mvn clean package -DskipTests

# Run with Maven (Development)
mvn spring-boot:run

# Or run JAR file (Recommended)
java -jar target/hotel-booking-system-0.0.1-SNAPSHOT.jar
```

**✨ Backend will be available at:** `http://localhost:8080`

#### **Step 3: Frontend Setup**
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

**✨ Frontend will be available at:** `http://localhost:3000`

#### **Step 4: Database Configuration**

**🟢 H2 Database (Default - No Setup Required)**
- ✅ Automatically configured and initialized
- 🔗 H2 Console: `http://localhost:8080/h2-console`
- 🔑 Credentials: URL: `jdbc:h2:mem:testdb`, User: `sa`, Password: `password`

**🟡 MySQL Database (Production)**
```properties
# Update src/main/resources/application.properties
spring.datasource.url=jdbc:mysql://localhost:3306/hotel_booking_db
spring.datasource.username=your_username
spring.datasource.password=your_password
```

---

## 🌐 **API Reference**

### 🔐 **Authentication Endpoints**

<table>
<tr><th>Method</th><th>Endpoint</th><th>Description</th><th>Access</th></tr>
<tr><td><code>POST</code></td><td><code>/api/auth/login</code></td><td>🔑 User login with credentials</td><td>Public</td></tr>
<tr><td><code>POST</code></td><td><code>/api/auth/logout</code></td><td>🚪 User logout and token invalidation</td><td>Authenticated</td></tr>
<tr><td><code>GET</code></td><td><code>/api/auth/validate</code></td><td>✅ Token validation and refresh</td><td>Authenticated</td></tr>
<tr><td><code>POST</code></td><td><code>/api/auth/register</code></td><td>📄 New user registration</td><td>Public</td></tr>
</table>

### 📊 **Dashboard Endpoints**

<table>
<tr><th>Method</th><th>Endpoint</th><th>Description</th><th>Access</th></tr>
<tr><td><code>GET</code></td><td><code>/api/dashboard/overview</code></td><td>📊 Complete dashboard metrics</td><td>All Users</td></tr>
<tr><td><code>GET</code></td><td><code>/api/dashboard/stats</code></td><td>📈 Detailed statistics</td><td>Manager+</td></tr>
<tr><td><code>GET</code></td><td><code>/api/dashboard/booking-status-chart</code></td><td>📊 Booking status distribution</td><td>Manager+</td></tr>
</table>

### 🏨 **Hotel & Room Endpoints**

<table>
<tr><th>Method</th><th>Endpoint</th><th>Description</th><th>Access</th></tr>
<tr><td><code>GET</code></td><td><code>/api/hotels</code></td><td>🏨 List all hotels</td><td>All Users</td></tr>
<tr><td><code>POST</code></td><td><code>/api/hotels</code></td><td>➕ Create new hotel</td><td>Admin Only</td></tr>
<tr><td><code>GET</code></td><td><code>/api/rooms</code></td><td>🛏️ List all rooms</td><td>All Users</td></tr>
<tr><td><code>POST</code></td><td><code>/api/rooms</code></td><td>➕ Add new room</td><td>Manager+</td></tr>
<tr><td><code>GET</code></td><td><code>/api/rooms/hotel/{id}</code></td><td>🏨 Get rooms by hotel</td><td>All Users</td></tr>
</table>

### 📅 **Booking Endpoints**

<table>
<tr><th>Method</th><th>Endpoint</th><th>Description</th><th>Access</th></tr>
<tr><td><code>GET</code></td><td><code>/api/bookings</code></td><td>📅 List all bookings</td><td>Manager+</td></tr>
<tr><td><code>POST</code></td><td><code>/api/bookings</code></td><td>➕ Create new booking</td><td>All Users</td></tr>
<tr><td><code>PUT</code></td><td><code>/api/bookings/{id}/status</code></td><td>🔄 Update booking status</td><td>Manager+</td></tr>
<tr><td><code>GET</code></td><td><code>/api/bookings/customer/{id}</code></td><td>👤 Customer bookings</td><td>Customer/Manager+</td></tr>
</table>

### 👥 **User Management Endpoints**

<table>
<tr><th>Method</th><th>Endpoint</th><th>Description</th><th>Access</th></tr>
<tr><td><code>GET</code></td><td><code>/api/users</code></td><td>👥 List all users</td><td>Admin Only</td></tr>
<tr><td><code>GET</code></td><td><code>/api/customers</code></td><td>👤 List all customers</td><td>Manager+</td></tr>
<tr><td><code>POST</code></td><td><code>/api/customers</code></td><td>➕ Add new customer</td><td>Manager+</td></tr>
</table>

---

## 💾 **Database Schema**

### 🗦️ **Entity Relationship Diagram**

```mermaid
erDiagram
    USERS {
        int id PK
        string username UK
        string email UK
        string password
        string role
        string first_name
        string last_name
        string phone
        boolean is_active
        timestamp created_at
        timestamp last_login
    }
    
    CUSTOMERS {
        int id PK
        int user_id FK
        string name
        string email UK
        string password
        string phone
        string address
        date date_of_birth
        int loyalty_points
        timestamp created_at
    }
    
    HOTELS {
        int id PK
        string name
        string address
        string city
        string state
        string country
        string postal_code
        string phone
        string email
        string description
        decimal star_rating
        int manager_id FK
        boolean is_active
        timestamp created_at
    }
    
    ROOMS {
        int id PK
        int hotel_id FK
        string room_number
        string room_type
        int capacity
        decimal price_per_night
        string amenities
        boolean is_available
        boolean is_active
        timestamp created_at
    }
    
    BOOKINGS {
        int id PK
        int customer_id FK
        int hotel_id FK
        int room_id FK
        date check_in_date
        date check_out_date
        timestamp booking_date
        decimal total_amount
        string status
        string special_requests
        timestamp created_at
        timestamp updated_at
    }
    
    USERS ||--o{ CUSTOMERS : "has profile"
    USERS ||--o{ HOTELS : "manages"
    HOTELS ||--o{ ROOMS : "contains"
    CUSTOMERS ||--o{ BOOKINGS : "makes"
    HOTELS ||--o{ BOOKINGS : "receives"
    ROOMS ||--o{ BOOKINGS : "assigned to"
```

### 📋 **Sample Data Overview**

<table>
<tr>
<td width="50%">

#### 👥 **Users & Customers**
- **5 Users**: 1 Admin, 1 Manager, 3 Customers
- **3 Customer Profiles**: Complete with loyalty points
- **Authentication**: All accounts with secure passwords
- **Roles**: Properly configured access levels

#### 🏨 **Hotels & Rooms**
- **3 Hotels**: Grand Hotel (NYC), Beach Resort (Miami), Mountain Lodge (Denver)
- **12 Rooms**: 4 rooms per hotel with different types
- **Pricing**: $90-400/night based on room type and location
- **Amenities**: WiFi, TV, Mini Bar, Views, Kitchen options

</td>
<td width="50%">

#### 📅 **Bookings & Analytics**
- **4 Sample Bookings**: Various statuses and date ranges
- **Revenue Data**: $280-1,050 per booking
- **Status Mix**: CONFIRMED, PENDING, CHECKED_OUT
- **Date Range**: January-April 2024

#### 📊 **Dashboard Metrics**
- **Real-time Counts**: Bookings, revenue, occupancy
- **Status Analytics**: Distribution of booking statuses
- **Performance Metrics**: Occupancy rates, customer satisfaction
- **Growth Tracking**: Customer and revenue trends

</td>
</tr>
</table>

---

## 🛠️ **Troubleshooting Guide**

### ⚡ **Common Issues & Solutions**

<details>
<summary><strong>🔴 Backend Won't Start - Port 8080 Already in Use</strong></summary>

**Problem**: `Web server failed to start. Port 8080 was already in use.`

**Solution**:
```bash
# Windows PowerShell
$processId = (netstat -ano | findstr :8080)[0].Split()[-1]
Stop-Process -Id $processId -Force

# Then restart
java -jar target/hotel-booking-system-0.0.1-SNAPSHOT.jar
```
</details>

<details>
<summary><strong>🟡 API Calls Failing - 500 Internal Server Error</strong></summary>

**Problem**: `Failed to load resource: the server responded with a status of 500`

**Solution**:
1. Check if backend is running on port 8080
2. Verify database connection (H2 console: `http://localhost:8080/h2-console`)
3. Check application logs for detailed error messages
4. Restart backend application
</details>

<details>
<summary><strong>🟠 Frontend Build Issues</strong></summary>

**Problem**: React compilation errors or dependency issues

**Solution**:
```bash
cd frontend
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
npm start
```
</details>

<details>
<summary><strong>🔵 Database Connection Issues</strong></summary>

**Problem**: Database connection failures

**For H2 (Default)**:
- No action needed - automatically configured
- Access console: `http://localhost:8080/h2-console`

**For MySQL**:
- Ensure MySQL service is running
- Verify credentials in `application.properties`
- Check if database exists
</details>

### 🔍 **Health Check Commands**

```bash
# Check backend health
curl http://localhost:8080/api/dashboard/overview
# PowerShell alternative
Invoke-RestMethod -Uri "http://localhost:8080/api/dashboard/overview" -Method GET

# Check frontend accessibility
curl http://localhost:3000

# Verify ports are available
netstat -ano | findstr :8080
netstat -ano | findstr :3000
```

---

## 🚀 **Future Enhancements**

### 🎆 **Planned Features (Roadmap)**

<table>
<tr>
<td width="50%">

#### 🔮 **Phase 2: Advanced Features**
- 📱 **Mobile App** (React Native)
- 📷 **Image Upload** for hotels and rooms
- 💬 **Real-time Chat** support
- 🔔 **Push Notifications** for booking updates
- 🌍 **Multi-language** support
- 💳 **Payment Integration** (Stripe/PayPal)

</td>
<td width="50%">

#### 🔮 **Phase 3: Enterprise Features**
- 🚀 **Microservices** architecture
- 🐳 **Docker** containerization
- ☁️ **Cloud Deployment** (AWS/Azure)
- 📈 **Advanced Analytics** with ML
- 🔄 **API Rate Limiting**
- 🔐 **OAuth2** integration

</td>
</tr>
</table>

### 🏆 **Performance Optimizations**
- **Caching Layer**: Redis integration for frequently accessed data
- **Database Optimization**: Query optimization and indexing
- **CDN Integration**: Static asset delivery optimization
- **Load Balancing**: Multi-instance deployment support

---

## 👥 **Contributing**

We welcome contributions! Here's how you can help:

1. **🍴 Fork the repository**
2. **🌱 Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **📝 Commit your changes** (`git commit -m 'Add amazing feature'`)
4. **🚀 Push to the branch** (`git push origin feature/amazing-feature`)
5. **📨 Open a Pull Request**

### 📈 **Development Guidelines**
- Follow existing code style and conventions
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting

---

## 📜 **License**

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🖗 **Support & Contact**

<div align="center">

**Found this project helpful? ⭐ Give it a star!**

📞 **Support**: [Create an Issue](../../issues) • 💬 **Discussions**: [Join the Community](../../discussions)

**Built with ❤️ by the Hotel Booking Team**

---

[![GitHub followers](https://img.shields.io/github/followers/yourusername?style=social)](#)
[![GitHub stars](https://img.shields.io/github/stars/yourusername/hotel-booking-system?style=social)](#)
[![GitHub forks](https://img.shields.io/github/forks/yourusername/hotel-booking-system?style=social)](#)

</div> ranging from $280 to $1,050
- Linked to specific customers and rooms

## Troubleshooting

### Common Issues and Solutions

#### 1. 500 Internal Server Error from API endpoints
**Symptoms**: 
```
Failed to load resource: the server responded with a status of 500 (Internal Server Error)
Error fetching customers: AxiosError
```

**Causes & Solutions**:
- **Database not running**: The application is now configured to use H2 in-memory database by default, which doesn't require MySQL
- **MySQL connection issues**: If using MySQL, ensure the service is running and credentials are correct
- **Port conflicts**: Make sure port 8080 is available

**Fix**: The application now uses H2 database by default. Restart the backend:
```bash
# Stop any running processes on port 8080
netstat -ano | findstr :8080
# Kill the process if needed, then restart
java -jar target/hotel-booking-system-0.0.1-SNAPSHOT.jar
```

#### 2. Backend won't start
**Symptoms**: 
```
Web server failed to start. Port 8080 was already in use.
```

**Solution**:
```bash
# Windows PowerShell
$processId = (netstat -ano | findstr :8080)[0].Split()[-1]
Stop-Process -Id $processId -Force

# Then restart the application
java -jar target/hotel-booking-system-0.0.1-SNAPSHOT.jar
```

#### 3. Frontend API calls failing
**Symptoms**: Network errors, connection refused

**Solutions**:
- Ensure backend is running on port 8080
- Check if CORS is properly configured (already included in controllers)
- Verify API endpoints: `http://localhost:8080/api/customers`, `/api/hotels`, `/api/bookings`

#### 4. Database Issues
**H2 Database (Default)**:
- No setup required
- Data is recreated on each restart
- Access H2 console: `http://localhost:8080/h2-console`

**MySQL Database (Optional)**:
- Ensure MySQL service is running: `net start mysql` or `Get-Service -Name "*mysql*"`
- Check connection settings in `application.properties`
- Verify database exists: `mysql -u root -p` then `SHOW DATABASES;`

#### 5. Build Issues
**Maven Issues**:
```bash
# Clean and rebuild
mvn clean compile
mvn clean package -DskipTests
```

**Node.js Issues**:
```bash
# Clear npm cache and reinstall
cd frontend
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

#### 6. React DevTools Warning
The warning about React DevTools is informational only and doesn't affect functionality.

#### 7. Port Conflicts
- Backend uses port 8080
- Frontend uses port 3000
- H2 console uses `/h2-console` endpoint

**Check ports**:
```bash
# Windows
netstat -ano | findstr :8080
netstat -ano | findstr :3000

# Kill process if needed
Stop-Process -Id <ProcessId> -Force
```

### Development Tips

1. **Database Inspection**: Use H2 console at `http://localhost:8080/h2-console` to view data
2. **API Testing**: Use Postman, curl, or PowerShell's `Invoke-RestMethod`
3. **Logs**: Check console output for detailed error messages
4. **Hot Reload**: Frontend supports hot reload, backend requires restart for code changes

### Quick Health Check
```bash
# Check if backend is responding
curl http://localhost:8080/api/customers
# Or PowerShell
Invoke-RestMethod -Uri "http://localhost:8080/api/customers" -Method GET

# Check if frontend is accessible
curl http://localhost:3000
```