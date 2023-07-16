import { Colors } from 'configs/Colors_default';

export type TypesButton =
  | 'button'
  | 'submit'
  | 'reset'
  | 'primary'
  | 'secondary'
  | 'danger'
  | 'success';

export const styles = {
  button: {
    backgroundColor: 'transparent',
    height: '60px',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '6px'
  },
  resetButton: {
    backgroundColor: Colors.button.reset.lightGray,
    color: Colors.button.reset.gray90
  },
  primaryButton: {
    backgroundColor: Colors.button.primary.greenDark,
    color: '#fff',
    hover: {
      opacity: 0.8
    }
  },
  secondaryButton: {
    backgroundColor: Colors.button.secondary.greenLight,
    color: Colors.button.secondary.gray90
  }
};
