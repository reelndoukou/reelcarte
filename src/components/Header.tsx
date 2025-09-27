import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Bell, Settings, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-40 shadow-subtle">
      <div className="container mx-auto px-4 h-20 flex justify-between items-center">
        <Link to="/dashboard" className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-light to-orange-dark rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-lg font-display">RC</span>
          </div>
          <span className="text-2xl font-bold text-gray-800 dark:text-white font-display">REELCarte</span>
        </Link>
        <div className="flex items-center space-x-4">
          <button className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
            <Bell size={22} />
          </button>
          <div className="relative">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="w-10 h-10 rounded-full overflow-hidden border-2 border-orange-DEFAULT">
              <img src={user?.avatar} alt={user?.name} className="w-full h-full object-cover" />
            </button>
            <AnimatePresence>
              {isMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-medium border border-gray-200 dark:border-gray-700 overflow-hidden"
                >
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <p className="font-semibold text-gray-800 dark:text-white">{user?.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{user?.phone}</p>
                  </div>
                  <nav className="py-2">
                    <Link to="/profile" onClick={() => setIsMenuOpen(false)} className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                      <Settings size={18} className="mr-3" /> Mon Profil
                    </Link>
                    <button onClick={handleLogout} className="w-full text-left flex items-center px-4 py-2 text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700">
                      <LogOut size={18} className="mr-3" /> Déconnexion
                    </button>
                  </nav>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
