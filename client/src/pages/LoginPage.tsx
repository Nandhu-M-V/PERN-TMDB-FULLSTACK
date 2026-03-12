import { useState } from 'react';
import { login, register } from '../api/auth';
import { useAuth } from '@/context/useAuth';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async () => {
    try {
      setError('');
      setLoading(true);

      const data = isLogin
        ? await login(email, password)
        : await register(email, password);

      setUser(data.user);
      navigate('/');
    } catch (err) {
      console.error(err);
      setError(isLogin ? 'Login failed' : 'Register failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-300 dark:bg-gray-950 px-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white">
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h2>

        <p className="text-center text-gray-500 text-sm mt-2 mb-6">
          {isLogin
            ? 'Login to continue'
            : 'Register to start exploring movies and tvshows'}
        </p>

        {error && (
          <div className="bg-red-100 text-red-700 text-sm p-3 rounded-md mb-4 text-center">
            {error}
          </div>
        )}

        {/* Email */}
        <label className="text-sm text-gray-600 dark:text-gray-300">
          Email
        </label>
        <input
          type="email"
          placeholder="example@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mt-1 mb-4 px-4 py-2 border rounded-lg
          focus:outline-none focus:ring-2 focus:ring-red-600
          dark:bg-gray-800 dark:border-gray-700 dark:text-white"
        />

        {/* Password */}
        <label className="text-sm text-gray-600 dark:text-gray-300">
          Password
        </label>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mt-1 mb-6 px-4 py-2 border rounded-lg
            focus:outline-none focus:ring-2 focus:ring-red-600
            dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 text-xs text-gray-500"
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-lg transition disabled:opacity-50"
        >
          {loading ? 'Please wait...' : isLogin ? 'Login' : 'Register'}
        </button>

        {/* Toggle Login/Register */}
        <p className="text-center mt-6 text-sm text-gray-500 dark:text-gray-400">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}

          <button
            onClick={() => setIsLogin(!isLogin)}
            className="ml-2 text-red-600 font-semibold hover:underline"
          >
            {isLogin ? 'Register' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
