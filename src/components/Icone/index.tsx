'use client';

import { PropsWithChildren, useState } from 'react';
import {
  FiBell,
  FiExternalLink,
  FiEye,
  FiEyeOff,
  FiMoreVertical,
  FiSearch,
  FiUser
} from 'react-icons/fi';

type Props = PropsWithChildren<{
  className?: string;
  style?: object;
  typeIcon?: object;
  color: string;
  size: number;
  callback?: (_click: boolean) => void;
}>;

export function Icon(props: Props): JSX.Element {
  const {
    typeIcon,
    size,
    color,
    callback = () => {
      return;
    }
  } = props;
  return getIcon(typeIcon, size, color, callback)!;
}

function getIcon(
  typeIcon: any,
  size: number,
  color: string,
  callback: (_click: boolean) => void
): JSX.Element | void {
  const [click, setClick] = useState(true);

  const buttonClick = (click: boolean) => {
    setClick(click);
    callback(click);
  };

  return (
    <typeIcon.icon
      name={click ? typeIcon.icon : typeIcon.alternativeIcon}
      size={size}
      color={color}
      onClick={() => buttonClick(!click)}
    />
  );
}

export const TypeIcon = {
  Password: {
    icon: FiEye,
    alternativeIcon: FiEyeOff
  },
  UserLogged: {
    icon: FiUser,
    alternativeIcon: null
  },
  Notification: {
    icon: FiBell,
    alternativeIcon: null
  },
  More: {
    icon: FiMoreVertical,
    alternativeIcon: null
  },
  Search: {
    icon: FiSearch,
    alternativeIcon: null
  },
  ExternalLink: {
    icon: FiExternalLink,
    alternativeIcon: null
  }
};
