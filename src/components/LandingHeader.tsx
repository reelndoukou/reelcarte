import React from 'react';
import { Link } from 'react-router-dom';
import Button from './ui/Button';

const LandingHeader: React.FC = () => {
  return (
    <header className="absolute top-0 left-0 right-0 z-30 bg-transparent">
      <div className="container mx-auto px-4 h-20 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-light to-orange-dark rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-lg font-display">RC</span>
          </div>
          <span className="text-2xl font-bold text-white font-display">REELCarte</span>
        </Link>
        <div className="flex items-center space-x-6">
          <Link to="/login" className="text-white font-medium hover:text-orange-light transition-colors">
            Connexion
          </Link>
          <Link to="/register">
            <Button className="!py-2 !px-4">S'inscrire</Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default LandingHeader;
