# Next-Gen Department Timetable Scheduler

A **web-based, intelligent Timetable Scheduler** that generates optimized, clash-free, and visually interactive timetables for college departments. Built with **Next.js (TypeScript), Prisma, PostgreSQL, Tailwind CSS, and dnd-kit**.

Think of it as a smarter, adaptive, and fully visual TimetableMaster — no login required.

---

## ✨ Features

### 🔑 Core Features

* **Intelligent Data Input**: Courses, Faculty availability, Classrooms, and Student Groups.
* **Smart Timetable Generation**: Constraint-based scheduling (CSP/Heuristic). Supports clash-free timetables.
* **Advanced Visualization**: Interactive timetable grid, drag-and-drop adjustments, color-coded UI.
* **Analytics & Reports**: Teacher workload, classroom utilization, elective popularity, gap minimization.
* **Dynamic Updates**: Real-time conflict warnings and re-generation on edits.
* **Export Options**: PDF, Excel, image formats.

### 🚀 Next-Level Features

* AI-assisted scheduling suggestions.
* Multiple optimized timetable options with scoring.
* Conflict heatmaps and efficiency reports.
* Fully responsive design for desktop, tablet, and mobile.

---

## 🛠 Tech Stack

* **Frontend**: Next.js (App Router, TypeScript), React, Tailwind CSS, dnd-kit (drag-and-drop)
* **Backend**: Next.js API routes with Prisma ORM
* **Database**: PostgreSQL (via Prisma)
* **Scheduling Algorithm**: Custom CSP/heuristic generator (pluggable with GA/AI)
* **Export Tools**: ExcelJS / Puppeteer (optional for later phases)

---

## 📂 Project Structure

```
next-ts-timetable-scheduler/
├─ app/                  # Next.js App Router pages
│  ├─ layout.tsx         # Root layout
│  ├─ globals.css        # Tailwind global styles
│  ├─ page.tsx           # Dashboard home
│  └─ schedule/          # Schedule-specific pages
├─ components/           # Reusable UI & forms
├─ lib/                  # Scheduler core + DB wrapper
├─ prisma/               # Prisma schema & migrations
├─ pages/api/            # API routes (schedule generation, data management)
├─ types/                # Shared TypeScript types
```

---

## ⚡ Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/your-username/next-ts-timetable-scheduler.git
cd next-ts-timetable-scheduler
```

### 2. Install dependencies

```bash
npm install
```

### 3. Setup environment variables

Create a `.env` file:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/timetable"
```

### 4. Setup database

```bash
npx prisma migrate dev --name init
```

### 5. Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📊 Roadmap

* [x] Database schema & Prisma setup
* [x] Simple greedy scheduler
* [x] Interactive timetable grid
* [ ] Implement advanced CSP/Genetic Algorithm
* [ ] Multi-option timetable generation with scoring
* [ ] Conflict heatmaps & analytics dashboard
* [ ] Export to PDF/Excel
* [ ] AI-assisted adaptive scheduling

---

## 🤝 Contributing

Contributions are welcome! Please open an issue or submit a PR.

---

## 📜 License

MIT License — free to use and modify for educational or production purposes.
