import { useEffect } from 'react'; 
import AppRouter from "./routes/AppRouter";

function App() {
  useEffect(() => {
    // Load dark mode từ localStorage khi app khởi động
    const savedDarkMode = localStorage.getItem("darkMode");
    const isDark = savedDarkMode ? JSON.parse(savedDarkMode) : false;
    
    // Apply vào HTML element
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  return <AppRouter />;
}

export default App;