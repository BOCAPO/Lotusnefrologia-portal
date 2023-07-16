type MaskProps =
  | 'coin'
  | 'date'
  | 'cpfCnpj'
  | 'phone'
  | 'cellPhone'
  | 'cep'
  | 'onlyLetters';

type Props = {
  mask: MaskProps | null;
  error?: string | null;
  label?: string;
  name: string;
  containerStyle?: object;
  inputRef?: React.RefObject<HTMLInputElement>;
  getValue?: (_text: string) => void;
  control: Control;
};
