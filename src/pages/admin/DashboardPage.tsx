import React from 'react';
import PageHeader from '@/components/admin/PageHeader';
import StatCard from '@/components/admin/StatCard';
import { getGlobalStats, getUserRegistrationTrend, allTransactions } from '@/data/mockData';
import { formatCurrency, formatDate } from '@/utils/helpers';
import { Users, Wallet, Percent, CreditCard, UserPlus, ArrowRightLeft } from 'lucide-react';
import ReactECharts from 'echarts-for-react';
import { CardType } from '@/types';
import { Link } from 'react-router-dom';

const DashboardPage: React.FC = () => {
  const stats = getGlobalStats();
  const userTrend = getUserRegistrationTrend();
  const recentTransactions = allTransactions.slice(0, 5);

  const cardTypeColors: Record<CardType, string> = {
    pointage: '#f97316',
    epargne: '#3b82f6',
    offrant: '#22c55e',
  };

  const revenueChartOptions = {
    tooltip: { trigger: 'item', formatter: '{b}: {c} FCFA ({d}%)' },
    legend: { orient: 'vertical', left: 'left', top: 'center' },
    series: [
      {
        name: 'Commissions',
        type: 'pie',
        radius: ['50%', '80%'],
        center: ['70%', '50%'],
        avoidLabelOverlap: false,
        label: { show: false },
        emphasis: {
          label: { show: true, fontSize: '16', fontWeight: 'bold' },
        },
        labelLine: { show: false },
        data: Object.entries(stats.cardTypeCommissions).map(([type, value]) => ({
          value,
          name: type.charAt(0).toUpperCase() + type.slice(1),
          itemStyle: { color: cardTypeColors[type as CardType] },
        })),
      },
    ],
  };
  
  const userTrendChartOptions = {
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: userTrend.labels },
    yAxis: { type: 'value' },
    series: [{ data: userTrend.data, type: 'line', smooth: true, color: '#ff6b35' }],
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true }
  };

  return (
    <>
      <PageHeader title="Dashboard" subtitle="Aperçu général de la plateforme REELCarte." />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
        <StatCard icon={<Users className="text-white"/>} title="Total Utilisateurs" value={stats.totalUsers} color="bg-blue-500" />
        <StatCard icon={<Wallet className="text-white"/>} title="Solde Total" value={formatCurrency(stats.totalBalance)} color="bg-green-500" />
        <StatCard icon={<Percent className="text-white"/>} title="Total Commissions" value={formatCurrency(stats.totalCommission)} color="bg-orange-500" />
        <StatCard icon={<CreditCard className="text-white"/>} title="Total Cartes" value={stats.totalCards} color="bg-purple-500" />
        <StatCard icon={<UserPlus className="text-white"/>} title="Nouveaux (7j)" value={`+${stats.newUsersLast7Days}`} color="bg-sky-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-card">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Tendance des inscriptions</h3>
          <ReactECharts option={userTrendChartOptions} style={{ height: '300px' }} />
        </div>
        <div className="bg-white p-6 rounded-xl shadow-card">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Commissions par type</h3>
          <ReactECharts option={revenueChartOptions} style={{ height: '300px' }} />
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-card">
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Transactions Récentes</h3>
            <Link to="/transactions" className="text-sm font-medium text-orange-600 hover:underline">Voir tout</Link>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500">
                <tbody>
                    {recentTransactions.map(t => (
                        <tr key={t.id} className="border-b last:border-0 hover:bg-gray-50">
                            <td className="px-4 py-3">
                                <div className="flex items-center space-x-3">
                                    <img src={t.userAvatar} alt={t.userName} className="w-8 h-8 rounded-full" />
                                    <div>
                                        <p className="font-medium text-gray-800">{t.userName}</p>
                                        <p className="text-xs text-gray-500">{t.cardName}</p>
                                    </div>
                                </div>
                            </td>
                            <td className="px-4 py-3 text-gray-600">{t.description}</td>
                            <td className="px-4 py-3 text-gray-500">{formatDate(t.date)}</td>
                            <td className={`px-4 py-3 text-right font-semibold ${t.type === 'deposit' ? 'text-green-600' : 'text-red-600'}`}>
                                {t.type === 'deposit' ? '+' : '-'} {formatCurrency(t.amount)}
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

export default DashboardPage;
