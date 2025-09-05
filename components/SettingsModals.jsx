import { useState, useEffect } from 'react';
import { FiX, FiUser, FiMail, FiLock, FiCamera, FiTrash2 } from 'react-icons/fi';
import axios from 'axios';

const SettingsModal = ({ isOpen, onClose, user, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  }, [user, isOpen]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await axios.put('/api/auth/profile', {
        name: formData.name,
        email: formData.email
      });
      
      // Update localStorage
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      // Update parent state
      onUpdate(response.data.user);
      
      setSuccess('Profile berhasil diperbarui');
    } catch (error) {
      setError(error.response?.data?.error || 'Gagal memperbarui profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (formData.newPassword !== formData.confirmPassword) {
        setError('Password baru tidak cocok');
        setLoading(false);
        return;
      }

      await axios.put('/api/auth/change-password', {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      });
      
      setFormData({
        ...formData,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      setSuccess('Password berhasil diubah');
    } catch (error) {
      setError(error.response?.data?.error || 'Gagal mengubah password');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm('Apakah Anda yakin ingin menghapus akun? Tindakan ini tidak dapat dibatalkan.')) {
      return;
    }

    try {
      await axios.delete('/api/auth/delete-account');
      
      // Clear localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Redirect to home
      window.location.href = '/';
    } catch (error) {
      setError(error.response?.data?.error || 'Gagal menghapus akun');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Settings</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <FiX className="text-xl" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-700 mb-6">
          <button
            onClick={() => setActiveTab('profile')}
            className={`pb-2 px-4 ${activeTab === 'profile' ? 'border-b-2 border-blue-500' : ''}`}
          >
            Profile
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`pb-2 px-4 ${activeTab === 'security' ? 'border-b-2 border-blue-500' : ''}`}
          >
            Security
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-900 text-red-100 rounded-lg">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-900 text-green-100 rounded-lg">
            {success}
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <form onSubmit={handleUpdateProfile}>
            <div className="mb-6">
              <label className="block mb-2">Photo Profile</label>
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center">
                  <FiUser className="text-white text-xl" />
                </div>
                <button
                  type="button"
                  className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg"
                >
                  <FiCamera className="mr-2" />
                  Change Photo
                </button>
              </div>
            </div>

            <div className="mb-4">
              <label className="block mb-2">Name</label>
              <div className="relative">
                <FiUser className="absolute left-3 top-3 text-gray-400" />
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

            <div className="mb-6">
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

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg disabled:opacity-50"
            >
              {loading ? 'Memproses...' : 'Update Profile'}
            </button>
          </form>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <div>
            <form onSubmit={handleChangePassword} className="mb-6">
              <h3 className="text-lg font-semibold mb-4">Change Password</h3>
              
              <div className="mb-4">
                <label className="block mb-2">Current Password</label>
                <div className="relative">
                  <FiLock className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="password"
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    className="w-full p-2 pl-10 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block mb-2">New Password</label>
                <div className="relative">
                  <FiLock className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="password"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    className="w-full p-2 pl-10 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block mb-2">Confirm New Password</label>
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

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg disabled:opacity-50"
              >
                {loading ? 'Memproses...' : 'Change Password'}
              </button>
            </form>

            <div className="border-t border-gray-700 pt-6">
              <h3 className="text-lg font-semibold mb-4 text-red-400">Danger Zone</h3>
              <button
                onClick={handleDeleteAccount}
                className="w-full bg-red-900 hover:bg-red-800 text-white p-2 rounded-lg flex items-center justify-center"
              >
                <FiTrash2 className="mr-2" />
                Delete Account
              </button>
              <p className="mt-2 text-sm text-gray-400">
                Once you delete your account, there is no going back. Please be certain.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsModal;
