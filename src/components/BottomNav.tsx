import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, CreditCard, ArrowRightLeft, User } from 'lucide-react';

const BottomNav: React.FC = () => {
  const navItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Accueil' },
    { to: '/cards', icon: CreditCard, label: 'Cartes' },
    { to: '/transfers', icon: ArrowRightLeft, label: 'Transferts' },
    { to: '/profile', icon: User, label: 'Profil' },
  ];

  const linkClass = "flex flex-col items-center justify-center w-full pt-2 pb-1 text-gray-500 dark:text-gray-400 transition-colors";
  const activeLinkClass = "text-orange-DEFAULT dark:text-orange-light";

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-t-medium md:hidden z-40 border-t border-gray-200 dark:border-gray-700">
      <div className="flex justify-around h-full">
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/dashboard'}
            className={({ isActive }) => `${linkClass} ${isActive ? activeLinkClass : ''}`}
          >
            <item.icon size={24} />
            <span className="text-xs mt-1">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;
