# 🎟️ EventSphere (Tukio Hub)

A modern **React-based event discovery web application** powered by the **Ticketmaster Discovery API**.
EventSphere allows users to search, filter, and explore live events such as concerts, sports, theatre, and festivals happening around the world.

---

## 📌 Overview

EventSphere (also referred to as **Tukio Hub / EventPulse**) is designed to solve the problem of scattered event information by providing a **centralized, user-friendly platform** for discovering live events.

This project is currently **frontend-only (React + Vite)** and integrates directly with the Ticketmaster API to fetch real-time event data.

---

## 🚀 Features

### 🔍 Event Discovery

* Search events by keyword (artist, venue, city, etc.)
* Real-time results powered by Ticketmaster API

### 🌍 Region Filtering

* Filter events by:

  * Global
  * Africa
  * Kenya
  * USA
  * UK
  * Canada
  * Australia

### 🎭 Category Filtering

* Browse events by:

  * Music
  * Sports
  * Arts & Theatre
  * Film
  * Miscellaneous

### 📄 Event Cards

Each event displays:

* Event image
* Title
* Date & time
* Venue & location
* Category & genre
* Ticket price range (if available)
* Direct link to purchase tickets

### ⚡ Performance Enhancements

* Debounced search input (reduces API calls)
* Paginated results with “Load More”
* Optimized API request handling

### 🧠 State Handling

* Loading states
* Error handling
* Empty state messaging

---

## 🛠️ Tech Stack

### Frontend

* React (Vite)
* JavaScript (ES6+)
* CSS

### API

* Ticketmaster Discovery API v2

### Tooling

* Git & GitHub
* Vite (development server & build tool)

---

## 📂 Project Structure

```
src/
│
├── assets/
│   ├── hero.png
│   ├── react.svg
│   └── vite.svg
│
├── components/
│   ├── EventCard.jsx
│   ├── EventGrid.jsx
│   ├── FilterBar.jsx
│   ├── NavBar.jsx
│   ├── SearchHero.jsx
│   └── ui/
│       └── StateViews.jsx
│
├── hooks/
│   ├── useDebounce.js
│   ├── useEvents.js
│   └── useLocalStorage.js
│
├── services/
│   └── ticketmasterService.js
│
├── utils/
│   ├── constants.js
│   └── formatters.js
│
├── App.jsx
├── main.jsx
├── App.css
└── index.css
```

---

## ⚙️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
cd YOUR_REPO_NAME
```

---

### 2. Install Dependencies

```bash
npm install
```

---

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```env
VITE_TICKETMASTER_BASE_URL=https://app.ticketmaster.com/discovery/v2
VITE_TICKETMASTER_API_KEY=YOUR_API_KEY_HERE
```

👉 Get your API key from: https://developer.ticketmaster.com/

---

### 4. Run the Development Server

```bash
npm run dev
```

Open in browser:

```
http://localhost:5173
```

---

## 📡 API Integration

This project uses the **Ticketmaster Discovery API v2**.

### Example Endpoint

```
GET /events.json
```

### Sample Request

```
https://app.ticketmaster.com/discovery/v2/events.json?apikey=YOUR_API_KEY
```

### Features Used

* Event search (`keyword`)
* Location filtering (`countryCode`)
* Category filtering (`segmentName`)
* Pagination (`page`, `size`)
* Sorting (`date,asc`)

---

## 🧩 Architecture

### 🔹 Data Flow

```
User Input (Search / Filters)
        ↓
Custom Hook (useEvents)
        ↓
API Service (ticketmasterService.js)
        ↓
Formatter (normalizeTicketmasterEvent)
        ↓
UI Components (EventGrid → EventCard)
```

---

### 🔹 Key Concepts

* **Custom Hooks** handle API logic and state
* **Service Layer** isolates API calls
* **Formatter** normalizes complex API data
* **Components** remain clean and reusable

---


## 🔮 Future Improvements (Phase 2 & 3)

* 🔐 Backend integration (Flask API proxy)
* 👤 User authentication (JWT / Flask-Login)
* ❤️ Save / bookmark events
* 📄 Event detail pages
* 📍 Location-based recommendations
* 🗄️ Database integration

---

## 👥 Team

* **Denis** — Implemented Ticketmaster API integration and handled data fetching logic
* **Samantha** — Built App.jsx and main.jsx, managed application state and integration, and wrote the project README
* **Sharon** — Designed and styled the user interface and overall user experience
* **Eugine** — Developed and structured reusable React components

---

## 📄 License

This project is for educational purposes and portfolio development.

---

## 🙌 Acknowledgements

* Ticketmaster Developer Platform
* React & Vite Community

---

## 💡 Author Notes

This project demonstrates:

* Real-world API integration
* Scalable React architecture
* Clean component design
* State and data flow management

---

