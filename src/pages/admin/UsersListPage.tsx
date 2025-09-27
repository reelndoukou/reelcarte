import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '@/components/admin/PageHeader';
import { mockUsers } from '@/data/mockData';
import { formatCurrency, formatDate } from '@/utils/helpers';
import { Eye, ShieldCheck, ShieldOff, MoreVertical } from 'lucide-react';
import { User, UserStatus } from '@/types';

const UsersListPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.phone.includes(searchTerm)
  );

  const toggleUserStatus = (userId: string) => {
    setUsers(currentUsers =>
      currentUsers.map(user =>
        user.id === userId
          ? { ...user, status: user.status === 'active' ? 'suspended' : 'active' }
          : user
      )
    );
    setOpenMenuId(null);
  };

  const getStatusBadge = (status: UserStatus) => {
    const classes = {
      active: 'bg-green-100 text-green-700',
      suspended: 'bg-red-100 text-red-700',
    };
    return <span className={`px-2 py-1 text-xs font-medium rounded-full ${classes[status]}`}>{status === 'active' ? 'Actif' : 'Suspendu'}</span>;
  };

  return (
    <>
      <PageHeader title="Gestion des Utilisateurs" subtitle={`Liste des ${users.length} utilisateurs de la plateforme.`} />
      
      <div className="bg-white p-6 rounded-xl shadow-card">
        <div className="mb-4">
          <input
            type="text"
            placeholder="Rechercher par nom, email ou téléphone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-sm px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3">Utilisateur</th>
                <th scope="col" className="px-6 py-3">Contact</th>
                <th scope="col" className="px-6 py-3">Solde Principal</th>
                <th scope="col" className="px-6 py-3">Statut</th>
                <th scope="col" className="px-6 py-3">Inscrit le</th>
                <th scope="col" className="px-6 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user.id} className="bg-white border-b hover:bg-gray-50">
                  <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap flex items-center space-x-3">
                    <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full" />
                    <span>{user.name}</span>
                  </th>
                  <td className="px-6 py-4">
                    <div>{user.email}</div>
                    <div className="text-xs text-gray-400">{user.phone}</div>
                  </td>
                  <td className="px-6 py-4 font-semibold">{formatCurrency(user.mainAccountBalance)}</td>
                  <td className="px-6 py-4">{getStatusBadge(user.status)}</td>
                  <td className="px-6 py-4">{formatDate(user.createdAt)}</td>
                  <td className="px-6 py-4 text-center">
                    <div className="relative inline-block">
                      <button onClick={() => setOpenMenuId(openMenuId === user.id ? null : user.id)} className="p-2 rounded-md hover:bg-gray-100">
                        <MoreVertical size={16}/>
                      </button>
                      {openMenuId === user.id && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border">
                          <ul className="py-1">
                            <li>
                              <Link to={`/users/${user.id}`} className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                <Eye size={16} className="mr-2"/> Voir les détails
                              </Link>
                            </li>
                            <li>
                              <button onClick={() => toggleUserStatus(user.id)} className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                {user.status === 'active' ? <ShieldOff size={16} className="mr-2 text-red-500"/> : <ShieldCheck size={16} className="mr-2 text-green-500"/>}
                                {user.status === 'active' ? 'Suspendre' : 'Réactiver'}
                              </button>
                            </li>
                          </ul>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default UsersListPage;
