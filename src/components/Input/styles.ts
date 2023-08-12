import { Colors } from 'configs/Colors_default';

export const styles = {
  inputContent: {
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.input.borderColor,
    height: 40,
    paddingHorizontal: 16
  },
  inputContentError: {
    borderColor: Colors.inputError.borderColor,
    color: Colors.redInvalid
  },
  input: {
    width: '100%',
    height: '60px',
    fontSize: 16,
    border: '1px solid #E5E5E5',
    borderRadius: '6px',
    padding: '5%'
  },
  iconContainer: {}
};
