import { useState, useEffect } from 'react';
import { FiUser, FiMail, FiLock, FiShield, FiBell, FiMoon, FiSun } from 'react-icons/fi';
import SettingsModal from '../components/SettingsModal';

const Settings = () => {
  const [user, setUser] = useState(null);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    
    // Check dark mode preference
    const isDark = localStorage.getItem('darkMode') === 'true';
    setDarkMode(isDark);
  }, []);

  const handleUpdateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());
    
    // Apply dark mode to document
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const settingsSections = [
    {
      title: 'Account',
      icon: <FiUser className="text-blue-400" />,
      items: [
        { 
          title: 'Profile Information', 
          icon: <FiUser />,
          action: () => setIsSettingsModalOpen(true)
        },
        { 
          title: 'Change Password', 
          icon: <FiLock />
        }
      ]
    },
    {
      title: 'Preferences',
      icon: <FiBell className="text-yellow-400" />,
      items: [
        { 
          title: 'Dark Mode', 
          icon: darkMode ? <FiSun /> : <FiMoon />,
          action: toggleDarkMode,
          value: darkMode ? 'Light Mode' : 'Dark Mode'
        }
      ]
    },
    {
      title: 'Security',
      icon: <FiShield className="text-green-400" />,
      items: [
        { 
          title: 'Two-Factor Authentication', 
          icon: <FiShield />
        }
      ]
    }
  ];

  return (
    <div className="p-4 md:p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">Settings</h1>
        <button
          onClick={() => setIsSettingsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
        >
          <FiUser className="mr-2" />
          Edit Profile
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {settingsSections.map((section, index) => (
          <div key={index} className="bg-gray-800 rounded-xl p-6 shadow-lg">
            <div className="flex items-center mb-4">
              <div className="mr-3 text-xl">
                {section.icon}
              </div>
              <h2 className="text-xl font-semibold">{section.title}</h2>
            </div>
            
            <div className="space-y-3">
              {section.items.map((item, itemIndex) => (
                <button
                  key={itemIndex}
                  onClick={item.action}
                  className="w-full flex items-center p-3 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
                >
                  <div className="mr-3 text-gray-400">
                    {item.icon}
                  </div>
                  <span className="font-medium">{item.title}</span>
                  {item.value && (
                    <span className="ml-auto text-sm text-gray-400">
                      {item.value}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* User Info Card */}
      {user && (
        <div className="bg-gray-800 rounded-xl p-6 shadow-lg mt-6">
          <h2 className="text-xl font-semibold mb-4">Account Information</h2>
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center">
              <FiUser className="text-white text-xl" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">{user.name}</h3>
              <p className="text-gray-400">{user.email}</p>
              <p className="text-sm text-gray-500 mt-1">
                Member since {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      )}

      <SettingsModal 
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        user={user}
        onUpdate={handleUpdateUser}
      />
    </div>
  );
};

export default Settings;
