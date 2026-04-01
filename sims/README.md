# 🎓 Student Internship Management System (SIMS)

A full-stack web application for managing internships — connecting students, companies, and admins.

---

## 🗂️ Project Structure

```
sims/
├── backend/                        # Spring Boot (Java)
│   ├── pom.xml
│   └── src/main/java/com/sims/
│       ├── SimsApplication.java    # Main entry point
│       ├── controller/             # REST API endpoints
│       │   ├── AuthController.java
│       │   ├── InternshipController.java
│       │   └── ApplicationController.java
│       ├── service/                # Business logic
│       │   ├── AuthService.java
│       │   ├── InternshipService.java
│       │   └── ApplicationService.java
│       ├── repository/             # Database access (JPA)
│       │   ├── UserRepository.java
│       │   ├── InternshipRepository.java
│       │   └── ApplicationRepository.java
│       ├── model/                  # Database entities
│       │   ├── User.java
│       │   ├── Internship.java
│       │   └── Application.java
│       ├── dto/                    # Request/Response objects
│       │   ├── AuthDto.java
│       │   └── InternshipDto.java
│       ├── security/               # JWT implementation
│       │   ├── JwtUtils.java
│       │   ├── JwtAuthFilter.java
│       │   └── UserDetailsServiceImpl.java
│       ├── config/
│       │   └── SecurityConfig.java # Spring Security rules
│       └── exception/
│           └── GlobalExceptionHandler.java
│
├── frontend/                       # React.js
│   ├── package.json
│   └── src/
│       ├── App.js                  # Router + layout
│       ├── index.js                # Entry point
│       ├── context/
│       │   └── AuthContext.js      # Global auth state
│       ├── services/
│       │   ├── api.js              # Axios + JWT interceptor
│       │   └── services.js         # API call functions
│       ├── components/common/
│       │   ├── Navbar.js
│       │   └── ProtectedRoute.js
│       └── pages/
│           ├── HomePage.js
│           ├── LoginPage.js
│           ├── RegisterPage.js
│           ├── DashboardPage.js
│           ├── InternshipsPage.js
│           ├── PostInternshipPage.js
│           └── ApplicationsPage.js
│
├── database/
│   └── schema.sql                  # MySQL schema + sample data
│
└── SIMS_Postman_Collection.json    # API test collection
```

---

## ⚙️ Prerequisites

| Tool          | Version     | Download |
|---------------|-------------|----------|
| Java JDK      | 17+         | https://adoptium.net |
| Maven         | 3.8+        | Bundled with STS |
| Spring Tool Suite (STS) | 4.x | https://spring.io/tools |
| Node.js       | 18+         | https://nodejs.org |
| MySQL Server  | 8.0+        | https://dev.mysql.com/downloads |
| MySQL Workbench (optional) | - | For GUI access |

---

## 🗄️ Step 1: Setup MySQL Database

### Option A — Using MySQL Workbench or MySQL CLI:
```sql
-- Open MySQL Workbench, connect, and run:
source /path/to/sims/database/schema.sql;
```

### Option B — MySQL Command Line:
```bash
mysql -u root -p < database/schema.sql
```

### Option C — Let Spring Boot auto-create tables:
Just create the database manually:
```sql
CREATE DATABASE sims_db;
```
Spring Boot will auto-create all tables on first run (via `spring.jpa.hibernate.ddl-auto=update`).

---

## 🚀 Step 2: Run the Backend (Spring Boot in STS)

### In Spring Tool Suite (STS):

1. Open STS → `File → Import → Existing Maven Projects`
2. Browse to the `backend/` folder → Click **Finish**
3. Wait for Maven to download dependencies (first time ~2 mins)
4. **Update `application.properties`** with your MySQL credentials:
   ```properties
   spring.datasource.username=root
   spring.datasource.password=YOUR_MYSQL_PASSWORD
   ```
5. Right-click `SimsApplication.java` → `Run As → Spring Boot App`
6. Console should show: `✅ SIMS Backend is running at http://localhost:8080`

