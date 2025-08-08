

# PETIFY – Modern Pet Adoption & Donation Platform

![Petify Responsive UI Screenshot](https://i.postimg.cc/Wp0mZQvF/petify-ui.png)

**Live website:** [https://petify-us.web.app](https://petify-us.web.app)

---

# About Petify


Petify is a full-stack web app built with the MERN stack (MongoDB, Express.js, React, Node.js), Vite, Tailwind CSS, and Firebase—enabling seamless pet adoption, donation campaigns, secure Stripe payments, and animal welfare with a modern UI, secure authentication, and real-time features for users and admins.

Built with **React, Vite, Tailwind CSS, Firebase, Express,Node & MongoDB**

## Related Repositories

- **Client-side:** [Petify Client Side Repo](https://github.com/omarfaruk-dev/petify-client)
- **Server-side:** [Petify Server Side Repo](https://github.com/omarfaruk-dev/petify-server)


## Key Features

- **Home & Hero Section:**
  - Eye-catching hero banner with tagline and call-to-action.
- **Pet Listing & Details:**
  - Browse, filter, and view detailed pet profiles with images, info, and adoption status.
- **Adoption Requests:**
  - Secure, user-friendly adoption request flow with status tracking.
- **Donation Campaigns:**
  - Create, manage, and donate to campaigns for animal welfare.
- **Secure Payment with Stripe:**
  - Make safe and reliable donations using integrated Stripe payment.
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
- **API & Data:**
  - Axios
  - Firebase
- **UI/UX & Animation:**
  - React Icons
  - Swiper (sliders)
  - SweetAlert2 (alerts)
  - React CountUp (animated numbers)
  - Recharts (charts/graphs)
  - React Loading Skeleton
  - React Select
  - Framer Motion
- **Utilities:**
  - React Hook Form
  - @tanstack/react-query
  - React Intersection Observer
  - Infinite Scroll
  - Slate
- **Backend:**
  - Express.js (REST API)
  - MongoDB (Database)
  - Stripe (Payment Integration)
  - JSON Web Token (JWT) Authentication

...existing code...


## Getting Started

1. **Clone the repository:**
   ```bash
   git clone https://github.com/omarfaruk-dev/petify-client.git
   cd petify-client
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Start the development server:**
   ```bash
   npm run dev
   ```

### Install Required Packages

```bash
npm install axios react-loading-skeleton @tanstack/react-query react-intersection-observer framer-motion react-hook-form react-icons react-select recharts slate sweetalert2
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

---

**Petify** – Adopt, Donate, and Make a Difference 🐾
