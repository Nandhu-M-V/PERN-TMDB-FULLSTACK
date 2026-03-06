import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Layout from './components/Layout';
import Movies from './pages/Movies';
import TvShows from './pages/TvShows';
import MovieDetail from './pages/MovieDetails';
import TvDetail from './pages/TvDetail';
import EditMovie from './pages/EditMovies';
import EditTvShow from './pages/EditTvShows';
import FilterResultsPage from './pages/Filter';
import NotFound from './pages/NotFound';
import Login from './pages/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';
import Profile from './pages/Profile';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="movies/discover" element={<Movies />} />
          <Route path="tvshow/discover" element={<TvShows />} />
          <Route index element={<Home />} />
          <Route path="movies/edit/:id" element={<EditMovie />} />
          <Route path="tvshow/edit/:id" element={<EditTvShow />} />
          <Route path="/movie/:id/:title" element={<MovieDetail />} />
          <Route path="tv/:id/:name" element={<TvDetail />} />
          <Route path="login" element={<Login />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route path="filter" element={<FilterResultsPage />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
