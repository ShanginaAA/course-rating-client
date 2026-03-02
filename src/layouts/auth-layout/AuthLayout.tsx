import type { FC } from 'react';
import { Link, Outlet } from 'react-router-dom';

import styles from './AuthLayout.module.scss';

const AuthLayout: FC = () => (
  <div className={styles.authLayout}>
    <Link to="/" className={styles.homeLink} title="Перейти на главную страницу">
      {/* <span className={styles.homeLinkIcon} aria-hidden>⌂</span> */}
      На главную
    </Link>
    <Outlet />
  </div>
);

export default AuthLayout;
