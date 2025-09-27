import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { Phone, KeyRound } from 'lucide-react';
import Button from '@/components/ui/Button';

const LoginPage: React.FC = () => {
  const [phone, setPhone] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    // In a real app, you'd use the entered phone. For demo, we use the mock user's phone.
    const success = await login('mock_phone_number', pin);
    if (success) {
      navigate('/dashboard');
    } else {
      setError('Numéro de téléphone ou code PIN incorrect.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm p-8 space-y-8 bg-white rounded-2xl shadow-lg"
      >
        <div className="text-center">
          <Link to="/" className="flex justify-center items-center space-x-2 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-DEFAULT to-orange-dark rounded-lg flex items-center justify-center">
              <img src="/logo.png" alt="REELCarte Logo" className="w-50 h-50 object-contain object-contain rounded-lg" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Bienvenue</h1>
          </Link>
          <p className="text-gray-600">Connectez-vous à votre compte</p>
        </div>
        <form className="space-y-6" onSubmit={handleLogin}>
          {error && <p className="text-sm text-red-600 text-center">{error}</p>}
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Numéro de téléphone"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-DEFAULT focus:border-orange-DEFAULT"
            />
          </div>
          <div className="relative">
            <KeyRound className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="password"
              maxLength={4}
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="Code PIN à 4 chiffres"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-DEFAULT focus:border-orange-DEFAULT"
            />
          </div>
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? 'Connexion...' : 'Se connecter'}
          </Button>
        </form>
        <div className="text-center text-sm">
          <p className="text-gray-600">Pas encore de compte ? <Link to="/register" className="font-medium text-orange-DEFAULT hover:underline">Inscrivez-vous</Link></p>
          <p className="text-gray-500 mt-2">Pour la démo, utilisez le PIN <strong>1234</strong>.</p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
