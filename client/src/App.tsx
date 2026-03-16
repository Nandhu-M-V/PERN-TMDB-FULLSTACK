import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
import ProtectedRoute from './components/ProtectedRoute';
import Profile from './pages/Profile';
import AddMedia from './pages/AddMedia';
import LoginPage from './pages/LoginPage';

const App = () => {
  return (
    <Router>
      {/* Toast notifications */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        theme="dark"
        newestOnTop
      />

      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />

          <Route path="movies/discover" element={<Movies />} />
          <Route path="tvshow/discover" element={<TvShows />} />

          <Route
            path="movies/edit/:id"
            element={
              <ProtectedRoute>
                <EditMovie />
              </ProtectedRoute>
            }
          />
          <Route
            path="tvshow/edit/:id"
            element={
              <ProtectedRoute>
                <EditTvShow />
              </ProtectedRoute>
            }
          />

          <Route
            path="media/add"
            element={
              <ProtectedRoute>
                <AddMedia />
              </ProtectedRoute>
            }
          />

          <Route path="movie/:id/:title" element={<MovieDetail />} />
          <Route path="tv/:id/:name" element={<TvDetail />} />

          <Route path="login" element={<LoginPage />} />

          <Route
            path="profile"
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
