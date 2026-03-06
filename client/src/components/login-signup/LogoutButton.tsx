// import { useAuth0 } from '@auth0/auth0-react';
import { useTranslation } from 'react-i18next';

const LogoutButton = () => {
  //   const { logout } = useAuth0();
  const { t } = useTranslation();

  return (
    <button
      onClick={() => alert('Logout functionality is currently disabled.')}
      className="cursor-pointer"
    >
      {t('logout')}
    </button>
  );
};

export default LogoutButton;
