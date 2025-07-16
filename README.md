
# Petify – Modern Pet Adoption & Donation Platform

**Live Site:** [https://petify-us.web.app](https://petify-us.web.app)

Client Repo: [https://github.com/Programming-Hero-Web-Course4/b11a12-client-side-omarfaruk-dev](https://github.com/Programming-Hero-Web-Course4/b11a12-client-side-omarfaruk-dev)

Server Repo: [https://github.com/Programming-Hero-Web-Course4/b11a12-server-side-omarfaruk-dev](https://github.com/Programming-Hero-Web-Course4/b11a12-server-side-omarfaruk-dev)

Petify is a modern, visually engaging web application for pet adoption, donation campaigns, and community-driven animal welfare. Built with React, Vite, and Tailwind CSS, it offers a seamless experience for discovering, adopting, and supporting pets in need.

## Key Features

- **Home & Hero Section:**
  - Eye-catching hero slider and call-to-action.
- **Pet Listing & Details:**
  - Browse, filter, and view detailed pet profiles with images, info, and adoption status.
- **Adoption Requests:**
  - Secure, user-friendly adoption request flow with status tracking.
- **Donation Campaigns:**
  - Create, manage, and donate to campaigns for animal welfare.
- **User Dashboard:**
  - Personalized dashboard for managing pets, campaigns, donations, and profile.
- **Admin Panel:**
  - Manage users, pets, and donations with role-based access.
- **Authentication:**
  - Secure login, registration, and social auth (Google, Github) via Firebase.
- **Responsive Design:**
  - Fully responsive, mobile-friendly layouts and navigation.
- **Dark/Light Theme Toggle**
- **Loading Spinners, Alerts, and Animations**

## Tech Stack & Packages

- **Frontend:** React, Vite, Tailwind CSS, DaisyUI
- **Routing:** React Router
- **State & Context:** React Context API
- **API & Data:** Axios, Firebase
- **UI/UX:**
  - React Icons
  - Swiper (sliders)
  - SweetAlert2 (alerts)
  - React CountUp (animated numbers)
  - Recharts (charts/graphs)
- **Utilities:**
  - React Hook Form
  - React Query
  - Infinite Scroll

## Getting Started

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Programming-Hero-Web-Course4/b11a12-client-side-omarfaruk-dev
   cd b11a12-client-side-omarfaruk-dev
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Start the development server:**
   ```bash
   npm run dev
   ```

## Folder Structure

- `src/pages/` – Main pages (Home, PetListing, PetDetails, Dashboard, etc.)
- `src/components/` – Reusable UI components (ThemeToggle, Spinner, etc.)
- `src/contexts/` – Auth context and provider
- `src/firebase/` – Firebase config
- `src/assets/` – Images and static assets
- `src/layouts/` – Main layout wrappers
- `src/hooks/` – Custom React hooks

## Customization
- Update branding, images, and content in `src/assets/` and relevant components.
- Configure Firebase in `src/firebase/firebase.init.js`.
- Adjust theme and colors in `tailwind.config.js` and DaisyUI settings.

## Credits
- Pet images: Unsplash, Pexels, and custom assets
- Icons: [React Icons](https://react-icons.github.io/react-icons/)
- UI Libraries: Swiper, DaisyUI, SweetAlert2, Recharts

---

**Petify** – Adopt, Donate, and Make a Difference 🐾