### Using Maven command line:
```bash
cd backend
mvn spring-boot:run
```

### Verify backend is running:
Open browser → http://localhost:8080/api/internships
You should see a JSON array of internships.

---

## ⚛️ Step 3: Run the Frontend (React)

```bash
# Navigate to frontend folder
cd frontend

# Install dependencies (first time only)
npm install

# Start development server
npm start
```

Browser opens automatically at: **http://localhost:3000**

---

## 🔐 Test Login Credentials

After running `schema.sql`, these accounts are ready:

| Role    | Email                    | Password    |
|---------|--------------------------|-------------|
| Admin   | admin@sims.com           | password123 |
| Company | techcorp@company.com     | password123 |
| Company | innosoft@company.com     | password123 |
| Student | arjun@student.com        | password123 |
| Student | priya@student.com        | password123 |

---

## 📮 Step 4: Test APIs with Postman

1. Open **Postman** → `Import` → select `SIMS_Postman_Collection.json`
2. Run **"Login - Student"** (or any login request)
3. Copy the `token` value from the response
4. In Postman, go to Collection → **Variables** → set `token` = copied value
5. Now all protected requests work automatically!

### API Endpoints Summary:

| Method | Endpoint                     | Auth Required | Role        |
|--------|------------------------------|---------------|-------------|
| POST   | /api/auth/register           | No            | Anyone      |
| POST   | /api/auth/login              | No            | Anyone      |
| GET    | /api/internships             | No            | Anyone      |
| GET    | /api/internships/{id}        | No            | Anyone      |
| POST   | /api/internships             | Yes           | COMPANY     |
| PUT    | /api/internships/{id}        | Yes           | COMPANY     |
| DELETE | /api/internships/{id}        | Yes           | ADMIN       |
| GET    | /api/internships/my-postings | Yes           | COMPANY     |
| POST   | /api/applications            | Yes           | STUDENT     |
| GET    | /api/applications            | Yes           | All roles   |
| GET    | /api/applications/my-applications | Yes      | STUDENT     |
| PUT    | /api/applications/{id}       | Yes           | COMPANY/ADMIN |

---

## 🔄 How JWT Authentication Works

```
1. User POSTs email+password to /api/auth/login
2. Spring Security verifies credentials against DB
3. If valid → Server generates JWT token (signed with secret key)
4. Token is returned to frontend
5. Frontend stores token in localStorage
6. Every subsequent request includes: Authorization: Bearer <token>
7. JwtAuthFilter intercepts request, validates token
8. If valid → user is authenticated, request proceeds
9. If expired/invalid → 401 Unauthorized response
```

---

## 🌐 Frontend Pages

| Page | URL | Access |
|------|-----|--------|
| Home | / | Public |
| Login | /login | Public |
| Register | /register | Public |
| Internships | /internships | Public |
| Dashboard | /dashboard | Logged in |
| Post Internship | /post-internship | Company only |
| Applications | /applications | Logged in |
| My Applications | /my-applications | Student only |

---

## 🛠️ Common Issues & Fixes

### Backend won't start:
- Check MySQL is running: `sudo service mysql start`
- Verify credentials in `application.properties`
- Ensure Java 17+ is installed: `java -version`

### Frontend can't connect to backend:
- Ensure backend is running on port 8080
- Check `package.json` has `"proxy": "http://localhost:8080"`
- Check browser console for CORS errors

### 403 Forbidden errors:
- Make sure you're sending the JWT token in the Authorization header
- Token may have expired (24hr expiry) — login again

### BCrypt password issue:
- The sample passwords in `schema.sql` are BCrypt hashes of `password123`
- Never store plain text passwords!

---

## 🏗️ Tech Stack

**Backend:** Java 17, Spring Boot 3.2, Spring Security, Spring Data JPA, JWT (JJWT), BCrypt, MySQL, Lombok, Maven

**Frontend:** React 18, React Router v6, Axios, Context API, localStorage

**Database:** MySQL 8.0 with foreign key constraints
