# 🐾 Dyreklinikk – Veterinary Booking Platform (Frontend)

🛠️ Project Background

This is a frontend project I built in my free time. It was originally meant to work with a backend API, but since I don’t have access to that backend anymore (the API isn’t publicly available), I replaced it with a dummy backend using static data.

All the data is provided through a local file called mockRepo.ts, which simulates API calls so the app can run without a real server.

The frontend is built as a modern React + TypeScript single-page application, using:

Vite for fast development and build

TailwindCSS and custom CSS for styling

Even without the original backend, the application works fully in the browser thanks to mock data and local state management.

---

## ✅ Tech Stack

**Core**
- React 18
- TypeScript
- Vite

**Routing & Forms**
- React Router DOM
- React Hook Form
- React Datepicker

**State Management**
- Zustand

**HTTP & Utilities**
- Axios
- Date-fns

**Styling**
- TailwindCSS
- Custom CSS modules

**Tooling**
- ESLint
- Prettier
- TypeScript Compiler

---

## ✅ Project Structure


> **Recommended Node version:** **Node.js 18+ (LTS)**

---

## 📦 Getting Started

1. **Install dependencies**
   ```bash
   npm install

| Script            | Description                          |
  | ----------------- | ------------------------------------ |
| `npm run dev`     | Start Vite development server        |
| `npm run build`   | Compile TypeScript + build with Vite |
| `npm run preview` | Preview the production build locally |
| `npm run lint`    | Run ESLint for code quality          |

