import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '../types';
import { getUser, saveUser, removeUser } from '../utils/local-storage';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithPhone: (phoneNumber: string, code: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  signupWithPhone: (name: string, phoneNumber: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for saved user on mount
    const savedUser = getUser();
    if (savedUser) {
      setUser(savedUser);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // In a real app, this would validate credentials against a backend
    // For this demo, we'll create a mock user
    setIsLoading(true);
    
    try {
      // Simulate API request
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUser: User = {
        id: '1',
        name: 'Admin User',
        email,
        role: 'admin'
      };
      
      saveUser(mockUser);
      setUser(mockUser);
    } catch (error) {
      console.error('Login failed:', error);
      throw new Error('Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setIsLoading(true);
    
    try {
      // Simulate Google auth
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUser: User = {
        id: '2',
        name: 'Google User',
        email: 'google.user@example.com',
        role: 'admin'
      };
      
      saveUser(mockUser);
      setUser(mockUser);
    } catch (error) {
      console.error('Google login failed:', error);
      throw new Error('Google login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithPhone = async (phoneNumber: string, code: string) => {
    setIsLoading(true);
    
    try {
      // Simulate phone verification
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUser: User = {
        id: '3',
        name: 'Phone User',
        phoneNumber,
        email: `phone.${phoneNumber}@example.com`,
        role: 'admin'
      };
      
      saveUser(mockUser);
      setUser(mockUser);
    } catch (error) {
      console.error('Phone login failed:', error);
      throw new Error('Invalid verification code');
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    
    try {
      // Simulate API request
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUser: User = {
        id: Date.now().toString(),
        name,
        email,
        role: 'admin'
      };
      
      saveUser(mockUser);
      setUser(mockUser);
    } catch (error) {
      console.error('Signup failed:', error);
      throw new Error('Signup failed');
    } finally {
      setIsLoading(false);
    }
  };

  const signupWithPhone = async (name: string, phoneNumber: string) => {
    setIsLoading(true);
    
    try {
      // Simulate API request
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUser: User = {
        id: Date.now().toString(),
        name,
        phoneNumber,
        email: `${name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
        role: 'admin'
      };
      
      saveUser(mockUser);
      setUser(mockUser);
    } catch (error) {
      console.error('Phone signup failed:', error);
      throw new Error('Phone signup failed');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    removeUser();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        loginWithGoogle,
        loginWithPhone,
        signup,
        signupWithPhone,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};