import { useState } from 'react';
import { FiMenu, FiX, FiUser, FiLogOut, FiSettings } from 'react-icons/fi';
import { useRouter } from 'next/router';

const Navbar = ({ user, onLogout, onOpenSettings }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    onLogout();
    router.push('/');
  };

  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <div className="flex items-center space-x-4">
        <button 
          onClick={() => router.push('/dashboard')}
          className="text-xl font-bold"
        >
          Catatan Keuangan
        </button>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center space-x-6">
        <button 
          onClick={() => router.push('/dashboard')}
          className="hover:text-blue-400 transition"
        >
          Dashboard
        </button>
        <button 
          onClick={() => router.push('/transactions')}
          className="hover:text-blue-400 transition"
        >
          Transaksi
        </button>
        <button 
          onClick={() => router.push('/reports')}
          className="hover:text-blue-400 transition"
        >
          Laporan
        </button>
        <button 
          onClick={() => router.push('/ai-assistant')}
          className="hover:text-blue-400 transition"
        >
          AI Assistant
        </button>
      </div>

      {/* User Menu */}
      <div className="flex items-center space-x-4">
        <div className="hidden md:flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
            <FiUser className="text-white" />
          </div>
          <span className="font-medium">{user?.name || user?.email}</span>
        </div>
        
        <div className="relative">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 rounded-lg hover:bg-gray-700 transition"
          >
            <FiMenu className="text-xl" />
          </button>
          
          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-gray-700 rounded-lg shadow-lg py-2 z-50">
              <button
                onClick={() => {
                  onOpenSettings();
                  setIsMenuOpen(false);
                }}
                className="w-full text-left px-4 py-2 hover:bg-gray-600 flex items-center space-x-2"
              >
                <FiSettings />
                <span>Settings</span>
              </button>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 hover:bg-gray-600 flex items-center space-x-2 text-red-400"
              >
                <FiLogOut />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu Button */}
      <button 
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="md:hidden p-2 rounded-lg hover:bg-gray-700 transition"
      >
        {isMenuOpen ? <FiX className="text-xl" /> : <FiMenu className="text-xl" />}
      </button>
    </nav>
  );
};

export default Navbar;
