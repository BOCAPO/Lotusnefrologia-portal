import { ReactNode, useMemo } from 'react';

import stylesBtn from './button.module.css';

import { TypesButton, styles } from './styles';

type Props = {
  title: string;
  isLoading?: boolean;
  type?: TypesButton;
  style?: React.CSSProperties;
  icon?: ReactNode; // Defina a prop "icon" como tipo ReactNode
  onClick?: () => void;
};

export function Button({
  title,
  isLoading = false,
  type = 'button',
  icon,
  ...rest
}: Props) {
  const stylesButton = useMemo(() => {
    if (type === 'button') {
      return styles.button;
    } else if (type === 'cancel') {
      return styles.cancelButton;
    } else if (type === 'reset') {
      return styles.resetButton;
    } else if (type === 'primary') {
      return styles.primaryButton;
    } else if (type === 'danger') {
      return styles.dangerButton;
    } else {
      return styles.secondaryButton;
    }
  }, [type]);

  const classButton = useMemo(() => {
    if (type === 'button') {
      return stylesBtn.button;
    } else if (type === 'cancel') {
      return stylesBtn.cancelButton;
    } else if (type === 'reset') {
      return stylesBtn.resetButton;
    } else if (type === 'primary') {
      return stylesBtn.primaryButton;
    } else if (type === 'danger') {
      return stylesBtn.dangerButton;
    } else {
      return stylesBtn.secondaryButton;
    }
  }, [type]);

  return (
    <button
      style={stylesButton}
      disabled={isLoading}
      {...rest}
      className={classButton}
    >
      {icon && <span>{icon}</span>}
      {isLoading ? 'Carregando...' : title}
    </button>
  );
}
