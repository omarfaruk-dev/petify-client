import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router'
import AuthProvider from './contexts/AuthProvider'
import router from './router/router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Import AOS CSS and JS
import 'aos/dist/aos.css'
import AOS from 'aos'

const queryClient = new QueryClient();

// Initialize AOS
const initAOS = () => {
  AOS.init({
    // Global settings:
    duration: 800,     // values from 0 to 3000, with step 50ms
    once: true,        // whether animation should happen only once - while scrolling down
    mirror: false,     // whether elements should animate out while scrolling past them
    easing: 'ease-in-out', // default easing for AOS animations
    delay: 0,          // default delay before animation starts
    offset: 120,       // offset (in px) from the original trigger point
    anchorPlacement: 'top-bottom', // defines which position of the element regarding to window should trigger the animation
  });
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router}></RouterProvider>
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>,
)

// Initialize AOS after the app renders
initAOS();
