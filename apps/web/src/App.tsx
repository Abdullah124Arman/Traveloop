import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AppRouter } from './routes/AppRouter';
import { useEffect } from 'react';
import { useAuthStore } from './store/authStore';

function App() {
  const { isAuthenticated, logout } = useAuthStore();

  useEffect(() => {
    // Optionally check if token is valid on mount
  }, []);

  return (
    <BrowserRouter>
      <Toaster position="top-center" />
      <AppRouter />
    </BrowserRouter>
  );
}

export default App;
