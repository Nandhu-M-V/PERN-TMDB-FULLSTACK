import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="h-50 m-40">
      <h1 className="text-7xl">404 - Page Not Found</h1>
      <button
        className="w-fit bg-red-700 text-left px-4 py-2
                   hover:bg-red-200 hover:text-red-700
                   transition rounded-md border-red-900"
        onClick={() => navigate('/')}
      >
        Go Home
      </button>
    </div>
  );
};

export default NotFound;
