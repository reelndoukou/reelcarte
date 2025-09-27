import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { formatCurrency, formatDate } from '@/utils/helpers';
import { ArrowUp, ArrowDown } from 'lucide-react';
import Button from '@/components/ui/Button';
import TransactionModal from '@/components/modals/TransactionModal';

const TransfersPage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [modalMode, setModalMode] = useState<'deposit' | 'withdraw' | null>(null);

  if (!user) return null;

  const handleTransaction = (data: { amount: number; provider: string; phone: string }) => {
    const { amount } = data;
    const updatedUser = { ...user };

    if (modalMode === 'deposit') {
      updatedUser.mainAccountBalance += amount;
      alert(`Dépôt de ${formatCurrency(amount)} initié via ${data.provider} !`);
    } else {
      if (updatedUser.mainAccountBalance < amount) {
        alert("Solde insuffisant pour ce retrait.");
        return;
      }
      updatedUser.mainAccountBalance -= amount;
      alert(`Retrait de ${formatCurrency(amount)} initié vers ${data.provider} !`);
    }
    
    updatedUser.transactions.unshift({
        id: new Date().toISOString(),
        type: modalMode === 'deposit' ? 'deposit_main' : 'withdraw_main',
        status: 'completed',
        amount: amount,
        date: new Date(),
        description: `${modalMode === 'deposit' ? 'Dépôt via' : 'Retrait vers'} ${data.provider}`,
    });

    updateUser(updatedUser);
    setModalMode(null);
  };

  return (
    <div className="space-y-8 pb-20">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Opérations sur le Compte Principal</h1>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-subtle p-6 text-center">
        <p className="text-gray-600 dark:text-gray-300 mb-2">Solde principal actuel</p>
        <p className="text-5xl font-bold mb-6">{formatCurrency(user.mainAccountBalance)}</p>
        
        <div className="flex justify-center space-x-4">
            <Button onClick={() => setModalMode('deposit')}>
                <ArrowDown className="inline mr-2" /> Déposer
            </Button>
            <Button variant="secondary" onClick={() => setModalMode('withdraw')}>
                <ArrowUp className="inline mr-2" /> Retirer
            </Button>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Historique du Compte Principal</h2>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-subtle p-4">
          <ul className="divide-y divide-gray-100 dark:divide-gray-700">
            {user.transactions.filter(tx => tx.type.includes('_main')).map(tx => (
              <li key={tx.id} className="flex items-center justify-between py-4">
                 <div className="flex items-center space-x-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.type === 'deposit_main' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                    {tx.type === 'deposit_main' ? <ArrowDown size={20} /> : <ArrowUp size={20} />}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 dark:text-white capitalize">{tx.description}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{formatDate(new Date(tx.date))}</p>
                  </div>
                </div>
                <p className={`font-bold text-lg ${tx.type === 'deposit_main' ? 'text-green-500' : 'text-red-500'}`}>
                  {tx.type === 'deposit_main' ? '+' : '-'} {formatCurrency(tx.amount)}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {modalMode && (
        <TransactionModal
          isOpen={!!modalMode}
          onClose={() => setModalMode(null)}
          mode={modalMode}
          onSubmit={handleTransaction}
        />
      )}
    </div>
  );
};

export default TransfersPage;
