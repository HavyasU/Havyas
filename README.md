# 🚀 Havyas U — Developer Portfolio & Dynamic CMS

A modern, responsive, and animated personal portfolio and full-stack Content Management System (CMS) built with **Next.js**, **React**, **TypeScript**, **Tailwind CSS**, and **Firebase**.

![Portfolio Preview](public/images/havyasRai.jpg)

---

## ✨ Features

### 🌟 Public Portfolio
- **Modern UI & Aesthetic**: Sleek dark/light theme switching with smooth transitions and glassmorphism styling.
- **Rich Animations**: Interactive animations powered by **Framer Motion**, **GSAP**, and **Lenis** smooth scrolling.
- **Dynamic Projects Showcase**: Filterable project gallery with detailed dynamic case study pages (`/projects/[id]`).
- **Interactive Experience & Education Timelines**: Chronological breakdown of professional background, skills, and qualifications.
- **Client Testimonials & Services**: Interactive carousels and cards powered by **Swiper**.
- **Contact & Inquiry System**: Real-time form submissions stored directly to Firebase Firestore with client-side validation.

### 🛠️ Admin CMS Dashboard (`/admin`)
- **Secure Authentication**: Firebase Auth protected routes for portfolio administration.
- **Projects / Works Management**: Full CRUD capabilities to create, edit, update, and delete featured projects.
- **Experience & Education Management**: Manage work history, roles, milestones, and degrees on the fly.
- **Services & Testimonials CRUD**: Live management of offerings and recommendations.
- **Inquiries Inbox**: View, manage, and respond to incoming contact messages from clients and recruiters.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **UI & Styling**: [Tailwind CSS v4](https://tailwindcss.com/), [Lucide React](https://lucide.dev/), [Font Awesome](https://fontawesome.com/)
- **Animations & Smooth Scroll**: [Framer Motion](https://www.framer.com/motion/), [GSAP](https://greensock.com/gsap/), [@gsap/react](https://greensock.com/react/), [Lenis](https://lenis.darkroom.engineering/)
- **Database & Auth**: [Firebase](https://firebase.google.com/) (Authentication & Cloud Firestore)
- **Forms**: [React Hook Form](https://react-hook-form.com/)
- **Analytics**: [@vercel/analytics](https://vercel.com/analytics)

---

## 📁 Project Structure

```text
├── public/                # Static assets (images, icons, resume)
├── src/
│   ├── app/               # Next.js App Router routes
│   │   ├── admin/         # CMS Dashboard (Login, Works, Inquiries, etc.)
│   │   ├── contact/       # Contact page
│   │   ├── projects/      # Project list & [id] dynamic routes
│   │   ├── globals.css    # Global CSS & Tailwind design tokens
│   │   ├── layout.tsx     # Root layout with Providers, Navbar & Footer
│   │   └── page.tsx       # Landing portfolio homepage
│   ├── components/        # Reusable UI components & providers
│   │   ├── motion/        # Animated motion wrappers
│   │   ├── providers/     # SmoothScroll, Theme & Auth context providers
│   │   ├── Navbar.tsx     # Navigation bar
│   │   └── Footer.tsx     # Application footer
│   ├── lib/               # Firebase setup, auth state, and data fetching helpers
│   └── types/             # TypeScript type definitions
├── firestore.rules        # Security rules for Cloud Firestore
└── .env.local.example     # Template for environment variables
```

---

## 🚀 Getting Started

### 1. Prerequisites
Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18.18+ or v20+ recommended)
- [npm](https://www.npmjs.com/) or `yarn` / `pnpm` / `bun`

### 2. Clone Repository & Install Dependencies
```bash
git clone https://github.com/HavyasU/Havyas.git
cd Havyas
npm install
```

### 3. Environment Setup
Copy the example environment file and add your Firebase project credentials:

```bash
cp .env.local.example .env.local
```

Configure the following variables in `.env.local`:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 4. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to explore the portfolio.

---

## 🔒 Security & Firestore Rules

Deploy the Firestore security rules located in [`firestore.rules`](file:///c:/Users/havya/Havyas/firestore.rules) to ensure public write access is strictly limited to contact inquiries while administrative CRUD operations require authentication:

```bash
firebase deploy --only firestore:rules
```

---

## 📦 Scripts

- `npm run dev` — Starts the development server with Turbopack / local binding.
- `npm run build` — Creates an optimized production build.
- `npm run start` — Runs the built application in production mode.
- `npm run lint` — Runs ESLint checks.

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
