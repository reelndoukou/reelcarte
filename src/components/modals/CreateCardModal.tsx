import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, ArrowLeft, TrendingUp, ShieldCheck, Gift } from 'lucide-react';
import Button from '@/components/ui/Button';
import { Card, CardType } from '@/types';
import { formatCurrency } from '@/utils/helpers';

interface CreateCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (cardData: Omit<Card, 'id' | 'createdAt' | 'balance' | 'status' | 'transactions' | 'boxesFilled'>) => void;
}

const cardTypeDetails = {
  pointage: {
    icon: <TrendingUp className="w-8 h-8 text-orange-DEFAULT" />,
    title: 'Carte de Pointage',
    description: 'Atteignez vos objectifs étape par étape.',
  },
  epargne: {
    icon: <ShieldCheck className="w-8 h-8 text-orange-DEFAULT" />,
    title: 'Carte Épargne',
    description: 'Épargnez à votre rythme pour un but précis.',
  },
  offrant: {
    icon: <Gift className="w-8 h-8 text-orange-DEFAULT" />,
    title: 'Carte Offrant',
    description: 'Idéal pour les commerçants et les cagnottes.',
  },
};

const CreateCardModal: React.FC<CreateCardModalProps> = ({ isOpen, onClose, onCreate }) => {
  const [step, setStep] = useState(1);
  const [selectedType, setSelectedType] = useState<CardType | null>(null);
  const [cardName, setCardName] = useState('');
  const [boxAmount, setBoxAmount] = useState('');
  const [goalAmount, setGoalAmount] = useState('');

  const handleSelectType = (type: CardType) => {
    setSelectedType(type);
    setStep(2);
  };

  const handleBack = () => {
    setStep(1);
    // Reset fields when going back
    setTimeout(() => {
        setSelectedType(null);
        setCardName('');
        setBoxAmount('');
        setGoalAmount('');
    }, 300) // wait for animation
  };

  const handleCreate = () => {
    if (!selectedType || !cardName) return;

    let cardData: Omit<Card, 'id' | 'createdAt' | 'balance' | 'status' | 'transactions' | 'boxesFilled'>;

    if (selectedType === 'pointage') {
      const numericBoxAmount = Number(boxAmount);
      if (isNaN(numericBoxAmount) || numericBoxAmount <= 0) {
        alert("Veuillez entrer un montant valide pour chaque case.");
        return;
      }
      cardData = {
        name: cardName,
        type: 'pointage',
        goal: numericBoxAmount * 30,
        boxAmount: numericBoxAmount,
      };
    } else {
      const numericGoalAmount = Number(goalAmount);
      if (isNaN(numericGoalAmount) || numericGoalAmount <= 0) {
        alert("Veuillez entrer un objectif valide.");
        return;
      }
      cardData = {
        name: cardName,
        type: selectedType,
        goal: numericGoalAmount,
      };
    }

    onCreate(cardData);
    // Reset state after creation
    handleBack();
  };

  const renderStep1 = () => (
    <motion.div
      key="step1"
      initial={{ opacity: 0, x: -100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-2xl font-bold mb-6 text-center">Choisir un type de carte</h2>
      <div className="space-y-4">
        {Object.entries(cardTypeDetails).map(([type, details]) => (
          <button
            key={type}
            onClick={() => handleSelectType(type as CardType)}
            className="w-full flex items-center space-x-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
          >
            <div className="bg-orange-100 p-3 rounded-lg">{details.icon}</div>
            <div>
              <p className="font-semibold text-lg text-left">{details.title}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 text-left">{details.description}</p>
            </div>
          </button>
        ))}
      </div>
    </motion.div>
  );

  const renderStep2 = () => {
    if (!selectedType) return null;
    const isPointage = selectedType === 'pointage';
    const calculatedGoal = isPointage ? (Number(boxAmount) || 0) * 30 : null;

    return (
      <motion.div
        key="step2"
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -100 }}
        transition={{ duration: 0.3 }}
        className="space-y-6"
      >
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Nom de la carte</label>
          <input
            type="text"
            value={cardName}
            onChange={e => setCardName(e.target.value)}
            placeholder="Ex: Épargne Vacances"
            className="w-full mt-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 bg-transparent"
          />
        </div>

        {isPointage ? (
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Montant par case (sur 30 cases)</label>
            <input
              type="number"
              value={boxAmount}
              onChange={e => setBoxAmount(e.target.value)}
              placeholder="Ex: 1000"
              className="w-full mt-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 bg-transparent"
            />
             {calculatedGoal !== null && calculatedGoal > 0 && (
                <p className="text-sm text-gray-500 mt-2">Objectif total calculé: <span className="font-bold text-orange-600">{formatCurrency(calculatedGoal)}</span></p>
             )}
          </div>
        ) : (
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Objectif à atteindre</label>
            <input
              type="number"
              value={goalAmount}
              onChange={e => setGoalAmount(e.target.value)}
              placeholder="Ex: 500000"
              className="w-full mt-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 bg-transparent"
            />
          </div>
        )}

        <div className="flex justify-between items-center pt-4">
          <Button variant="secondary" onClick={handleBack}>
            <ArrowLeft size={16} className="inline mr-1" /> Précédent
          </Button>
          <Button onClick={handleCreate}>Créer la carte</Button>
        </div>
      </motion.div>
    );
  };

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
            className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md relative overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10">
              <X size={24} />
            </button>
            <AnimatePresence mode="wait">
              {step === 1 ? renderStep1() : renderStep2()}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CreateCardModal;
