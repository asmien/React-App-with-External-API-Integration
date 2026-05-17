# 🎟️ EventSphere – Full-Stack Event Discovery Platform

EventSphere is a modern full-stack event discovery platform that allows users to explore concerts, festivals, conferences, workshops, and local experiences from multiple event providers in one centralized application.

The platform combines external event APIs, custom local event management, authentication, saved events functionality, and a responsive user experience powered by a React frontend and Flask backend.

---

# ✨ Features

## 🎨 Frontend Features

- Modern responsive landing page
- Dynamic animated hero section
- Event search functionality
- Event source filtering
- Interactive event cards
- Event detail modal
- Saved/favorite events system
- My Events dashboard
- Create custom local events
- Authentication modal
- Toast notifications
- Loading and error states
- Mobile responsive design

---

## ⚙️ Backend Features

- Flask REST API architecture
- SQLite database integration
- Planned PostgreSQL migration support
- SQLAlchemy ORM
- Authentication system
- Token-based authorization
- CRUD functionality for events
- Saved events functionality
- External API integrations
- Global exception handling
- Environment configuration support
- Alembic database migrations

---

# 🛠️ Tech Stack

## Frontend

| Technology | Purpose |
|---|---|
| React | Frontend framework |
| Vite | Frontend tooling |
| JavaScript | Application logic |
| CSS3 | Styling and responsive design |
| Fetch API | API communication |

---

## Backend

| Technology | Purpose |
|---|---|
| Flask | Backend framework |
| SQLAlchemy | ORM |
| Flask-Migrate | Database migrations |
| SQLite | Current development database |
| PostgreSQL | Planned production database |
| Alembic | Migration management |
| Python | Backend programming |

---

# 🔌 API Integrations

## 🎤 Ticketmaster API

Used for:
- concerts
- sports events
- entertainment events

## 🎫 Eventbrite API

Used for:
- conferences
- workshops
- local experiences
- community events

---

# 🗄️ Database Architecture

## Models

### 👤 User
Stores:
- username
- email
- password hash

### 📅 Event
Stores:
- title
- description
- date
- location
- category
- image
- source

### ❤️ SavedEvent
Relationship table connecting:
- users
- saved events

### 🎟️ Ticket
Stores:
- ticket information
- purchases
- pricing

---

# 🔐 Authentication Features

Users can:

- Register accounts
- Login/logout
- Save events
- Create events
- Access personalized event data

Authentication includes:

- password hashing
- protected routes
- token-based authorization

---

# 🔄 CRUD Functionality

| Operation | Supported |
|---|---|
| Create | ✅ |
| Read | ✅ |


---

# 📁 Project Structure

```bash
React-App-with-External-API-Integration/
│
├── backend/
│   ├── app/
│   ├── migrations/
│   ├── requirements.txt
│   ├── alembic.ini
│   └── run.py
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── README.md
└── .gitignore
```

---

# 🚀 Installation & Setup

## 1️⃣ Clone Repository

```bash
git clone https://github.com/Kip-opp/React-App-with-External-API-Integration.git
```

---

# 🎨 Frontend Setup

## Navigate to Frontend

```bash
cd frontend
```

## Install Dependencies

```bash
npm install
```

## Run Frontend

```bash
npm run dev
```

Frontend runs on:

```bash
http://localhost:5173
```

---

# ⚙️ Backend Setup

## Navigate to Backend

```bash
cd backend
```

## Create Virtual Environment

```bash
python3 -m venv venv
```

## Activate Virtual Environment

```bash
source venv/bin/activate
```

## Install Dependencies

```bash
pip install -r requirements.txt
```

---

# 🌍 Environment Variables

Create a `.env` file inside the backend folder:

```env
DATABASE_URL=sqlite:///app.db
SECRET_KEY=your_secret_key

EVENTBRITE_PRIVATE_TOKEN=your_token
EVENTBRITE_ORG_ID=your_org_id

TICKETMASTER_API_KEY=your_api_key
```

---

# 🧱 Database Setup

Run migrations:

```bash
flask db upgrade
```

---

# ▶️ Start Backend Server

```bash
python run.py
```

Backend runs on:

```bash
http://127.0.0.1:5555
```

---

# 🧪 Testing

## Backend Testing

Test API endpoints using:
- Postman
- Thunder Client
- Frontend integration

## Frontend Testing

Verify:
- authentication
- event creation
- event search
- event filtering
- saved events
- API integration
- responsive design

---

# 📈 Development Workflow

SQLite was initially used during backend development because it:
- simplified local setup
- enabled faster testing
- reduced configuration overhead

PostgreSQL is planned for future deployment because it provides:
- better scalability
- stronger relational database support
- improved concurrency handling
- production-ready database architecture

---

# 📌 Current Completed Features

## ✅ Backend

- Authentication system
- Backend security
- User models and schemas
- Shared backend dependencies
- Saved events system
- Ticket purchase logic
- Global exception handling
- API integrations

---

## ✅ Frontend

- Landing page redesign
- Hero section UI
- Event grid system
- Responsive event cards
- Authentication modal
- Saved events page
- Create event form
- My Events dashboard
- Source filtering
- Search functionality

---

# 🔮 Future Improvements

- Pagination
- Cloud deployment
- Dark mode
- User profile editing
- Real-time notifications
- Event analytics dashboard

---

# 👥 Team & Contributions

| Team Member | Contributions |
|---|---|
| **Samantha** | Built `App.jsx` and `main.jsx`, managed application state and frontend integration, implemented backend authentication system, configured backend security, created shared dependencies, implemented authentication logic, created user models/schemas, built authentication endpoints, configured backend logging, created backend documentation, environment configuration support, and contributed to UI redesign |
| **Sharon** | Designed and styled the frontend user interface, created event database models/schemas/repositories, implemented event service logic, built event API endpoints, and contributed recommendation system logic |
| **Denis** | Implemented Ticketmaster API integration, handled frontend data fetching logic, created ticket database models/schemas/repositories, implemented ticket purchase logic, and built ticket API endpoints |
| **Engine** | Developed reusable React components, structured frontend component architecture, created saved event database models/schemas/repositories, implemented saved event logic, and built saved events API endpoints |

---

# 📜 License

This project was developed for educational purposes.