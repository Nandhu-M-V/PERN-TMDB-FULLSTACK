import { useAuth0 } from '@auth0/auth0-react';
import { useTranslation } from 'react-i18next';

const LoginButton = () => {
  const { t } = useTranslation();

  const { loginWithRedirect } = useAuth0();
  return (
    <>
      {
        <button className="cursor-pointer" onClick={() => loginWithRedirect()}>
          {t('login')}
        </button>
      }
    </>
  );
};

export default LoginButton;
