import React, { PropsWithChildren } from 'react';
import { FaFontAwesome } from 'react-icons/fa';

type Props = PropsWithChildren<{
  className?: string;
  style?: object;
  typeIcon?: object;
  size: number;
  callback?: (_click: boolean) => void;
}>;

export function Icon(props: Props): JSX.Element {
  const {
    typeIcon,
    size,
    callback = () => {
      return;
    }
  } = props;
  return getIcon(typeIcon, size, callback)!;
}

function getIcon(
  typeIcon: any,
  size: number,
  callback: (_click: boolean) => void
): JSX.Element | void {
  const [click, setClick] = React.useState(true);

  const buttonClick = (click: boolean) => {
    setClick(click);
    callback(click);
  };

  return (
    <typeIcon.typeFont
      name={click ? typeIcon.icon : typeIcon.alternativeIcon}
      size={size}
      onClick={() => buttonClick(!click)}
    />
  );
}

export const TypeIcon = {
  Password: {
    icon: 'eye',
    alternativeIcon: 'eye-slash',
    typeFont: FaFontAwesome
  }
};
