import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { formatCurrency } from '@/utils/helpers';
import { Plus, DollarSign } from 'lucide-react';
import Button from '@/components/ui/Button';
import { AnimatePresence, motion } from 'framer-motion';
import { Card } from '@/types';
import CreateCardModal from '@/components/modals/CreateCardModal'; // Import new modal
import { faker } from '@faker-js/faker';

const CardsPage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isFundModalOpen, setIsFundModalOpen] = useState<string | null>(null);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState<Card | null>(null);
  const [amount, setAmount] = useState('');

  const handleCreateCard = (newCardData: Omit<Card, 'id' | 'createdAt' | 'balance' | 'status' | 'transactions' | 'boxesFilled'>) => {
    if (!user) return;

    const newCard: Card = {
      ...newCardData,
      id: faker.string.uuid(),
      createdAt: new Date(),
      balance: 0,
      status: 'active',
      transactions: [],
      boxesFilled: 0,
    };

    const updatedUser = {
      ...user,
      cards: [...user.cards, newCard],
    };

    updateUser(updatedUser);
    setIsCreateModalOpen(false);
  };

  const handleFundCard = () => {
    if (!user || !isFundModalOpen) return;
    const cardToFund = user.cards.find(c => c.id === isFundModalOpen);
    const depositAmount = Number(amount);
    if (!cardToFund || isNaN(depositAmount) || depositAmount <= 0) return;

    const commission = depositAmount * 0.10;
    const totalDebit = depositAmount + commission;

    if (user.mainAccountBalance < totalDebit) {
      alert("Solde principal insuffisant.");
      return;
    }

    const updatedUser = { ...user };
    updatedUser.mainAccountBalance -= totalDebit;
    const cardIndex = updatedUser.cards.findIndex(c => c.id === isFundModalOpen);
    updatedUser.cards[cardIndex].balance += depositAmount;
    
    if(updatedUser.cards[cardIndex].type === 'pointage' && updatedUser.cards[cardIndex].boxAmount){
      const boxesToAdd = Math.floor(depositAmount / updatedUser.cards[cardIndex].boxAmount!);
      updatedUser.cards[cardIndex].boxesFilled = (updatedUser.cards[cardIndex].boxesFilled || 0) + boxesToAdd;
    }

    updateUser(updatedUser);
    alert(`Carte alimentée de ${formatCurrency(depositAmount)} !`);
    setIsFundModalOpen(null);
    setAmount('');
  };

  const handleWithdrawCard = () => {
    if (!user || !isWithdrawModalOpen) return;
    
    alert(`Le retrait de ${formatCurrency(isWithdrawModalOpen.balance)} a été initié. Les fonds seront disponibles sur votre compte principal dans 24h.`);
    
    const updatedUser = { ...user };
    const cardIndex = updatedUser.cards.findIndex(c => c.id === isWithdrawModalOpen.id);
    updatedUser.cards[cardIndex].balance = 0;
    updatedUser.cards[cardIndex].status = 'interrupted';
    
    updateUser(updatedUser);
    setIsWithdrawModalOpen(null);
  };

  if (!user) return null;

  return (
    <div className="space-y-8 pb-20">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Mes Cartes</h1>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="inline-block mr-2" size={20} />
          Nouvelle Carte
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {user.cards.map(card => (
          <div key={card.id} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-subtle flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="font-semibold text-xl text-gray-800 dark:text-white">{card.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">{card.type}</p>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${card.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{card.status}</span>
              </div>
              
              {card.type === 'pointage' && (
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600 dark:text-gray-300">Progression</span>
                    <span className="font-semibold">{card.boxesFilled || 0} / 30</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                    <div className="bg-orange-500 h-2.5 rounded-full" style={{ width: `${((card.boxesFilled || 0) / 30) * 100}%` }}></div>
                  </div>
                </div>
              )}

              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{formatCurrency(card.balance)}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Objectif: {formatCurrency(card.goal)}</p>
            </div>

            <div className="flex space-x-2 mt-6">
              <Button onClick={() => setIsFundModalOpen(card.id)} className="w-full text-sm py-2" disabled={card.status !== 'active'}>
                {/* <DollarSign size={16} className="inline mr-1" /> Alimenter */} Alimenter
              </Button>
              <Button onClick={() => setIsWithdrawModalOpen(card)} variant="secondary" className="w-full text-sm py-2" disabled={card.status !== 'active' || card.balance === 0}>
                Retirer
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Create Card Modal */}
      <CreateCardModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateCard}
      />

      {/* Fund Modal */}
      <AnimatePresence>
        {isFundModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setIsFundModalOpen(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md"
              onClick={e => e.stopPropagation()}
            >
              <h2 className="text-xl font-bold mb-4">Alimenter la carte</h2>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">Votre solde principal: {formatCurrency(user.mainAccountBalance)}</p>
              <div className="space-y-4">
                <input
                  type="number"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  placeholder="Montant à déposer"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 bg-transparent"
                />
                <div className="bg-gray-100 dark:bg-gray-700/50 p-3 rounded-lg text-sm space-y-1">
                  <div className="flex justify-between"><span>Montant versé sur la carte:</span> <span>{formatCurrency(Number(amount))}</span></div>
                  <div className="flex justify-between"><span>Commission (10%):</span> <span>{formatCurrency(Number(amount) * 0.1)}</span></div>
                  <div className="flex justify-between font-bold border-t pt-1 mt-1 border-gray-300 dark:border-gray-600"><span>Total débité du compte principal:</span> <span>{formatCurrency(Number(amount) * 1.1)}</span></div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="secondary" onClick={() => setIsFundModalOpen(null)}>Annuler</Button>
                  <Button onClick={handleFundCard}>Confirmer</Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Withdraw Modal */}
      <AnimatePresence>
        {isWithdrawModalOpen && (
           <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setIsWithdrawModalOpen(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md text-center"
              onClick={e => e.stopPropagation()}
            >
              <h2 className="text-xl font-bold mb-2">Confirmation de Retrait</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">Vous êtes sur le point de retirer {formatCurrency(isWithdrawModalOpen.balance)}. Les fonds seront disponibles sur votre compte principal après un délai de 24 heures, sans aucune commission.</p>
              <div className="flex justify-center space-x-4">
                  <Button variant="secondary" onClick={() => setIsWithdrawModalOpen(null)}>Annuler</Button>
                  <Button onClick={handleWithdrawCard} className="bg-red-600 text-white">Confirmer le Retrait</Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CardsPage;
