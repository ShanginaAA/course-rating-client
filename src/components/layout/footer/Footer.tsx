import type { FC } from 'react';
import { Link } from 'react-router-dom';

import styles from './Footer.module.scss';

export const Footer: FC = () => (
  <footer className={styles.footer}>
    <div className={styles.footerInner}>
      <div className={styles.footerBrand}>
        <h3 className={styles.footerTitle}>
          Помогаем выбрать лучшее
          <br />
          образование на основе честных
          <br />
          отзывов и рейтингов
        </h3>
        <p className={styles.footerSubtitle}>Присоединяйся к сообществу!</p>
      </div>

      <div className={styles.footerColumns}>
        <div className={styles.footerColumn}>
          <span className={styles.footerColumnTitle}>Поддержка</span>
          <Link to="/faq" className={styles.footerLink}>
            FAQ
          </Link>
          <Link to="/rules" className={styles.footerLink}>
            Правила
          </Link>
        </div>

        <div className={styles.footerColumn}>
          <span className={styles.footerColumnTitle}>Контакты</span>
          <a href="https://t.me" target="_blank" rel="noreferrer" className={styles.footerLink}>
            Telegram
          </a>
          <a href="mailto:hello@eduvox.ru" className={styles.footerLink}>
            Email
          </a>
        </div>
      </div>
    </div>

    <div className={styles.footerBottom}>
      <span>©2026 EduVox. All Rights Reserved.</span>
    </div>
  </footer>
);
