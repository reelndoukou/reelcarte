import React from 'react';
import { useAuth } from '@/contexts/AdminAuthContext';
import { LogOut, UserCircle } from 'lucide-react';

const Header: React.FC = () => {
  const { admin, logout } = useAuth();

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-end px-6">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <UserCircle className="w-6 h-6 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">{admin?.name}</span>
        </div>
        <button
          onClick={logout}
          className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
          title="Déconnexion"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};

export default Header;
