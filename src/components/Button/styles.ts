import { Colors } from 'configs/Colors_default';
import { Fonts } from 'configs/Fonts_default';

export type TypesButton =
  | 'button'
  | 'submit'
  | 'reset'
  | 'primary'
  | 'secondary'
  | 'danger'
  | 'success'
  | 'cancel';

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
    width: '100%',
    height: '60px',
    border: 'none',
    borderRadius: '6px',
    fontSize: '18px',
    minwidth: '130px',
    fontWeight: 'bold',
    fontFamily: Fonts.primary.regular,
    hover: {
      opacity: 0.2
    }
  },
  secondaryButton: {
    backgroundColor: Colors.button.secondary.greenLight,
    color: Colors.button.secondary.gray90,
    width: '100%',
    height: '100%',
    maxHeight: '40px',
    border: 'none',
    minwidth: '130px',
    borderRadius: '3px',
    fontFamily: Fonts.primary.regular,
    fontSize: '12px'
  },
  cancelButton: {
    backgroundColor: Colors.button.cancel.grayLight,
    color: Colors.button.secondary.gray90,
    width: '100%',
    height: '100%',
    maxHeight: '40px',
    minwidth: '130px',
    border: 'none',
    borderRadius: '3px',
    fontFamily: Fonts.primary.regular,
    fontSize: '12px'
  }
};
