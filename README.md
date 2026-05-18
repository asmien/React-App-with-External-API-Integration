# 🎟️ EventSphere

<div align="center">

### Discover. Save. Organize. Experience.

A modern full-stack event discovery and management platform built with **React**, **Flask**, and **PostgreSQL**.

</div>

---

# ✨ Features

## 👤 Authentication & Roles

* 🔐 JWT Authentication
* 👥 Role-based access control
* 🧑 Regular users
* 🎤 Organizers
* 🛡️ Admin dashboard
* 🔑 Organizer secret access code

---

## 🎫 Event Management

* 🌍 Browse events from multiple sources
* 🎵 Ticketmaster integration
* 🎟️ Eventbrite integration
* 🏠 Local event creation
* 📝 Organizer event submissions
* ✅ Admin approval/rejection workflow
* 🔍 Event search and filtering
* 📄 Event details modal

---

## ❤️ User Features

* 💾 Save favorite events
* ⏰ In-app reminders
* 🔊 Reminder sound notifications
* 📝 Custom reminder messages
* 🗑️ Delete reminders
* 🌙 Dark mode
* 📱 Responsive design
* 🎯 Personalized recommendations

---

## 📊 Analytics & Dashboards

* 📈 Admin analytics dashboard
* 🎤 Organizer dashboard
* 👀 Event approval queue
* 📂 Event status tracking
* 📉 Category statistics

---

# 🛠️ Tech Stack

## Frontend

| Technology      | Purpose                   |
| --------------- | ------------------------- |
| ⚛️ React        | UI Framework              |
| ⚡ Vite          | Development Server        |
| 🎨 CSS          | Styling                   |
| 💾 LocalStorage | Persistent frontend state |
| 🌐 Fetch API    | API communication         |

---

## Backend

| Technology            | Purpose              |
| --------------------- | -------------------- |
| 🐍 Flask              | Backend framework    |
| 🗄️ PostgreSQL        | Database             |
| 🔑 Flask-JWT-Extended | Authentication       |
| 🔒 Flask-Bcrypt       | Password hashing     |
| 🌍 Flask-CORS         | Cross-origin support |
| 📦 SQLAlchemy         | ORM                  |
| ✅ Marshmallow         | Validation           |

---

# 📁 Project Structure

```txt
EventSphere/
│
├── backend/
│   ├── app/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── schemas/
│   │   ├── services/
│   │   ├── __init__.py
│   │   └── config.py
│   │
│   ├── requirements.txt
│   └── run.py
│
├── frontend/
│   ├── public/
│   │   └── sound.mp3
│   │
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   └── package.json
│
└── README.md
```

---

# ⚙️ Environment Variables

## 🔧 Backend `.env`

Create a `.env` file inside:

```txt
backend/.env
```

```env
SECRET_KEY=your-secret-key
JWT_SECRET_KEY=your-jwt-secret

FLASK_ENV=development

DATABASE_URL=postgresql://eventsphere_user:eventsphere_password@localhost:5432/eventsphere_db

EVENTBRITE_PRIVATE_TOKEN=your-eventbrite-token
EVENTBRITE_ORG_ID=your-eventbrite-org-id

TICKETMASTER_API_KEY=your-ticketmaster-api-key

ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your-admin-password

ORGANIZER_SECRET_CODE=EVENTSPHERE-ORG-2026
```

---

## 🎨 Frontend `.env`

Create:

```txt
frontend/.env
```

```env
VITE_API_URL=http://localhost:5000/api
```

---

# 🗄️ PostgreSQL Setup

## ▶️ Start PostgreSQL

```bash
sudo service postgresql start
```

---

## 🧠 Open PostgreSQL

```bash
sudo -u postgres psql
```

---

## 🏗️ Create Database & User

```sql
CREATE USER eventsphere_user WITH PASSWORD 'eventsphere_password';

ALTER USER eventsphere_user CREATEDB;

CREATE DATABASE eventsphere_db OWNER eventsphere_user;

GRANT ALL PRIVILEGES ON DATABASE eventsphere_db TO eventsphere_user;

\c eventsphere_db

ALTER SCHEMA public OWNER TO eventsphere_user;

GRANT ALL ON SCHEMA public TO eventsphere_user;

\q
```

---

# 🚀 Backend Setup

## 📦 Install Dependencies

```bash
cd backend

python3 -m venv venv

source venv/bin/activate

pip install -r requirements.txt
```

---

## ▶️ Run Backend

```bash
python3 run.py
```

Expected:

```txt
Running on http://127.0.0.1:5000
```

---

## 🧪 Test Backend

```bash
curl http://127.0.0.1:5000/
```

Expected:

```json
{
  "message": "EventSphere Backend API Running",
  "status": "healthy"
}
```

---

# 🎨 Frontend Setup

Open a second terminal:

```bash
cd frontend

npm install

npm run dev
```

Expected:

```txt
http://localhost:5173
```

---

# 🧪 Testing the App

## 👤 Regular User

* Register/Login
* Browse events
* Search events
* Save favorite events
* Set reminders
* Delete reminders
* View recommendations

---

## 🎤 Organizer

Use organizer access code:

```txt
EVENTSPHERE-ORG-2026
```

Then:

* Create events
* Submit for approval
* View organizer dashboard

---

## 🛡️ Admin

Admin can:

* Approve/reject events
* View analytics dashboard
* Monitor event statistics
* Manage pending events

---

# ⏰ Reminder System

EventSphere includes an advanced in-app reminder system.

## ✨ Features

* 🔊 Plays looping sound notifications
* 📝 Displays saved custom reminder message
* 📌 Persistent notification until dismissed
* ❌ Stops only when user presses X

---

## 🧪 Reminder Testing

1. Login
2. Save an event ❤️
3. Open Saved Events
4. Click **Set Reminder**
5. Set reminder a few minutes in the future
6. Add a custom reminder note
7. Keep the app open

When the reminder triggers:

* ⏰ Toast notification appears
* 🔊 `sound.mp3` loops
* 📝 Saved message is displayed
* ❌ User must dismiss it manually

---

## 🔊 Reminder Audio

Place your sound file here:

```txt
frontend/public/sound.mp3
```

---

# 🔗 Useful API Tests

## 🔐 Login

```bash
curl -X POST http://127.0.0.1:5000/api/auth/login \
-H "Content-Type: application/json" \
-d '{
  "email":"admin@example.com",
  "password":"your-admin-password"
}'
```

---

## 🎫 Set Token

```bash
export TOKEN="paste_access_token_here"
```

---

## 👤 Current User

```bash
curl http://127.0.0.1:5000/api/auth/me \
-H "Authorization: Bearer $TOKEN"
```

---

## 📊 Analytics

```bash
curl http://127.0.0.1:5000/api/admin/analytics \
-H "Authorization: Bearer $TOKEN"
```

---

## 🎯 Recommendations

```bash
curl http://127.0.0.1:5000/api/recommendations \
-H "Authorization: Bearer $TOKEN"
```

---

## ❤️ Saved Events

```bash
curl http://127.0.0.1:5000/api/user/saved-events \
-H "Authorization: Bearer $TOKEN"
```

---

## ⏰ Reminders

```bash
curl http://127.0.0.1:5000/api/user/saved-events/reminders \
-H "Authorization: Bearer $TOKEN"
```

---

# 👩‍💻 Author

### Samantha Bora

Built with ❤️ using React, Flask, and PostgreSQL.
