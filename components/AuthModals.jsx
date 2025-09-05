import { useState } from 'react';
import { FiX, FiMail, FiLock } from 'react-icons/fi';
import axios from 'axios';

const AuthModal = ({ isOpen, onClose, mode = 'login' }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (mode === 'register') {
        if (formData.password !== formData.confirmPassword) {
          setError('Password tidak cocok');
          setLoading(false);
          return;
        }

        await axios.post('/api/auth/register', {
          name: formData.name,
          email: formData.email,
          password: formData.password
        });
      } else {
        const response = await axios.post('/api/auth/login', {
          email: formData.email,
          password: formData.password
        });
        
        // Save token to localStorage
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        // Redirect to dashboard
        window.location.href = '/dashboard';
      }
    } catch (error) {
      setError(error.response?.data?.error || 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            {mode === 'register' ? 'Daftar Akun' : 'Login'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <FiX />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-900 text-red-100 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {mode === 'register' && (
            <div className="mb-4">
              <label className="block mb-2">Nama</label>
              <div className="relative">
                <FiMail className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-2 pl-10 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
          )}

          <div className="mb-4">
            <label className="block mb-2">Email</label>
            <div className="relative">
              <FiMail className="absolute left-3 top-3 text-gray-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2 pl-10 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block mb-2">Password</label>
            <div className="relative">
              <FiLock className="absolute left-3 top-3 text-gray-400" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-2 pl-10 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          {mode === 'register' && (
            <div className="mb-4">
              <label className="block mb-2">Konfirmasi Password</label>
              <div className="relative">
                <FiLock className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full p-2 pl-10 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg disabled:opacity-50"
          >
            {loading ? 'Memproses...' : mode === 'register' ? 'Daftar' : 'Login'}
          </button>

          <div className="mt-4 text-center">
            {mode === 'login' ? (
              <p>
                Belum punya akun?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setFormData({ name: '', email: '', password: '', confirmPassword: '' });
                    setError('');
                  }}
                  className="text-blue-400 hover:underline"
                >
                  Daftar di sini
                </button>
              </p>
            ) : (
              <p>
                Sudah punya akun?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setFormData({ name: '', email: '', password: '', confirmPassword: '' });
                    setError('');
                  }}
                  className="text-blue-400 hover:underline"
                >
                  Login di sini
                </button>
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;
