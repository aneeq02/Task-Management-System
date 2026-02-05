import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from "./context/ThemeContext";
import './index.css';
import AppToaster from './components/AppToaster.jsx';


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider>
          
        <App />
        <AppToaster
          position="top-center"
          toastOptions={{
            style: {
              background: '#1A3263',
              color: '#FDF6ED',
              borderRadius: '9999px',
              paddingInline: '1.25rem',
              paddingBlock: '0.75rem',
              fontSize: '0.95rem',
            },
            success: { iconTheme: { primary: '#FAB95B', secondary: '#1A3263' } },
            error: {
              style: {
                background: '#FEE2E2',
                color: '#7F1D1D',
                borderRadius: '0.75rem',
              },
            },
          }}
        />
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
