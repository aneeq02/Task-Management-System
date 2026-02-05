import { Toaster } from "react-hot-toast";
import { useTheme } from "../context/ThemeContext";

export default function AppToaster() {
  const { isDark } = useTheme();

  return (
    <Toaster
      position="top-center"
      toastOptions={{
        style: isDark
          ? {
              background: '#13264c', 
              color: '#f7f3ee',      
              borderRadius: '9999px',
              paddingInline: '1.25rem',
              paddingBlock: '0.75rem',
              fontSize: '0.95rem',
              border: '1px solid #0d1b36', 
            }
          : {
              background: '#1A3263', 
              color: '#FDF6ED',
              borderRadius: '9999px',
              paddingInline: '1.25rem',
              paddingBlock: '0.75rem',
              fontSize: '0.95rem',
            },
        success: { iconTheme: { primary: '#FAB95B', secondary: isDark ? '#13264c' : '#1A3263' } },
        error: {
          style: {
            background: '#FEE2E2',
            color: '#7F1D1D',
            borderRadius: '0.75rem',
          },
        },
      }}
    />
  );
}
