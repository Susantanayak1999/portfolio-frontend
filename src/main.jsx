import React, { useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import Admin from './Admin.jsx'
import ResumeViewer from './ResumeViewer.jsx'
import './index.css'
import { createBrowserRouter, RouterProvider, useLocation } from 'react-router-dom'

// 👇 THIS IS THE FIX 👇
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Get the section ID from the URL (e.g., "/work" -> "work")
    const sectionId = pathname.replace('/', '');
    
    if (sectionId && sectionId !== '') {
      // Wait a brief moment for the page to render, then scroll
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100); 
    } else {
      // If we are on the home page "/", scroll to the top
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  return null; // This component doesn't render anything visually
}

// Wrap the App with the ScrollToTop component
const AppWrapper = () => (
  <>
    <ScrollToTop />
    <App />
  </>
);

const router = createBrowserRouter([
  { path: "/", element: <AppWrapper /> },
  { path: "/services", element: <AppWrapper /> },
  { path: "/skills", element: <AppWrapper /> },
  { path: "/work", element: <AppWrapper /> },
  { path: "/experience", element: <AppWrapper /> },
  { path: "/admin", element: <Admin /> },
  { path: "/view-resume", element: <ResumeViewer /> }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)