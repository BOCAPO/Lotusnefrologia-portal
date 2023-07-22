import LogoAssistance from 'assets/images/icons/1x/assistance_1.png';
import LogoAssistanceAlternative from 'assets/images/icons/1x/assistance_alternative.png';
import LogoChat from 'assets/images/icons/1x/chat_1.png';
import LogoChatAlternative from 'assets/images/icons/1x/chat_alternative.png';
import LogoExams from 'assets/images/icons/1x/exams_1.png';
import LogoExamsAlternative from 'assets/images/icons/1x/exams_alternative.png';
import LogoFinancial from 'assets/images/icons/1x/financial_1.png';
import LogoFinancialAlternative from 'assets/images/icons/1x/financial_alternative.png';
import LogoHome from 'assets/images/icons/1x/home_1.png';
import LogoHomeAlternative from 'assets/images/icons/1x/home_alternative.png';
import LogoNutrition from 'assets/images/icons/1x/nutrition_1.png';
import LogoNutritionAlternative from 'assets/images/icons/1x/nutrition_alternative.png';
import LogoSchedules from 'assets/images/icons/1x/schedules_1.png';
import LogoSchedulesAlternative from 'assets/images/icons/1x/schedules_alternative.png';
import LogoStock from 'assets/images/icons/1x/stock_1.png';
import LogoStockAlternative from 'assets/images/icons/1x/stock_alternative.png';
import { MenuModel } from 'models/Menu';

export const menus: MenuModel[] = [
  {
    idMenu: 1,
    title: 'Home',
    image: LogoHome,
    alternativeImage: LogoHomeAlternative,
    link: '/home',
    internalMenus: null
  },
  {
    idMenu: 2,
    title: 'Agendamentos',
    image: LogoSchedules,
    alternativeImage: LogoSchedulesAlternative,
    link: '/schedules',
    internalMenus: null
  },
  {
    idMenu: 3,
    title: 'Exames',
    image: LogoExams,
    alternativeImage: LogoExamsAlternative,
    link: '/exams',
    internalMenus: null
  },
  {
    idMenu: 4,
    title: 'Nutrição',
    image: LogoNutrition,
    alternativeImage: LogoNutritionAlternative,
    link: '/nutrition',
    internalMenus: null
  },
  {
    idMenu: 5,
    title: 'Financeiro',
    image: LogoFinancial,
    alternativeImage: LogoFinancialAlternative,
    link: '/financial',
    internalMenus: null
  },
  {
    idMenu: 6,
    title: 'Assistencial',
    image: LogoAssistance,
    alternativeImage: LogoAssistanceAlternative,
    link: '/assistance',
    internalMenus: null
  },
  {
    idMenu: 7,
    title: 'Estoque',
    image: LogoStock,
    alternativeImage: LogoStockAlternative,
    link: '/stock',
    internalMenus: null
  },
  {
    idMenu: 8,
    title: 'Chat',
    image: LogoChat,
    alternativeImage: LogoChatAlternative,
    link: '/chat',
    internalMenus: null
  }
];
