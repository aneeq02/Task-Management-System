import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!name.trim()) {
      setError('Please enter your name.');
      return;
    }
    if (!email.trim()) {
      setError('Please enter your email.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      const { data } = await authService.register({
        name: name.trim(),
        email: email.trim(),
        password,
      });
      login(data.user, data.token);
      toast.success('Account created!');
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
      toast.error(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="  min-h-screen flex items-center justify-center px-4
  bg-gradient-to-br from-sand-100 via-primary-50/50 to-white
  dark:from-primary-900 dark:via-primary-800 dark:to-secondary-900">
      <div className="w-full max-w-md">
        <div className="bg-white/95 rounded-2xl shadow-soft p-8 border border-sand-200 animate-fade-in-up
  dark:bg-primary-800/70 dark:border-primary-700">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-primary-600">Create account</h1>
            <p className="text-secondary-500 mt-1">Get started with TaskFlow</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm">
                {error}
              </div>
            )}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-secondary-200 mb-1.5">
                Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="  w-full px-4 py-2.5 rounded-lg border border-sand-300 bg-sand-50/40
  focus:ring-2 focus:ring-accent-400 focus:border-accent-400 outline-none transition
  dark:border-primary-700 dark:bg-primary-900/40 dark:text-sand-50 dark:placeholder-secondary-400"
                placeholder="Your name"
                autoComplete="name"
                disabled={loading}
              />
            </div>
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
                placeholder="At least 6 characters"
                autoComplete="new-password"
                disabled={loading}
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 dark:text-secondary-200 mb-1.5">
                Confirm password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="  w-full px-4 py-2.5 rounded-lg border border-sand-300 bg-sand-50/40
  focus:ring-2 focus:ring-accent-400 focus:border-accent-400 outline-none transition
  dark:border-primary-700 dark:bg-primary-900/40 dark:text-sand-50 dark:placeholder-secondary-400"
                placeholder="Repeat password"
                autoComplete="new-password"
                disabled={loading}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-primary-600 text-accent-100 font-semibold hover:bg-primary-700 focus:ring-2 focus:ring-accent-400 focus:ring-offset-2 focus:ring-offset-sand-100 disabled:opacity-50 disabled:cursor-not-allowed transition-transform transform hover:-translate-y-0.5 hover:shadow-soft"
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-secondary-500">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-accent-600 hover:text-accent-700">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
