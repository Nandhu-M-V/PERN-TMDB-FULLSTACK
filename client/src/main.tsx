import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { Provider } from 'react-redux';
import { store } from './Redux/store/store.ts';
import './utils/i18n.ts';
import { AuthProvider } from './components/auth/AuthProvider.tsx';

// import { Auth0Provider } from '@auth0/auth0-react';

const domain = import.meta.env.VITE_AUTH_DOMAIN;
const client = import.meta.env.VITE_AUTH_CLIENT;

if (!domain || !client) {
  throw new Error('Auth0 environment variables are missing');
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <Provider store={store}>
        <App />
      </Provider>
    </AuthProvider>
  </StrictMode>
);
