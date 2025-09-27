import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import CardsPage from './pages/CardsPage';
import TransfersPage from './pages/TransfersPage';
import ProfilePage from './pages/ProfilePage';

function AppRoutes() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/LandingPage" element={!user ? <LandingPage /> : <Navigate to="/Dashboard" />} />
      <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/Dashboard" />} />
      <Route path="/register" element={!user ? <RegisterPage /> : <Navigate to="/Dashboard" />} />

      {/* Protected routes */}
      <Route element={user ? <Layout /> : <Navigate to="/LandingPage" />}>
        <Route path="/Dashboard" element={<DashboardPage />} />
        <Route path="/Cards" element={<CardsPage />} />
        <Route path="/Transfers" element={<TransfersPage />} />
        <Route path="/Profile" element={<ProfilePage />} />
      </Route>

      {/* Catch-all to redirect to the correct home page */}
      <Route path="*" element={<Navigate to={user ? "/dashboard" : "/"} />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;
