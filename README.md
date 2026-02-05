# TaskFlow — Task Management System

TaskFlow is a full-stack task management application built with React, Node.js, Express, and MongoDB.

The goal of this project was to build a clean and responsive Kanban-style task board with authentication, drag-and-drop functionality, filtering, search, pagination, and a modern dark/light UI.

---

## Features

- User authentication (JWT based)
- Create, update, delete tasks
- Drag & drop tasks between statuses
- Focus mode (expand one column while others collapse)
- Search and filter tasks
- Pagination support
- Dark / Light theme
- Responsive layout

---

## Tech Stack

**Frontend**
- React (Hooks)
- React Router
- Tailwind CSS
- Vite
- @hello-pangea/dnd (Drag & Drop)

**Backend**
- Node.js
- Express
- MongoDB (Mongoose)
- JWT Authentication
- bcryptjs

---

## Screenshots


![Login Page](./screenshots/Login.png)
![Register Page](./screenshots/register.png)
![Light Theme](./screenshots/Light.png)
![Dark Theme](./screenshots/Dark.png)
![New Task Modal](./screenshots/New-Task.png)


## Step 1: Clone / Open the Project

Ensure you're in the project root:

```bash
cd "d:\projects\Task Management System"
```

---

## Step 2: Backend Setup

### 2.1 Install dependencies

```bash
cd server
npm install
```

### 2.2 Environment variables

Create a `.env` file in the `server` folder (copy from `.env.example`):

```bash
# Windows (PowerShell)
copy .env.example .env

# Or create manually: server/.env
```

Edit `server/.env` and set:

| Variable       | Description                    | Example                          |
|----------------|--------------------------------|----------------------------------|
| `PORT`         | API server port                | `5000`                           |
| `MONGODB_URI`  | MongoDB connection string      | `mongodb://localhost:27017/task-management` |
| `JWT_SECRET`   | Secret for signing JWT tokens  | Use a long random string in production |

**Example `.env`:**

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/task-management
JWT_SECRET=your-super-secret-jwt-key-change-in-production
```

For **MongoDB Atlas**, use a connection string like:

```
MONGODB_URI=mongodb+srv://USER:PASSWORD@cluster.xxxxx.mongodb.net/task-management?retryWrites=true&w=majority
```

### 2.3 Start MongoDB (if local)

- **Windows:** Start MongoDB service or run `mongod`.
- **Mac/Linux:** `sudo systemctl start mongod` or `mongod`.

### 2.4 Run the backend

```bash
# From server folder
npm run dev
```

Server runs at **http://localhost:5000**. You should see: `Server running on http://localhost:5000`.

---

## Step 3: Frontend Setup

Open a **new terminal** and go to the project root, then into `client`:

```bash
cd "d:\projects\Task Management System\client"
npm install
```

### 3.1 Run the frontend

```bash
npm run dev
```

Frontend runs at **http://localhost:3000**. The Vite config proxies `/api` to `http://localhost:5000`, so API calls work without CORS issues.

---

## Step 4: Use the Application

1. Open **http://localhost:3000** in your browser.
2. **Register** a new account (name, email, password).
3. **Login** with the same credentials.
4. **Create** tasks (title, description, status).
5. **View** your tasks, **filter** by status, **search**, and use **pagination**.
6. **Edit** or **Delete** tasks from the list.

---

## Project Structure

```
Task Management System/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI (Layout, TaskCard, TaskForm)
│   │   ├── context/        # AuthContext, #ThemeContext
│   │   ├── pages/          # Login, Register, TaskList
│   │   ├── services/       # API (api.js, authService, taskService)
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
├── server/                 # Node + Express backend
│   ├── controllers/        # authController, taskController
│   ├── middleware/         # auth.js (JWT protect)
│   ├── models/             # User, Task
│   ├── routes/             # auth, tasks
│   ├── .env.example
│   ├── package.json
│   └── server.js
└── README.md
```

---

## API Overview

| Method | Endpoint           | Description        | Auth   |
|--------|--------------------|--------------------|--------|
| POST   | `/api/auth/register` | Register user      | No     |
| POST   | `/api/auth/login`    | Login              | No     |
| GET    | `/api/auth/me`      | Current user       | Yes    |
| GET    | `/api/tasks`        | List tasks (filter, search, pagination) | Yes |
| GET    | `/api/tasks/:id`    | Get one task       | Yes    |
| POST   | `/api/tasks`        | Create task        | Yes    |
| PUT    | `/api/tasks/:id`    | Update task        | Yes    |
| DELETE | `/api/tasks/:id`    | Delete task        | Yes    |

Query params for `GET /api/tasks`:

- `page` — page number (default 1)
- `limit` — items per page (default 10)
- `status` — filter: `Pending` | `In Progress` | `Completed`
- `search` — search in title and description

---

## Build for Production

**Backend:**

```bash
cd server
# Set NODE_ENV=production and use a strong JWT_SECRET
npm start
```

**Frontend:**

```bash
cd client
npm run build
```

Serve the `client/dist` folder with any static file server (e.g. Nginx, or `npm run preview` for a quick check).

---

## Troubleshooting

- **"MongoDB connection error"** — Ensure MongoDB is running and `MONGODB_URI` in `server/.env` is correct.
- **401 on API calls** — Login again; token may be expired or missing.
- **CORS errors** — Backend allows `http://localhost:3000`; frontend should use the Vite proxy (`/api`) when running with `npm run dev`.

---

