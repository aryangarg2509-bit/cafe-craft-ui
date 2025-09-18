import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types/cafe';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: 'cafe' | 'admin') => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const savedUser = localStorage.getItem('cafeUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string, role: 'cafe' | 'admin'): Promise<boolean> => {
    setIsLoading(true);
    
    // Mock authentication - in real app, this would be API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Demo credentials
    const validCredentials = {
      cafe: { email: 'cafe@demo.com', password: 'cafe123' },
      admin: { email: 'admin@demo.com', password: 'admin123' }
    };

    if (validCredentials[role].email === email && validCredentials[role].password === password) {
      const newUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        email,
        role,
        name: role === 'admin' ? 'Admin User' : 'Cafe Manager'
      };
      
      setUser(newUser);
      localStorage.setItem('cafeUser', JSON.stringify(newUser));
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('cafeUser');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};