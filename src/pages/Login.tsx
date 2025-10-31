import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { TrendingUp } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError(''); setIsLoading(true);
    try { await login(email, password); navigate('/dashboard'); }
    catch (err: any) { setError(err.message || 'Failed to login'); }
    finally { setIsLoading(false); }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
              <TrendingUp className="text-white" size={24} />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">MarketPulse</h1>
          </div>
          <h2 className="text-xl font-semibold text-gray-900">Welcome back</h2>
          <p className="text-gray-600">Sign in to your account</p>
        </div>
        {error && <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="you@example.com" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="••••••••" required />
          </div>
          <button type="submit" disabled={isLoading} className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-400">{isLoading ? 'Signing in...' : 'Sign in'}</button>
        </form>
        <div className="mt-6 text-center">
          <p className="text-gray-600">Don't have an account? <Link to="/register" className="text-blue-600 hover:text-blue-700 font-medium">Sign up</Link></p>
        </div>
      </div>
    </div>
  );
}


