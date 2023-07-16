import { useMemo } from 'react';

import { TypesButton, styles } from './style';

type Props = {
  title: string;
  isLoading?: boolean;
  type?: TypesButton;
};

export function Button({
  title,
  isLoading = false,
  type = 'button',
  ...rest
}: Props) {
  const stylesButton = useMemo(() => {
    if (type === 'button') {
      return styles.button;
    } else if (type === 'reset') {
      return styles.resetButton;
    } else if (type === 'primary') {
      return styles.primaryButton;
    } else {
      return styles.secondaryButton;
    }
  }, [type]);

  return (
    <button style={stylesButton} disabled={isLoading} {...rest}>
      {isLoading ? 'Carregando...' : title}
    </button>
  );
}
