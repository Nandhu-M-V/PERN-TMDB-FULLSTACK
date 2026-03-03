import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { Provider } from 'react-redux';
import { store } from './app/store.ts';
import './utils/i18n.ts';

import { Auth0Provider } from '@auth0/auth0-react';

const domain = import.meta.env.VITE_AUTH_DOMAIN;
const client = import.meta.env.VITE_AUTH_CLIENT;

if (!domain || !client) {
  throw new Error('Auth0 environment variables are missing');
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Auth0Provider
      domain={domain}
      clientId={client}
      authorizationParams={{
        redirect_uri: window.location.origin,
      }}
      cacheLocation="localstorage"
      useRefreshTokens={true}
    >
      <Provider store={store}>
        <App />
      </Provider>
    </Auth0Provider>
  </StrictMode>
);
