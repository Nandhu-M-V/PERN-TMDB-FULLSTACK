import { useNavigate } from 'react-router-dom';

const ClearLocalStorageButton = () => {
  const navigate = useNavigate();

  const handleClear = () => {
    localStorage.removeItem('editedMovies');
    localStorage.removeItem('editedTvShows');
    alert('All edited data cleared!');
    navigate('/');
  };

  return <button onClick={handleClear}>Clear Data</button>;
};

export default ClearLocalStorageButton;
