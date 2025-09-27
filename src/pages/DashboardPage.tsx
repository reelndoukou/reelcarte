import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { formatCurrency, formatDate } from '@/utils/helpers';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ArrowDownLeft, Plus } from 'lucide-react';
import Button from '@/components/ui/Button';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  if (!user) return null;

  const recentTransactions = user.transactions.slice(0, 5);

  return (
    <div className="space-y-8 pb-20">
      {/* Main Balance */}
      <div className="bg-gradient-to-br from-orange-500 to-orange-dark p-8 rounded-2xl text-white shadow-lg text-center">
        <p className="text-lg opacity-80">Solde Principal</p>
        <h1 className="text-5xl font-bold my-2">{formatCurrency(user.mainAccountBalance)}</h1>
        <div className="flex justify-center space-x-4 mt-6">
          <Link to="/transfers">
            <Button variant="secondary" className="bg-white/20 text-white hover:bg-white/30 border-0">
              <ArrowUpRight className="inline-block mr-2" size={20} />
              Déposer
            </Button>
          </Link>
          <Link to="/transfers">
            <Button variant="secondary" className="bg-white/20 text-white hover:bg-white/30 border-0">
              <ArrowDownLeft className="inline-block mr-2" size={20} />
              Retirer
            </Button>
          </Link>
        </div>
      </div>

      {/* Cards Overview */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Mes Cartes</h2>
          <Link to="/cards" className="text-orange-600 font-medium flex items-center space-x-1">
            <span>Voir tout</span>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {user.cards.map(card => (
            <div key={card.id} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-subtle">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-lg text-gray-800 dark:text-white">{card.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">{card.type}</p>
                </div>
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">{card.status}</span>
              </div>
              <div className="mt-4">
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{formatCurrency(card.balance)}</p>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                  <div 
                    className="bg-orange-500 h-2 rounded-full"
                    style={{ width: `${(card.balance / card.goal) * 100}%` }}
                  ></div>
                </div>
                <p className="text-xs text-right text-gray-500 dark:text-gray-400 mt-1">Objectif: {formatCurrency(card.goal)}</p>
              </div>
            </div>
          ))}
           <Link to="/cards" className="flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-800/50 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
              <Plus size={32} />
              <span className="mt-2 font-semibold">Nouvelle Carte</span>
          </Link>
        </div>
      </div>

      {/* Recent Transactions */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Transactions Récentes</h2>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-subtle p-4">
          <ul className="divide-y divide-gray-100 dark:divide-gray-700">
            {recentTransactions.map(tx => (
              <li key={tx.id} className="flex items-center justify-between py-4">
                <div>
                  <p className="font-semibold text-gray-800 dark:text-white">{tx.description}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{formatDate(new Date(tx.date))}</p>
                </div>
                <p className={`font-bold text-lg ${tx.type.includes('deposit') ? 'text-green-500' : 'text-red-500'}`}>
                  {tx.type.includes('deposit') ? '+' : '-'} {formatCurrency(tx.amount)}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
