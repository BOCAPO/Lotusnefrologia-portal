import { ReactNode, useMemo } from 'react';

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

  return (
    <button style={stylesButton} disabled={isLoading} {...rest}>
      {icon && <span>{icon}</span>}
      {isLoading ? 'Carregando...' : title}
    </button>
  );
}
