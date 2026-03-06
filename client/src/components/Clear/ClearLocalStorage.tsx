import { useNavigate } from 'react-router-dom';

const ClearLocalStorageButton = () => {
  const navigate = useNavigate();

  const handleClear = () => {
    localStorage.removeItem('editedMovies');
    localStorage.removeItem('editedTvShows');
    alert('All edited data cleared!');
    navigate('/');
  };

  return (
    <button
      disabled={true}
      className="disabled:cursor-not-allowed"
      onClick={handleClear}
    >
      Clear Data
    </button>
  );
};

export default ClearLocalStorageButton;
