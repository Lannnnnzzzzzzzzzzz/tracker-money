import { useState, useEffect } from 'react';
import { FiDollarSign, FiTrendingUp, FiPieChart, FiMessageSquare } from 'react-icons/fi';
import { useRouter } from 'next/router';
import AuthModal from '../components/AuthModal';

export default function Home() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      // Cek apakah pengguna sudah login dari localStorage
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      
      if (token && userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error('Auth check error:', error);
    } finally {
      setLoading(false);
    }
  };

  const openAuthModal = (mode) => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const features = [
    {
      icon: <FiDollarSign className="text-3xl text-blue-500" />,
      title: 'Catat Transaksi',
      description: 'Kelola pemasukan dan pengeluaran dengan mudah'
    },
    {
      icon: <FiTrendingUp className="text-3xl text-green-500" />,
      title: 'Laporan Keuangan',
      description: 'Analisis keuangan dengan grafik interaktif'
    },
    {
      icon: <FiPieChart className="text-3xl text-purple-500" />,
      title: 'Visualisasi Data',
      description: 'Lihat pengeluaran per kategori'
    },
    {
      icon: <FiMessageSquare className="text-3xl text-yellow-500" />,
      title: 'AI Assistant',
      description: 'Dapatkan wawasan keuangan dari AI'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  if (user) {
    // Jika pengguna sudah login, arahkan ke dashboard
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Selamat Datang Kembali, {user.name}!
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Anda sudah login. Klik tombol di bawah untuk menuju dashboard Anda.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => router.push('/dashboard')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition"
              >
                Menuju Dashboard
              </button>
              <button 
                onClick={handleLogout}
                className="bg-transparent border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white px-6 py-3 rounded-lg font-medium transition"
              >
                Logout
              </button>
            </div>
          </div>
          
          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-16">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="bg-gray-800 p-6 rounded-xl hover:bg-gray-750 transition-all duration-300 hover:scale-105"
              >
                <div className="mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Jika pengguna belum login, tampilkan halaman utama
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Catatan Keuangan Pribadi
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Kelola keuangan Anda dengan mudah, aman, dan cerdas. Dapatkan wawasan dari AI untuk pengambilan keputusan yang lebih baik.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => openAuthModal('login')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition"
            >
              Login
            </button>
            <button 
              onClick={() => openAuthModal('register')}
              className="bg-transparent border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-6 py-3 rounded-lg font-medium transition"
            >
              Daftar Gratis
            </button>
          </div>
        </div>
        
        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-16">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-gray-800 p-6 rounded-xl hover:bg-gray-750 transition-all duration-300 hover:scale-105"
            >
              <div className="mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
        
        {/* How It Works */}
        <div className="mt-24">
          <h2 className="text-3xl font-bold text-center mb-12">Cara Kerja</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Daftar Akun</h3>
              <p className="text-gray-400">Buat akun gratis dalam hitungan menit</p>
            </div>
            <div className="text-center">
              <div className="bg-green-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Tambah Transaksi</h3>
              <p className="text-gray-400">Catat pemasukan dan pengeluaran dengan mudah</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Analisis</h3>
              <p className="text-gray-400">Dapatkan laporan dan wawasan dari AI</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Testimonials */}
      <div className="mt-24 bg-gray-800 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Apa Kata Mereka</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-700 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center mr-3">
                  <span className="text-white font-bold">A</span>
                </div>
                <div>
                  <h4 className="font-semibold">Alim</h4>
                  <p className="text-sm text-gray-400">alim@example.com</p>
                </div>
              </div>
              <p className="text-gray-300">"Sangat membantu dalam mengatur keuangan pribadi. Fitur AI-nya luar biasa!"</p>
            </div>
            <div className="bg-gray-700 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center mr-3">
                  <span className="text-white font-bold">B</span>
                </div>
                <div>
                  <h4 className="font-semibold">Budi</h4>
                  <p className="text-sm text-gray-400">budi@example.com</p>
                </div>
              </div>
              <p className="text-gray-300">"Interface yang intuitif dan mudah digunakan. Recomended!"</p>
            </div>
            <div className="bg-gray-700 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center mr-3">
                  <span className="text-white font-bold">C</span>
                </div>
                <div>
                  <h4 className="font-semibold">Citra</h4>
                  <p className="text-sm text-gray-400">citra@example.com</p>
                </div>
              </div>
              <p className="text-gray-300">"Grafik dan laporan yang detail sangat membantu dalam perencanaan keuangan."</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="mt-24 text-center">
        <h2 className="text-3xl font-bold mb-6">Mulai Kelola Keuangan Anda Hari Ini</h2>
        <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
          Bergabung dengan ribuan pengguna lain yang telah mengubah cara mereka mengelola keuangan
        </p>
        <button 
          onClick={() => openAuthModal('register')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium text-lg transition"
        >
          Daftar Sekarang - Gratis
        </button>
      </div>
      
      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authMode}
      />
    </div>
  );
}
