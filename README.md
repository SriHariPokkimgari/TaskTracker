# Premium MERN Tasks Dashboard 🚀

A modern, responsive task management application built using the MERN stack (MongoDB, Express, React, Node.js) with clean dashboard visualizations, Scrum board toggles, tags, due date overdue notifications, and built-in user authentication.

---

## ✨ Features

- **🔐 Robust Authentication:** Secure Login and Sign-up screens with cookie-based session management (`JWT`).
- **📋 Dual Layouts:** Seamless toggle between a vertical **List View** and a **Board View** (Scrum columns: To Do, In Progress, Done).
- **🌗 Dark / Light Mode:** Adaptive theme styling with persistent settings saved in local storage.
- **📈 Real-time Analytics:** Clickable status counters in the header showing stats for To Do, In Progress, and Resolved tasks.
- **🏷️ Tag Filtering:** Sort and clean task flows instantly by category tags (`Design`, `Engineering`, `Research`, `Marketing`, `Ops`, `Strategy`).
- **⏳ Alert Indicators:** Visual overdue warnings for incomplete tasks that have passed their target dates.

---

## 🛠️ Tech Stack

### Backend
- **Node.js** & **Express** — REST APIs and auth routes.
- **MongoDB** & **Mongoose** — Schemas for Tasks and Users.
- **JWT & Bcrypt** — Password hashing and token authentication.
- **Cookie Parser** — HttpOnly credentials management.

### Frontend
- **React.js** — Component architecture & single page routing.
- **Axios** — Client API helpers.
- **Tailwind CSS v4** — Custom animations and utility theme tokens.
- **Google Fonts** — JetBrains Mono & Inter typography.

---

## 📂 Project Structure

```text
TaskTracker/
├── server/                         # Express Backend
│   ├── middleware/                 # Token Auth middleware
│   ├── models/                     # Mongo Schemas (Auth, Task)
│   ├── routes/                     # Auth routes, task CRUD routes
│   └── server.js                   # Express application entry
│
└── client/                         # React Frontend
    ├── index.html                  # Fonts and meta tags
    ├── src/
    │   ├── api/                    # Axios clients (authApi, taskApi)
    │   ├── components/             # Reusable UI components
    │   └── App.jsx                 # Routes and theme config
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js installed locally.
- MongoDB running locally (default: `mongodb://localhost:27017/taskmanager`) or a MongoDB Atlas connection string.

### Configuration
Create a `.env` file in the `server` directory:
```env
MONGO_URI=mongodb://localhost:27017/taskmanager
PORT=5000
JWT_SECRET=your_super_secret_jwt_key
```

### Installation

1. **Clone & Setup Backend:**
   ```bash
   cd server
   npm install
   npm run dev
   ```

2. **Setup Frontend:**
   ```bash
   cd ../client
   npm install
   npm run dev
   ```

3. **Visit the app:**
   Open [http://localhost:5173/](http://localhost:5173/) in your browser.
