import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Button from '@/components/ui/Button';
import { formatCurrency } from '@/utils/helpers';
import { X } from 'lucide-react';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'deposit' | 'withdraw';
  onSubmit: (data: { amount: number; provider: string; phone: string }) => void;
}

const TransactionModal: React.FC<TransactionModalProps> = ({ isOpen, onClose, mode, onSubmit }) => {
  const [amount, setAmount] = useState('');
  const [provider, setProvider] = useState('MTN Mobile Money');
  const [phone, setPhone] = useState('');

  const handleSubmit = () => {
    const numericAmount = Number(amount);
    if (numericAmount > 0 && phone.trim() !== '') {
      onSubmit({ amount: numericAmount, provider, phone });
    } else {
      alert("Veuillez remplir tous les champs correctement.");
    }
  };

  const title = mode === 'deposit' ? 'Faire un dépôt' : 'Faire un retrait';
  const total = Number(amount) || 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md relative"
            onClick={e => e.stopPropagation()}
          >
            <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
              <X size={24} />
            </button>
            <h2 className="text-2xl font-bold mb-6">{title}</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Montant ({mode === 'deposit' ? 'du dépôt' : 'du retrait'}) (FCFA)</label>
                <input
                  type="number"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  placeholder="1000"
                  className="w-full mt-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 bg-transparent"
                />
              </div>

              <div className="bg-gray-100 dark:bg-gray-700/50 p-3 rounded-lg text-sm space-y-1">
                <div className="flex justify-between"><span>Commission (0%):</span> <span>{formatCurrency(0)}</span></div>
                <div className="flex justify-between font-bold border-t pt-1 mt-1 border-gray-300 dark:border-gray-600">
                  <span>Total à {mode === 'deposit' ? 'débiter' : 'créditer'}:</span>
                  <span className="text-orange-600">{formatCurrency(total)}</span>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Méthode de paiement</label>
                <select
                  value={provider}
                  onChange={e => setProvider(e.target.value)}
                  className="w-full mt-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 bg-transparent"
                >
                  <option>MTN Mobile Money</option>
                  <option>Airtel Money</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Numéro de téléphone du compte</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="Ex: 06 123 4567"
                  className="w-full mt-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 bg-transparent"
                />
              </div>
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="secondary" onClick={onClose}>Annuler</Button>
                <Button onClick={handleSubmit} className="bg-green-600 text-white focus:ring-green-400">Confirmer</Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TransactionModal;
