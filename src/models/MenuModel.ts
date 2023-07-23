import { StaticImageData } from 'next/image';

export type MenuModel = {
  idMenu: number;
  title: string;
  image: StaticImageData | null;
  alternativeImage: StaticImageData | null;
  link: string | null;
  internalMenus: MenuModel[] | null;
};
