# 🚀 Calorie & Hydration Tracker

A full-stack web app to track daily calorie intake and water consumption with analytics, goals, and a clean modern UI.

---

## 🧠 Features

### 🔐 Authentication
- Signup / Login with secure JWT (HTTP-only cookies)
- Protected routes
- Persistent sessions

### 🍽️ Calorie Tracking
- Add daily meals with calories
- Track breakfast, lunch, dinner, snacks
- View daily summary

### 💧 Hydration Tracking
- Log water intake
- Quick add buttons (+250ml, +500ml, +1L)

### 🎯 Goals
- Set daily calorie & water goals
- Track progress visually

### 👤 Profile
- Store user details:
  - Height
  - Weight
  - Age
  - Goals

---

## 🛠️ Tech Stack

**Frontend:**
- Next.js  
- Tailwind CSS  
- Chart.js  

**Backend:**
- Node.js  
- Express.js  
- Prisma ORM  

**Database:**
- PostgreSQL  

**Deployment:**
- Docker + Docker Compose  

---

## 📁 Project Structure

```
calorie-tracker/
├── backend/
├── frontend/
└── docker-compose.yml
```

---

## ⚙️ Setup Instructions (Local)

### 1️⃣ Clone Repo

```bash
git clone https://github.com/Sachin-crypto/CalhydriTrack.git
cd CalhydriTrack
```

---

### 2️⃣ Backend Setup

```bash
cd backend
npm install
npx prisma migrate dev
node src/server.js
```

---

### 3️⃣ Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

### 4️⃣ Open App

```
http://localhost:3000
```

---

## 🐳 Docker Setup (Recommended)

### Run Full App

```bash
docker compose up --build
```

### Run Migrations

```bash
docker exec -it calorie_backend npx prisma migrate deploy
```

---

## 🚀 Future Improvements

- AI calorie suggestions  
- Mobile app version  
- Notifications & reminders  
- Advanced analytics  

---

## 🤝 Contributing

Feel free to fork and improve this project!

---

## 📄 License

MIT License
