// import React from 'react';
// import { Link } from 'react-router-dom';
// import { motion } from 'framer-motion';
// import { ShieldCheck, TrendingUp, Gift, ArrowRight } from 'lucide-react';
// import Button from '@/components/ui/Button';
// import LandingHeader from '@/components/LandingHeader';

// const LandingPage: React.FC = () => {
//   const features = [
//     {
//       icon: <TrendingUp className="w-8 h-8 text-orange-DEFAULT" />,
//       title: 'Carte de Pointage',
//       description: 'Atteignez vos objectifs d\'épargne étape par étape avec nos 30 cases de dépôt.',
//     },
//     {
//       icon: <ShieldCheck className="w-8 h-8 text-orange-DEFAULT" />,
//       title: 'Carte Épargne',
//       description: 'Épargnez à votre rythme avec des dépôts flexibles et un montant personnalisé.',
//     },
//     {
//       icon: <Gift className="w-8 h-8 text-orange-DEFAULT" />,
//       title: 'Carte Offrant',
//       description: 'Parfait pour les commerçants et les cadeaux, avec des paiements fractionnés.',
//     },
//   ];

//   return (
//     <div className="bg-gray-50 text-gray-800">
//       <LandingHeader />
//       {/* Hero Section */}
//       <section className="relative min-h-screen flex items-center justify-center text-white bg-hero-landing overflow-hidden pt-20">
//         <div className="absolute -bottom-40 -left-40 w-96 h-96 lg:w-[32rem] lg:h-[32rem] bg-purple-900/50 rounded-full filter blur-3xl opacity-50 animate-pulse"></div>
//         <div className="absolute -top-40 -right-40 w-96 h-96 lg:w-[32rem] lg:h-[32rem] bg-orange-600/40 rounded-full filter blur-3xl opacity-50 animate-pulse animation-delay-4000"></div>
        
//         <div className="relative z-10 text-center px-4">
//           <motion.h1 
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.8 }}
//             className="text-5xl md:text-7xl font-bold font-display mb-4"
//           >
//             Gérez votre épargne<br/>
//             <span className="text-orange-400">en toute simplicité</span>
//           </motion.h1>
//           <motion.p 
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.8, delay: 0.2 }}
//             className="text-lg md:text-xl max-w-2xl mx-auto mb-8 text-gray-300"
//           >
//             REELCarte offre une solution simple et sécurisée pour gérer votre argent via des cartes de pointage, sans formalités bancaires complexes.
//           </motion.p>
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.8, delay: 0.4 }}
//             className="flex flex-col sm:flex-row items-center justify-center gap-4"
//           >
//             <Link to="/register">
//               <Button className="flex items-center gap-2">
//                 Commencer maintenant <ArrowRight size={16} />
//               </Button>
//             </Link>
//             <Link to="/login">
//               <Button variant="outline">Se connecter</Button>
//             </Link>
//           </motion.div>
//         </div>
//       </section>

//       {/* Features Section */}
//       <section id="features" className="py-20">
//         <div className="container mx-auto px-4">
//           <div className="text-center mb-12">
//             <h2 className="text-4xl font-bold font-display">Nos Types de Cartes</h2>
//             <p className="text-gray-600 mt-2">Des solutions adaptées à chaque besoin.</p>
//           </div>
//           <div className="grid md:grid-cols-3 gap-8">
//             {features.map((feature, index) => (
//               <motion.div
//                 key={index}
//                 initial={{ opacity: 0, y: 20 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 viewport={{ once: true }}
//                 transition={{ duration: 0.5, delay: index * 0.1 }}
//                 className="bg-white p-8 rounded-xl shadow-subtle text-center"
//               >
//                 <div className="inline-block bg-orange-100 p-4 rounded-full mb-4">
//                   {feature.icon}
//                 </div>
//                 <h3 className="text-2xl font-bold font-display mb-2">{feature.title}</h3>
//                 <p className="text-gray-600">{feature.description}</p>
//               </motion.div>
//             ))}
//           </div>
//         </div>
//       </section>
      
//       {/* CTA Section */}
//       <section className="bg-orange-DEFAULT text-white">
//         <div className="container mx-auto px-4 py-20 text-center">
//           <h2 className="text-4xl font-bold font-display mb-4">Prêt à prendre le contrôle ?</h2>
//           <p className="max-w-xl mx-auto mb-8">Rejoignez des milliers d'utilisateurs qui simplifient leur gestion financière avec REELCarte.</p>
//           <Link to="/register">
//             <Button variant="secondary" className="bg-white text-orange-DEFAULT hover:bg-gray-100">Commencer maintenant</Button>
//           </Link>
//         </div>
//       </section>
//     </div>
//   );
// };

// export default LandingPage;
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  CreditCard,
  Shield,
  Smartphone,
  TrendingUp,
  Users,
  Clock,
  ArrowRight
} from 'lucide-react';

