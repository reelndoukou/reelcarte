import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Phone, KeyRound } from 'lucide-react';
import Button from '@/components/ui/Button';

const RegisterPage: React.FC = () => {
  // In a real app, this would handle form state and submission
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm p-8 space-y-8 bg-white rounded-2xl shadow-lg"
      >
        <div className="text-center">
          <div className="flex justify-center items-center space-x-2 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
              <img src="/logo.png" alt="REELCarte Logo" className="w-50 h-50 object-contain object-contain rounded-lg" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Créer un compte</h1>
          </div>
          <p className="text-gray-600">Rejoignez-nous aujourd'hui !</p>
        </div>
        <form className="space-y-6">
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Nom complet"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="tel"
              placeholder="Numéro de téléphone"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
          <div className="relative">
            <KeyRound className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="password"
              maxLength={4}
              placeholder="Créez un code PIN à 4 chiffres"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
          <Button type="submit" className="w-full">
            S'inscrire
          </Button>
        </form>
        <p className="text-center text-sm text-gray-600">
          Déjà un compte ? <Link to="/login" className="font-medium text-orange-600 hover:underline">Connectez-vous</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
