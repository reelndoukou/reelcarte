import React, { useState, useMemo } from 'react';
import PageHeader from '@/components/admin/PageHeader';
import { allTransactions } from '@/data/mockData';
import { formatCurrency, formatDate } from '@/utils/helpers';
import { Transaction, TransactionStatus, TransactionType, CardType } from '@/types';
import { CheckCircle, XCircle } from 'lucide-react';

interface GlobalTransaction extends Transaction {
    userName: string;
    cardName: string;
    cardType: CardType;
}

const TransactionsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<TransactionType | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<TransactionStatus | 'all'>('all');
  const [transactions, setTransactions] = useState<GlobalTransaction[]>(allTransactions as GlobalTransaction[]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const searchMatch =
        t.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.cardName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.description.toLowerCase().includes(searchTerm.toLowerCase());
      const typeMatch = filterType === 'all' || t.type === filterType;
      const statusMatch = filterStatus === 'all' || t.status === filterStatus;
      return searchMatch && typeMatch && statusMatch;
    });
  }, [transactions, searchTerm, filterType, filterStatus]);

  const handleUpdateStatus = (transactionId: string, newStatus: TransactionStatus) => {
    setTransactions(current => current.map(t => t.id === transactionId ? { ...t, status: newStatus } : t));
  };

  const getStatusCell = (t: GlobalTransaction) => {
    const classes: { [key in TransactionStatus]: string } = {
      completed: 'bg-green-100 text-green-700',
      pending: 'bg-yellow-100 text-yellow-700',
      failed: 'bg-red-100 text-red-700',
    };

    if (t.status === 'pending') {
      return (
        <div className="flex items-center space-x-1">
          <button onClick={() => handleUpdateStatus(t.id, 'completed')} className="p-1 text-green-500 hover:bg-green-100 rounded-full"><CheckCircle size={18}/></button>
          <button onClick={() => handleUpdateStatus(t.id, 'failed')} className="p-1 text-red-500 hover:bg-red-100 rounded-full"><XCircle size={18}/></button>
        </div>
      );
    }
    
    return <span className={`px-2 py-1 text-xs font-medium rounded-full ${classes[t.status]}`}>{t.status}</span>;
  };

  return (
    <>
      <PageHeader title="Historique des Transactions" subtitle={`Liste de toutes les transactions sur la plateforme.`} />
      
      <div className="bg-white p-6 rounded-xl shadow-card">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <input
            type="text"
            placeholder="Rechercher..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
          />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as TransactionType | 'all')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
          >
            <option value="all">Tous les types</option>
            <option value="deposit">Dépôt</option>
            <option value="withdrawal">Retrait</option>
            <option value="commission">Commission</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as TransactionStatus | 'all')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
          >
            <option value="all">Tous les statuts</option>
            <option value="completed">Complétée</option>
            <option value="pending">En attente</option>
            <option value="failed">Échouée</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3">Description</th>
                <th scope="col" className="px-6 py-3">Utilisateur / Carte</th>
                <th scope="col" className="px-6 py-3">Date</th>
                <th scope="col" className="px-6 py-3">Type</th>
                <th scope="col" className="px-6 py-3">Statut / Actions</th>
                <th scope="col" className="px-6 py-3 text-right">Montant</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map(t => (
                <tr key={t.id} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{t.description}</td>
                  <td className="px-6 py-4">
                    <div>{t.userName}</div>
                    <div className="text-xs text-gray-500">{t.cardName} ({t.cardType})</div>
                  </td>
                  <td className="px-6 py-4">{formatDate(t.date)}</td>
                  <td className="px-6 py-4 capitalize">{t.type}</td>
                  <td className="px-6 py-4">{getStatusCell(t)}</td>
                  <td className={`px-6 py-4 text-right font-semibold ${t.type === 'deposit' ? 'text-green-600' : 'text-red-600'}`}>
                    {t.type === 'deposit' ? '+' : '-'} {formatCurrency(t.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredTransactions.length === 0 && (
          <div className="text-center py-10 text-gray-500">
            Aucune transaction ne correspond à vos critères de recherche.
          </div>
        )}
      </div>
    </>
  );
};

export default TransactionsPage;
