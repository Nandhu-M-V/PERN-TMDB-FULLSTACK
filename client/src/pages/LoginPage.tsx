import { useState } from 'react';
import { login, register } from '../api/auth';
import { useAuth } from '@/context/useAuth';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const { setUser } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      setError('');

      const data = await login(email, password);

      setUser(data.user);

      navigate('/');
      console.log('Logged data:', data);
    } catch (err: unknown) {
      console.error(err);
      setError('Login failed');
    }
  };

  const handleRegister = async () => {
    try {
      setError('');

      const data = await register(email, password);

      setUser(data.user);

      console.log('Registered:', data.user);
    } catch (err) {
      console.error(err);
      setError('Register failed');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen dark:bg-black bg-gray-100">
      <div className="w-full max-w-md p-8 bg-purple-500/70 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

        {error && (
          <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-6 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <div className="flex gap-3">
          <button
            onClick={handleLogin}
            className="flex-1 bg-purple-800  border-white border  py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Login
          </button>

          <button
            onClick={handleRegister}
            className="flex-1 bg-white text-black border-black hover:border-white border hover:text-white  py-2 rounded-lg hover:bg-purple-800 transition"
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
