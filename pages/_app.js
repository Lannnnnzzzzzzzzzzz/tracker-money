import '../styles/globals.css';
import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import AuthModal from '../components/AuthModal';
import SettingsModal from '../components/SettingsModal';
import { useRouter } from 'next/router';

function MyApp({ Component, pageProps }) {
  const [user, setUser] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setUser(JSON.parse(userData));
    } else if (router.pathname !== '/') {
      router.push('/');
    }
  }, [router.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    router.push('/');
  };

  const handleOpenSettings = () => {
    setIsSettingsModalOpen(true);
  };

  const handleUpdateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  // Protected route
  const isProtectedRoute = ['/dashboard', '/transactions', '/reports', '/ai-assistant', '/settings'].includes(router.pathname);
  
  if (isProtectedRoute && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="mb-4">Please login to access this page</p>
          <button 
            onClick={() => setIsAuthModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-white">
      <Navbar 
        user={user} 
        onLogout={handleLogout} 
        onOpenSettings={handleOpenSettings}
      />
      
      <main className="flex-1 overflow-y-auto">
        <Component {...pageProps} />
      </main>

      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        mode={authMode}
        onModeChange={setAuthMode}
      />
      
      <SettingsModal 
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        user={user}
        onUpdate={handleUpdateUser}
      />
    </div>
  );
}

export default MyApp;
