import type { FC } from 'react';
import { Link } from 'react-router-dom';

import { useAuth } from '../../../features/auth/model/AuthContext';
import { AvatarMenu } from '../../../layouts/app-layout/AvatarMenu';
import styles from './Header.module.scss';

export const Header: FC = () => {
  const { user, logout } = useAuth();

  return (
    <header className={styles.header}>
      <div className={styles.headerInner}>
        <Link to="/" className={styles.logo}>
          EduVox
        </Link>
        <nav className={styles.nav}>
          <Link to="/courses" className={styles.navLink}>
            Курсы
          </Link>
          {user ? (
            <AvatarMenu user={user} onLogout={logout} />
          ) : (
            <>
              <Link to="/login" className={styles.navLink}>
                Вход
              </Link>
              <Link to="/register" className={styles.navLink}>
                Регистрация
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};
