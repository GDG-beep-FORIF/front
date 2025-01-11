import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
    email: string;
    userId: string;
}
  
interface AuthContextType {
    user: User | null;
    login: (userData: { user: User }) => void;
    logout: () => void;
    isAuthenticated: boolean;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
  
    // 초기 인증 상태 복원
    useEffect(() => {
      const initializeAuth = () => {
        setIsLoading(true);
        const storedUser = localStorage.getItem('user');
  
        if (storedUser) {
          try {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            setIsAuthenticated(true);
          } catch (error) {
            console.error('Failed to parse stored user:', error);
            logout();
          }
        }
        setIsLoading(false);
      };
  
      initializeAuth();
    }, []);
  
    const login = (userData: { user: User }) => {
      setUser(userData.user);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(userData.user));
    };
  
    const logout = () => {
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('user');
    };
  
    return (
      <AuthContext.Provider value={{ user, login, logout, isAuthenticated, isLoading }}>
        {children}
      </AuthContext.Provider>
    );
  };


export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
      throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};