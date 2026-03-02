import type { FC } from 'react';
import { Outlet } from 'react-router-dom';

import { Header } from '../../components/layout/header/Header';
import { Footer } from '../../components/layout/footer/Footer';
import styles from './AppLayout.module.scss';

export const AppLayout: FC = () => (
  <div className={styles.shell}>
    <Header />
    <main className={styles.content}>
      <Outlet />
    </main>
    <Footer />
  </div>
);
