import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Button from '@/components/ui/Button';
import { User as UserIcon, Phone, KeyRound } from 'lucide-react';

const ProfilePage: React.FC = () => {
  const { user, updateUser } = useAuth();
  
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [currentPin, setCurrentPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');

  const handleInfoUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      updateUser({ ...user, name, phone });
      alert('Informations mises à jour !');
    }
  };

  const handlePinChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (user?.pin !== currentPin) {
      alert('Ancien code PIN incorrect.');
      return;
    }
    if (newPin !== confirmPin) {
      alert('Les nouveaux codes PIN ne correspondent pas.');
      return;
    }
    if (user) {
      updateUser({ ...user, pin: newPin });
      alert('Code PIN mis à jour avec succès !');
      setCurrentPin('');
      setNewPin('');
      setConfirmPin('');
    }
  };

  return (
    <div className="space-y-12 pb-20 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Mon Profil</h1>
      
      {/* Informations personnelles */}
      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-subtle">
        <h2 className="text-2xl font-bold mb-6">Informations Personnelles</h2>
        <form onSubmit={handleInfoUpdate} className="space-y-6">
          <div className="relative">
            <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nom complet"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 bg-transparent"
            />
          </div>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Numéro de téléphone"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 bg-transparent"
            />
          </div>
          <div className="text-right">
            <Button type="submit">Enregistrer les modifications</Button>
          </div>
        </form>
      </div>

      {/* Changer le PIN */}
      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-subtle">
        <h2 className="text-2xl font-bold mb-6">Changer le Code PIN</h2>
        <form onSubmit={handlePinChange} className="space-y-6">
          <div className="relative">
            <KeyRound className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="password"
              maxLength={4}
              value={currentPin}
              onChange={(e) => setCurrentPin(e.target.value)}
              placeholder="Ancien code PIN"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 bg-transparent"
            />
          </div>
          <div className="relative">
            <KeyRound className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="password"
              maxLength={4}
              value={newPin}
              onChange={(e) => setNewPin(e.target.value)}
              placeholder="Nouveau code PIN"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 bg-transparent"
            />
          </div>
          <div className="relative">
            <KeyRound className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="password"
              maxLength={4}
              value={confirmPin}
              onChange={(e) => setConfirmPin(e.target.value)}
              placeholder="Confirmer le nouveau code PIN"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 bg-transparent"
            />
          </div>
          <div className="text-right">
            <Button type="submit">Changer le PIN</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
