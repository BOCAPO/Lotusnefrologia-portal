import { StaticImageData } from 'next/image';

export type MenuModel = {
  idMenu: number;
  title: string;
  image: StaticImageData;
  alternativeImage: StaticImageData;
  link: string;
  internalMenus: MenuModel[] | null;
};
