import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AdminAuthContext';
import { motion } from 'framer-motion';
import { User, KeyRound } from 'lucide-react';

const AdminLoginPage: React.FC = () => {
  const [username, setUsername] = useState('admin');
  const [pin, setPin] = useState('1234');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    const success = await login(username, pin);
    if (success) {
      navigate('/');
    } else {
      setError('Identifiants incorrects.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm p-8 space-y-8 bg-white rounded-2xl shadow-lg"
      >
        <div className="text-center">
          <div className="flex justify-center items-center space-x-2 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">RC</span>
            </div>
            <span className="text-2xl font-bold text-gray-800">Admin Panel</span>
          </div>
          <p className="text-gray-600">Connectez-vous à votre tableau de bord</p>
        </div>
        <form className="space-y-6" onSubmit={handleLogin}>
          {error && <p className="text-sm text-red-600 text-center">{error}</p>}
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Nom d'utilisateur"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
          <div className="relative">
            <KeyRound className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="Code PIN"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
            className="w-full bg-orange-500 text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:bg-orange-600 disabled:bg-orange-300"
          >
            {isLoading ? 'Connexion...' : 'Se connecter'}
          </motion.button>
        </form>
         <div className="mt-4 text-center text-sm text-gray-500">
            <p>Utilisez <strong>admin</strong> / <strong>1234</strong> pour la démo.</p>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLoginPage;
