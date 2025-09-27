import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { mockUser } from '@/data/mockData';
import type { User } from '@/types';

interface AuthContextType {
  user: User | null;
  login: (phone: string, pin: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  updateUser: (updatedUser: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate checking for a logged-in user
    const storedUser = localStorage.getItem('reelcarte_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      // For demo, auto-login the mock user
      localStorage.setItem('reelcarte_user', JSON.stringify(mockUser));
      setUser(mockUser);
    }
    setIsLoading(false);
  }, []);

  const login = async (phone: string, pin: string): Promise<boolean> => {
    setIsLoading(true);
    // Mock authentication
    if (phone === mockUser.phone && pin === mockUser.pin) {
      setUser(mockUser);
      localStorage.setItem('reelcarte_user', JSON.stringify(mockUser));
      setIsLoading(false);
      return true;
    }
    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('reelcarte_user');
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('reelcarte_user', JSON.stringify(updatedUser));
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};
