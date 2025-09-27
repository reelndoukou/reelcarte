import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { LayoutDashboard, Users, CreditCard, ArrowRightLeft } from 'lucide-react';

const Sidebar: React.FC = () => {
  const navItems = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/users', icon: Users, label: 'Utilisateurs' },
    { to: '/cards', icon: CreditCard, label: 'Cartes' },
    { to: '/transactions', icon: ArrowRightLeft, label: 'Transactions' },
  ];

  const linkClasses = "flex items-center px-4 py-3 text-gray-600 hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-colors duration-200";
  const activeLinkClasses = "bg-orange-100 text-orange-700 font-semibold";

  return (
    <aside className="w-64 flex-shrink-0 bg-white border-r border-gray-200 flex flex-col">
      <div className="h-16 flex items-center justify-center border-b border-gray-200">
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">RC</span>
          </div>
          <span className="text-lg font-bold text-gray-800">Admin</span>
        </Link>
      </div>
      <nav className="flex-1 px-4 py-6">
        <ul className="space-y-2">
          {navItems.map(item => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
