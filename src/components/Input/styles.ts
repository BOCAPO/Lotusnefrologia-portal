import { Colors } from 'configs/Colors_default';

export const styles = {
  inputContent: {
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.input.borderColor,
    height: 48,
    paddingHorizontal: 16
  },
  inputContentError: {
    borderColor: Colors.inputError.borderColor,
    color: Colors.redInvalid
  },
  messageError: {
    width: '100%',
    fontSize: 12,
    color: Colors.redInvalid
  }
};
