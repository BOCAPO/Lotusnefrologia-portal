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
  | 'onLine'
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
    minWidth: '155px',
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
    minWidth: '155px',
    borderRadius: '3px',
    fontFamily: Fonts.primary.regular,
    fontSize: '12px'
  },
  cancelButton: {
    backgroundColor: Colors.button.cancel.grayLight,
    color: Colors.button.secondary.gray90,
    width: '100%',
    height: '50px',
    maxHeight: '50px',
    minWidth: '155px',
    border: 'none',
    borderRadius: '3px',
    fontFamily: Fonts.primary.regular,
    fontSize: '12px'
  },
  dangerButton: {
    backgroundColor: Colors.white,
    color: Colors.redInvalid,
    width: '100%',
    height: '40px',
    borderSize: '1px',
    borderColor: Colors.redInvalid,
    borderRadius: '6px',
    minWidth: '155px',
    fontWeight: 'bold',
    fontFamily: Fonts.primary.regular
  },
  onLineButton: {
    backgroundColor: Colors.button.onLine.greenLight2,
    color: Colors.button.onLine.white,
    width: '100%',
    height: '50px',
    maxheight: '50px',
    border: 'none',
    minWidth: '155px',
    borderRadius: '3px',
    fontFamily: Fonts.primary.regular,
    fontSize: '15px',
    fontWeight: 'bold'
  }
};
