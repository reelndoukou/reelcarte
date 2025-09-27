import React, { useState, useMemo } from 'react';
import PageHeader from '@/components/admin/PageHeader';
import { mockUsers } from '@/data/mockData';
import { formatCurrency } from '@/utils/helpers';
import { Card, CardStatus, CardType } from '@/types';
import { Link } from 'react-router-dom';

interface CardWithUser extends Card {
  user: {
    id: string;
    name: string;
  };
}

const CardsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<CardType | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<CardStatus | 'all'>('all');

  const allCards: CardWithUser[] = useMemo(() => {
    return mockUsers.flatMap(user =>
      user.cards.map(card => ({
        ...card,
        user: { id: user.id, name: user.name },
      }))
    );
  }, []);

  const filteredCards = useMemo(() => {
    return allCards.filter(card => {
      const searchMatch =
        card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        card.user.name.toLowerCase().includes(searchTerm.toLowerCase());
      const typeMatch = filterType === 'all' || card.type === filterType;
      const statusMatch = filterStatus === 'all' || card.status === filterStatus;
      return searchMatch && typeMatch && statusMatch;
    });
  }, [allCards, searchTerm, filterType, filterStatus]);

  const getStatusBadge = (status: CardStatus) => {
    const classes: { [key in CardStatus]: string } = {
      active: 'bg-green-100 text-green-700',
      paused: 'bg-yellow-100 text-yellow-700',
      completed: 'bg-blue-100 text-blue-700',
      interrupted: 'bg-red-100 text-red-700',
    };
    return <span className={`px-2 py-1 text-xs font-medium rounded-full ${classes[status]}`}>{status}</span>;
  };

  return (
    <>
      <PageHeader title="Gestion des Cartes" subtitle={`Liste des ${allCards.length} cartes sur la plateforme.`} />
      
      <div className="bg-white p-6 rounded-xl shadow-card">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <input
            type="text"
            placeholder="Rechercher par nom de carte ou utilisateur..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
          />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as CardType | 'all')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
          >
            <option value="all">Tous les types</option>
            <option value="pointage">Pointage</option>
            <option value="epargne">Épargne</option>
            <option value="offrant">Offrant</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as CardStatus | 'all')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
          >
            <option value="all">Tous les statuts</option>
            <option value="active">Active</option>
            <option value="paused">Pausée</option>
            <option value="completed">Complétée</option>
            <option value="interrupted">Interrompue</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3">Nom de la carte</th>
                <th scope="col" className="px-6 py-3">Utilisateur</th>
                <th scope="col" className="px-6 py-3">Type</th>
                <th scope="col" className="px-6 py-3">Statut</th>
                <th scope="col" className="px-6 py-3">Solde</th>
                <th scope="col" className="px-6 py-3">Commission</th>
              </tr>
            </thead>
            <tbody>
              {filteredCards.map(card => (
                <tr key={card.id} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{card.name}</td>
                  <td className="px-6 py-4">
                    <Link to={`/users/${card.user.id}`} className="text-orange-600 hover:underline">
                      {card.user.name}
                    </Link>
                  </td>
                  <td className="px-6 py-4">{card.type}</td>
                  <td className="px-6 py-4">{getStatusBadge(card.status)}</td>
                  <td className="px-6 py-4 font-semibold">{formatCurrency(card.balance)}</td>
                  <td className="px-6 py-4 text-orange-600">{formatCurrency(card.commission)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredCards.length === 0 && (
          <div className="text-center py-10 text-gray-500">
            Aucune carte ne correspond à vos critères de recherche.
          </div>
        )}
      </div>
    </>
  );
};

export default CardsPage;