const features = [
  {
    icon: CreditCard,
    title: 'Trois Types de Cartes',
    description: 'Carte de Pointage, Carte Épargne et Carte Offrant adaptées à tous vos besoins.',
  },
  {
    icon: Shield,
    title: 'Sécurité Maximale',
    description: 'Vos fonds sont protégés avec chiffrement avancé et double authentification.',
  },
  {
    icon: Smartphone,
    title: 'Monnaie Mobile Intégrée',
    description: 'Dépôts faciles via Mobile Money et Airtel Money.',
  },
  {
    icon: Clock,
    title: 'Retraits 24h',
    description: 'Retraits disponibles après 24 heures pour votre sécurité.',
  },
  {
    icon: TrendingUp,
    title: 'Gestion Simplifiée',
    description: 'Interface intuitive pour suivre vos épargnes et transactions.',
  },
  {
    icon: Users,
    title: 'Pour Tous',
    description: 'Particuliers, entreprises et écoles - une solution pour chacun.',
  },
];

const cardTypes = [
  {
    name: 'Carte de Pointage',
    description: '30 cases représentant chacune un dépôt. Parfait pour épargner de manière progressive.',
    color: 'from-orange-400 to-orange-600',
    commission: '10%',
  },
  {
    name: 'Carte Épargne',
    description: 'Montant personnalisé avec dépôts flexibles à partir de 100 FCFA.',
    color: 'from-blue-400 to-blue-600',
    commission: '10%',
  },
  {
    name: 'Carte Offrant',
    description: 'Destinée aux commerçants avec paiements fractionnés et cadeaux financiers.',
    color: 'from-green-400 to-green-600',
    commission: '10%',
  },
];

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                <img src="/logo.png" alt="REELCarte Logo" className="w-50 h-50 object-contain object-contain rounded-lg" />
              </div>
              <span className="text-2xl font-bold text-gray-900">REELCarte</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="text-gray-700 hover:text-orange-600 font-medium transition-colors duration-200 px-6 py-2"
              >
                Connexion
              </Link>
              <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
                <Link
                  to="/register"
                  className="bg-orange-500 text-white px-6 py-2 rounded-lg font-medium shadow-md hover:bg-orange-600 hover:shadow-lg transition-all duration-300"
                >
                  S'inscrire
                </Link>
              </motion.div>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section
        className="relative overflow-hidden bg-cover bg-center"
        style={{
          backgroundImage: "url('/banner.png')",
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-4xl md:text-6xl font-bold text-white mb-6"
            >
              Gérez votre épargne
              <span className="text-orange-500 block">en toute simplicité</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl text-gray-200 mb-8 max-w-3xl mx-auto"
            >
              REELCarte offre une solution simple et sécurisée pour gérer votre argent
              via des cartes de pointage, sans formalités bancaires complexes.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <motion.div whileHover={{ y: -3, scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/register"
                  className="bg-orange-500 text-white px-8 py-4 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
                >
                  Commencer maintenant
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </motion.div>
              <motion.div whileHover={{ y: -3, scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <a className="border-2 border-white text-white hover:bg-white hover:text-orange-500 px-8 py-3.5 rounded-lg font-semibold text-lg transition-all duration-300 flex items-center justify-center" href="tel:+242055015300">Contacter </a>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Card Types Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Trois types de cartes pour tous vos besoins
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choisissez la carte qui correspond le mieux à votre style d'épargne et vos objectifs financiers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {cardTypes.map((card, index) => (
              <motion.div
                key={card.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-luxury p-8 text-center"
              >
                <div className={`w-20 h-12 bg-gradient-to-r ${card.color} rounded-lg mx-auto mb-6 flex items-center justify-center`}>
                  <CreditCard className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{card.name}</h3>
                <p className="text-gray-600 mb-6">{card.description}</p>
                <div className="bg-orange-50 rounded-lg p-4">
                  <span className="text-orange-600 font-semibold">Commission: {card.commission}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Pourquoi choisir REELCarte ?
            </h2>
            <p className="text-xl text-gray-600">
              Une plateforme conçue pour simplifier votre gestion financière
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Icon className="w-8 h-8 text-orange-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-orange-500 to-orange-600 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Prêt à commencer votre épargne ?
          </h2>
          <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
            Rejoignez des milliers d'utilisateurs qui font confiance à REELCarte
            pour gérer leur épargne en toute sécurité.
          </p>
          <motion.div whileHover={{ y: -3, scale: 1.05 }} whileTap={{ scale: 0.95 }} className="inline-block">
            <Link
              to="/register"
              className="bg-white text-orange-500 px-8 py-4 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 inline-flex items-center"
            >
              Créer mon compte gratuit
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                <img src="/logo.png" alt="REELCarte Logo" className="w-50 h-50 object-contain object-contain rounded-lg" />
              </div>
              <span className="text-xl font-bold">REELCarte</span>
            </div>
            <p className="text-gray-400">
              © 2025 REELCarte. Gestion simplifiée de l'épargne, plus proche de chez vous en République du Congo.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
// ...existing code...
