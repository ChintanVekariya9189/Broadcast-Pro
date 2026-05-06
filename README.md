# 📺 Broadcast Pro: Content Broadcasting System

Broadcast Pro is a premium, production-ready frontend for educational environments. It enables teachers to upload lessons, principals to moderate content, and students to view live broadcasts in real-time.

---

## ✨ Key Features

### 👨‍🏫 Teacher Module
- **Content Upload**: Intuitive form with image validation and scheduling.
- **Advanced Scheduling**: Set specific dates and times for broadcasts with auto-rotation durations.
- **Content Management**: Track approval status (Pending, Approved, Rejected).
- **Edit Workflow**: Easily fix rejected content with pre-filled forms for quick resubmission.

### 👩‍💼 Principal Module
- **Dashboard Analytics**: Overview of system-wide content statistics.
- **Approval Queue**: Dual-pane review interface with high-fidelity previews.
- **Detailed Moderation**: Approve lessons or reject them with specific feedback for teachers.
- **Global Repository**: Search and filter all content by status, subject, or teacher.

### 🎓 Student Portal (Public)
- **Live Now Dashboard**: A real-time hub showing all active lessons across the school.
- **Teacher Directory**: Search and find specific teacher classrooms.
- **Cinematic Broadcast**: Full-screen viewing experience with auto-rotation and live indicators.
- **No Login Required**: Seamless access for students to join classrooms.

---

## 🛠️ Technology Stack

- **Core**: Next.js 15+ (App Router)
- **Styling**: Tailwind CSS with @tailwindcss/postcss
- **Animations**: Framer Motion
- **State Management**: TanStack Query (React Query)
- **Form Handling**: React Hook Form & Zod
- **Icons**: Lucide React
- **Notifications**: Sonner

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (Latest LTS recommended)
- npm or yarn

### 2. Installation
```bash
# Install dependencies
npm install
```

### 3. Start Development Server
```bash
npm run dev
```
The application will be available at `http://localhost:3000`.

---

## 🔑 Demo Credentials

| Role | Email | Password | Teacher ID |
| :--- | :--- | :--- | :--- |
| **Teacher** | `teacher@school.com` | `password` | `t1` |
| **Principal** | `principal@school.com` | `password` | - |

---

## 📁 Project Structure

- `src/app`: Next.js pages and layouts.
- `src/components/ui`: Core reusable design system components.
- `src/components/shared`: Complex business components (DashboardLayout, DetailModals).
- `src/context`: Authentication and global state providers.
- `src/services`: Mock API layer for content and authentication.
- `src/utils`: Helper functions and shared utilities.

---

## 🎨 Design Principles

- **Premium Aesthetic**: Dark-themed UI with glassmorphism and subtle gradients.
- **Responsive Design**: Fully optimized for mobile, tablet, and desktop.
- **Micro-interactions**: Smooth transitions and hover effects using Framer Motion.
- **Reliability**: Robust form validation and edge-case handling (empty states, loading spinners).

---

## 📄 License

**All Rights Reserved.** 

Copyright © 2026. This project and its source code are proprietary. Unauthorized copying, modification, or distribution of this code is strictly prohibited. 

This repository is shared solely for evaluation and portfolio review purposes.

---

Developed with ❤️
