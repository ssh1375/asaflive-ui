// import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./features/theme/ThemeProvider.tsx";
import { Toaster } from "react-hot-toast";

import "./index.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(

  <BrowserRouter>
    <ThemeProvider>
      <App />
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,


          style: {
            background: 'rgba(15, 23, 42, 0.85)',
            backdropFilter: 'blur(12px)',
            color: '#f8fafc',
            padding: '16px 24px',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.3)',
            fontSize: '14px',
            fontWeight: '500',
            letterSpacing: '0.3px',
            fontFamily: 'inherit',
          },

          success: {
            style: {
              background: 'rgba(6, 78, 59, 0.85)',
              border: '1px solid rgba(16, 185, 129, 0.2)',
            },
            iconTheme: {
              primary: '#34d399',
              secondary: '#022c22',
            },
          },

          error: {
            duration: 5000,
            style: {
              background: 'rgba(127, 29, 29, 0.85)',
              border: '1px solid rgba(248, 113, 113, 0.2)',
            },
            iconTheme: {
              primary: '#f87171',
              secondary: '#450a0a',
            },
          },

          loading: {
            style: {
              background: 'rgba(30, 41, 59, 0.85)',
              border: '1px solid rgba(148, 163, 184, 0.1)',
            },
            iconTheme: {
              primary: '#818cf8',
              secondary: 'transparent',
            },
          }
        }}
      />
    </ThemeProvider>
  </BrowserRouter>

);
