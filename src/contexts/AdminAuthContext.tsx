import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface Admin {
  username: string;
  name: string;
}

interface AdminAuthContextType {
  admin: Admin | null;
  login: (username: string, pin: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedAdmin = localStorage.getItem('reelcarte_admin');
    if (storedAdmin) {
      setAdmin(JSON.parse(storedAdmin));
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, pin: string): Promise<boolean> => {
    setIsLoading(true);
    // Mock admin authentication
    if (username === 'admin' && pin === '1234') {
      const adminData: Admin = { username: 'admin', name: 'Admin REELCarte' };
      setAdmin(adminData);
      localStorage.setItem('reelcarte_admin', JSON.stringify(adminData));
      setIsLoading(false);
      return true;
    }
    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setAdmin(null);
    localStorage.removeItem('reelcarte_admin');
  };

  return (
    <AdminAuthContext.Provider value={{ admin, login, logout, isLoading }}>
      {children}
    </AdminAuthContext.Provider>
  );
};
