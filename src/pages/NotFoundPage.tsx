import type { FC } from 'react';
import { Link } from 'react-router-dom';

export const NotFoundPage: FC = () => (
  <div>
    <h1 className="page-title">Страница не найдена</h1>
    <p className="page-subtitle">
      Возможно, страница была перемещена или вы ошиблись при вводе адреса.
    </p>
    <p>
      <Link to="/">Вернуться на главную</Link>
    </p>
  </div>
);

