'use client';

import { PropsWithChildren, useState } from 'react';
import {
  FiBell,
  FiCalendar,
  FiChevronLeft,
  FiChevronRight,
  FiChevronsLeft,
  FiChevronsRight,
  FiClock,
  FiDownload,
  FiEdit,
  FiExternalLink,
  FiEye,
  FiEyeOff,
  FiMapPin,
  FiMaximize2,
  FiMinimize2,
  FiMoreVertical,
  FiPlus,
  FiSearch,
  FiSend,
  FiUpload,
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
      name={
        click || typeIcon.alternativeVersion !== null
          ? typeIcon.icon
          : typeIcon.alternativeIcon
      }
      size={size}
      color={color}
      onClick={() => buttonClick(!click)}
    />
  );
}

export const TypeIcon = {
  Password: {
    icon: FiEye,
    alternativeIcon: null
  },
  PasswordOff: {
    icon: FiEyeOff,
    alternativeIcon: null
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
  },
  Add: {
    icon: FiPlus,
    alternativeIcon: null
  },
  Clock: {
    icon: FiClock,
    alternativeIcon: null
  },
  MapPin: {
    icon: FiMapPin,
    alternativeIcon: null
  },
  Download: {
    icon: FiDownload,
    alternativeIcon: null
  },
  Edit: {
    icon: FiEdit,
    alternativeIcon: null
  },
  Upload: {
    icon: FiUpload,
    alternativeIcon: null
  },
  Calendar: {
    icon: FiCalendar,
    alternativeIcon: null
  },
  ArrowRight: {
    icon: FiChevronRight,
    alternativeIcon: null
  },
  ArrowLeft: {
    icon: FiChevronLeft,
    alternativeIcon: null
  },
  DoubleArrowRight: {
    icon: FiChevronsRight,
    alternativeIcon: null
  },
  DoubleArrowLeft: {
    icon: FiChevronsLeft,
    alternativeIcon: null
  },
  Maximize: {
    icon: FiMaximize2,
    alternativeIcon: null
  },
  Minimize: {
    icon: FiMinimize2,
    alternativeIcon: null
  },
  Send: {
    icon: FiSend,
    alternativeIcon: null
  }
};
