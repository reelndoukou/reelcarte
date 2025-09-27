import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import PageHeader from '@/components/admin/PageHeader';
import { mockUsers } from '@/data/mockData';
import { formatCurrency, formatDate } from '@/utils/helpers';
import { ArrowLeft, Wallet, CreditCard, Percent, ShieldCheck, ShieldOff, Send } from 'lucide-react';
import { Card as CardTypeData, User as UserType, UserStatus } from '@/types';

const UserDetailPage: React.FC = () => {
  const { userId } = useParams();
  const [user, setUser] = useState<UserType | undefined>(mockUsers.find(u => u.id === userId));

  if (!user) {
    return (
      <div>
        <PageHeader title="Utilisateur non trouvé" subtitle="Cet utilisateur n'existe pas." />
        <Link to="/users" className="text-orange-600 hover:underline">Retour à la liste</Link>
      </div>
    );
  }

  const toggleUserStatus = () => {
    setUser(currentUser => currentUser ? { ...currentUser, status: currentUser.status === 'active' ? 'suspended' : 'active' } : undefined);
  };

  const totalCardBalance = user.cards.reduce((sum, card) => sum + card.balance, 0);
  const totalCardCommission = user.cards.reduce((sum, card) => sum + card.commission, 0);

  const getStatusBadge = (status: CardTypeData['status']) => {
    const classes: { [key in CardTypeData['status']]: string } = {
      active: 'bg-green-100 text-green-700',
      paused: 'bg-yellow-100 text-yellow-700',
      completed: 'bg-blue-100 text-blue-700',
      interrupted: 'bg-red-100 text-red-700',
    };
    return <span className={`px-2 py-1 text-xs font-medium rounded-full ${classes[status]}`}>{status}</span>;
  };
  
  const getUserStatusBadge = (status: UserStatus) => {
    const classes = {
      active: 'bg-green-100 text-green-700',
      suspended: 'bg-red-100 text-red-700',
    };
    return <span className={`px-2 py-1 text-sm font-medium rounded-full ${classes[status]}`}>{status === 'active' ? 'Actif' : 'Suspendu'}</span>;
  };

  return (
    <>
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center">
            <Link to="/users" className="p-2 rounded-full hover:bg-gray-200 mr-4">
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </Link>
            <div>
                <div className="flex items-center space-x-3">
                    <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
                    {getUserStatusBadge(user.status)}
                </div>
                <p className="mt-1 text-gray-600">Détails pour l'utilisateur #{user.id.substring(0, 8)}</p>
            </div>
        </div>
        <div className="flex space-x-2">
            <button onClick={toggleUserStatus} className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-semibold text-white ${user.status === 'active' ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}>
                {user.status === 'active' ? <ShieldOff size={16}/> : <ShieldCheck size={16}/>}
                <span>{user.status === 'active' ? 'Suspendre' : 'Réactiver'}</span>
            </button>
             <button className="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-semibold bg-gray-200 hover:bg-gray-300 text-gray-800">
                <Send size={16}/>
                <span>Notifier</span>
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-card flex items-center space-x-4">
          <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-blue-500 text-white"><Wallet size={24}/></div>
          <div>
            <p className="text-sm text-gray-500">Solde Principal</p>
            <p className="text-2xl font-bold text-gray-800">{formatCurrency(user.mainAccountBalance)}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-card flex items-center space-x-4">
          <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-green-500 text-white"><CreditCard size={24}/></div>
          <div>
            <p className="text-sm text-gray-500">Solde Total Cartes</p>
            <p className="text-2xl font-bold text-gray-800">{formatCurrency(totalCardBalance)}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-card flex items-center space-x-4">
          <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-orange-500 text-white"><Percent size={24}/></div>
          <div>
            <p className="text-sm text-gray-500">Commissions Générées</p>
            <p className="text-2xl font-bold text-gray-800">{formatCurrency(totalCardCommission)}</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-card">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Cartes de {user.name} ({user.cards.length})</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3">Nom de la carte</th>
                <th scope="col" className="px-6 py-3">Type</th>
                <th scope="col" className="px-6 py-3">Statut</th>
                <th scope="col" className="px-6 py-3">Solde</th>
                <th scope="col" className="px-6 py-3">Objectif</th>
                <th scope="col" className="px-6 py-3">Commission</th>
                <th scope="col" className="px-6 py-3">Créée le</th>
              </tr>
            </thead>
            <tbody>
              {user.cards.map(card => (
                <tr key={card.id} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{card.name}</td>
                  <td className="px-6 py-4">{card.type}</td>
                  <td className="px-6 py-4">{getStatusBadge(card.status)}</td>
                  <td className="px-6 py-4 font-semibold">{formatCurrency(card.balance)}</td>
                  <td className="px-6 py-4">{formatCurrency(card.goal)}</td>
                  <td className="px-6 py-4 text-orange-600">{formatCurrency(card.commission)}</td>
                  <td className="px-6 py-4">{formatDate(card.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default UserDetailPage;
