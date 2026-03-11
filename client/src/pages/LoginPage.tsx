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

  const handleSubmit = async () => {
    try {
      setError('');

      const data = isLogin
        ? await login(email, password)
        : await register(email, password);

      setUser(data.user);

      console.log('Auth data:', data);

      navigate('/');
    } catch (err) {
      console.error(err);
      setError(isLogin ? 'Login failed' : 'Register failed');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen dark:bg-black bg-red-300">
      <div className="w-full max-w-md p-8 bg-red-500/70 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">
          {isLogin ? 'Login' : 'Register'}
        </h2>

        {error && (
          <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-700"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-6 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-700"
        />

        <button
          onClick={handleSubmit}
          className="w-full bg-red-800 border-white border py-2 rounded-lg hover:bg-red-900 transition"
        >
          {isLogin ? 'Login' : 'Register'}
        </button>

        <p className="text-center mt-4 text-sm">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="ml-2 text-red-900 font-semibold hover:underline"
          >
            {isLogin ? 'Register' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
