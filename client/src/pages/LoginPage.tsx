import { login } from '../api/auth';
import { useAuth } from '@/context/authContext';

const Login = () => {
  const { setUser } = useAuth();

  const handleLogin = async () => {
    const data = await login('test@test.com', 'password');

    setUser(data.user);
  };

  return <button onClick={handleLogin}>Login</button>;
};

export default Login;
