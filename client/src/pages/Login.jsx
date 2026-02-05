import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email.trim() || !password) {
      setError('Please enter email and password.');
      return;
    }
    setLoading(true);
    try {
      const { data } = await authService.login({ email: email.trim(), password });
      login(data.user, data.token);
      toast.success('Welcome back!');
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
      toast.error(err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4
  bg-gradient-to-br from-sand-100 via-primary-50/50 to-white
  dark:from-primary-900 dark:via-primary-800 dark:to-secondary-900">
      <div className="w-full max-w-md">
        <div className="bg-white/95 rounded-2xl shadow-soft p-8 border border-sand-200 animate-fade-in-up
  dark:bg-primary-800/70 dark:border-primary-700">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-primary-600">Welcome back</h1>
            <p className="text-secondary-500 mt-1">Sign in to your TaskFlow account</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm">
                {error}
              </div>
            )}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-secondary-200 mb-1.5">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="  w-full px-4 py-2.5 rounded-lg border border-sand-300 bg-sand-50/40
  focus:ring-2 focus:ring-accent-400 focus:border-accent-400 outline-none transition
  dark:border-primary-700 dark:bg-primary-900/40 dark:text-sand-50 dark:placeholder-secondary-400"
                placeholder="aneeq@gmail.com"
                autoComplete="email"
                disabled={loading}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-secondary-200 mb-1.5">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="  w-full px-4 py-2.5 rounded-lg border border-sand-300 bg-sand-50/40
  focus:ring-2 focus:ring-accent-400 focus:border-accent-400 outline-none transition
  dark:border-primary-700 dark:bg-primary-900/40 dark:text-sand-50 dark:placeholder-secondary-400"
                placeholder="••••••••"
                autoComplete="current-password"
                disabled={loading}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-primary-600 text-accent-100 font-semibold hover:bg-primary-700 focus:ring-2 focus:ring-accent-400 focus:ring-offset-2 focus:ring-offset-sand-100 disabled:opacity-50 disabled:cursor-not-allowed transition-transform transform hover:-translate-y-0.5 hover:shadow-soft"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-secondary-500">
            Don't have an account?{' '}
            <Link to="/register" className="font-medium text-accent-600 hover:text-accent-700">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
