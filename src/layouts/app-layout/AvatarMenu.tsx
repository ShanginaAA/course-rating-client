import type { FC } from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useClick, useDismiss, useFloating, useInteractions, useRole } from '@floating-ui/react';

import type { User } from '../../shared/types/domain';
import styles from './AppLayout.module.scss';

import moaiAvatar from '../../assets/img/avatars/moai.png';

type AvatarMenuProps = {
  user: User;
  onLogout: () => void;
};

export const AvatarMenu: FC<AvatarMenuProps> = ({ user, onLogout }) => {
  const [open, setOpen] = useState(false);

  const { refs, floatingStyles, context } = useFloating({
    open,
    onOpenChange: setOpen,
    placement: 'bottom-end',
  });

  const click = useClick(context);
  const dismiss = useDismiss(context, { outsidePress: true });
  const role = useRole(context, { role: 'menu' });
  const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss, role]);

  const handleLogout = () => {
    setOpen(false);
    onLogout();
  };

  return (
    <div className={styles.avatarWrap}>
      <button
        ref={refs.setReference}
        type="button"
        className={styles.avatarButton}
        aria-expanded={open}
        aria-haspopup="menu"
        {...getReferenceProps()}
      >
        <img src={moaiAvatar} alt="" className={styles.avatarImg} />
      </button>
      {open && (
        <div
          ref={refs.setFloating}
          style={floatingStyles}
          className={styles.popper}
          {...getFloatingProps()}
        >
          <span className={styles.popperItemTitle}>{user.name}</span>
          <Link to="/profile" className={styles.popperItem} onClick={() => setOpen(false)}>
            Профиль
          </Link>
          <button type="button" className={styles.popperItem} onClick={handleLogout}>
            Выход
          </button>
        </div>
      )}
    </div>
  );
};
