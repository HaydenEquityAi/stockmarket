import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

const API_URL = 'https://backend.brokerai.ai:8088/api';

interface User { id: string; email: string; name: string }
interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (token) fetchCurrentUser(); else setIsLoading(false);
  }, [token]);

  const fetchCurrentUser = async () => {
    try {
      const response = await fetch(`${API_URL}/auth/me`, { headers: { Authorization: `Bearer ${token}` } });
      if (response.ok) {
        const data = await response.json();
        setUser(data.user || data);
      } else if (response.status === 401) {
        // Only logout on 401 (unauthorized) - token is invalid
        console.log('Token invalid, logging out');
        logout();
      } else {
        // For other errors, keep the user logged in but log the error
        console.error('Error fetching user:', response.status, response.statusText);
      }
    } catch (error) {
      // Network errors shouldn't auto-logout - might be temporary
      console.error('Error fetching user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password })
    });
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || 'Login failed');
    }
    const data = await response.json();
    if (!data.token) {
      throw new Error('No token received from server');
    }
    setToken(data.token);
    setUser(data.user || data);
    localStorage.setItem('token', data.token);
  };

  const register = async (email: string, password: string, name: string) => {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password, name })
    });
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || 'Registration failed');
    }
    const data = await response.json();
    if (!data.token) {
      throw new Error('No token received from server');
    }
    setToken(data.token);
    setUser(data.user || data);
    localStorage.setItem('token', data.token);
  };

  const logout = () => { setUser(null); setToken(null); localStorage.removeItem('token'); };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, isAuthenticated: !!user, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}


