import LogoChat from 'assets/images/icons/1x/chat_1.png';
import LogoChatAlternative from 'assets/images/icons/1x/chat_alternative.png';
import LogoExams from 'assets/images/icons/1x/exams_1.png';
import LogoExamsAlternative from 'assets/images/icons/1x/exams_alternative.png';
import LogoHome from 'assets/images/icons/1x/home_1.png';
import LogoHomeAlternative from 'assets/images/icons/1x/home_alternative.png';
import LogoNutrition from 'assets/images/icons/1x/nutrition_1.png';
import LogoNutritionAlternative from 'assets/images/icons/1x/nutrition_alternative.png';
import LogoSchedules from 'assets/images/icons/1x/schedules_1.png';
import LogoSchedulesAlternative from 'assets/images/icons/1x/schedules_alternative.png';
import { MenuModel } from 'models/MenuModel';

export const menusMain: MenuModel[] = [
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
    link: null,
    internalMenus: [
      {
        idMenu: 9,
        title: 'Calendário de Consultas',
        image: null,
        alternativeImage: null,
        link: '/schedules/calendar',
        internalMenus: null
      },
      {
        idMenu: 10,
        title: 'Histórico de Consultas',
        image: null,
        alternativeImage: null,
        link: '/schedules/history',
        internalMenus: null
      },
      {
        idMenu: 11,
        title: 'Consultas',
        image: null,
        alternativeImage: null,
        link: '/schedules/appointment',
        internalMenus: null
      },
      {
        idMenu: 19,
        title: 'Escala de Consultas',
        image: null,
        alternativeImage: null,
        link: '/schedules/scale',
        internalMenus: null
      }
    ]
  },
  {
    idMenu: 3,
    title: 'Exames',
    image: LogoExams,
    alternativeImage: LogoExamsAlternative,
    link: null,
    internalMenus: [
      // {
      //   idMenu: 12,
      //   title: 'Cadastrar Exames',
      //   image: null,
      //   alternativeImage: null,
      //   link: '/exams/register',
      //   internalMenus: null
      // },
      {
        idMenu: 13,
        title: 'Consultar de Exames',
        image: null,
        alternativeImage: null,
        link: '/exams',
        internalMenus: null
      }
    ]
  },
  {
    idMenu: 4,
    title: 'Nutrição',
    image: LogoNutrition,
    alternativeImage: LogoNutritionAlternative,
    link: null,
    internalMenus: [
      {
        idMenu: 14,
        title: 'Pedidos da Cozinha',
        image: null,
        alternativeImage: null,
        link: '/nutrition/kitchen',
        internalMenus: null
      },
      {
        idMenu: 15,
        title: 'Cadastro de Produtos',
        image: null,
        alternativeImage: null,
        link: '/nutrition/products',
        internalMenus: null
      },
      {
        idMenu: 16,
        title: 'Cadastro de Nota Fiscal',
        image: null,
        alternativeImage: null,
        link: '/nutrition/include-invoice',
        internalMenus: null
      },
      {
        idMenu: 17,
        title: 'Cadastro de Cardápio',
        image: null,
        alternativeImage: null,
        link: '/nutrition/include-menu',
        internalMenus: null
      },
      {
        idMenu: 18,
        title: 'Planejar Cardápio',
        image: null,
        alternativeImage: null,
        link: '/nutrition/plan-menu',
        internalMenus: null
      }
    ]
  },
  // {
  //   idMenu: 5,
  //   title: 'Financeiro',
  //   image: LogoFinancial,
  //   alternativeImage: LogoFinancialAlternative,
  //   link: null,
  //   internalMenus: null
  // },
  // {
  //   idMenu: 6,
  //   title: 'Assistencial',
  //   image: LogoAssistance,
  //   alternativeImage: LogoAssistanceAlternative,
  //   link: null,
  //   internalMenus: null
  // },
  // {
  //   idMenu: 7,
  //   title: 'Estoque',
  //   image: LogoStock,
  //   alternativeImage: LogoStockAlternative,
  //   link: null,
  //   internalMenus: null
  // },
  {
    idMenu: 8,
    title: 'Chat',
    image: LogoChat,
    alternativeImage: LogoChatAlternative,
    link: null,
    internalMenus: null
  }
];

export const menusAdmin: MenuModel[] = [
  {
    idMenu: 1,
    title: 'Unidades',
    image: null,
    alternativeImage: null,
    link: '/admin/units/list',
    internalMenus: null
  },
  // {
  //   idMenu: 2,
  //   title: 'Perfil de Acesso',
  //   image: null,
  //   alternativeImage: null,
  //   link: '/admin/roles/new',
  //   internalMenus: null
  // },
  {
    idMenu: 3,
    title: 'Usuários',
    image: null,
    alternativeImage: null,
    link: '/admin/users/list',
    internalMenus: null
  },
  {
    idMenu: 4,
    title: 'Especialidades',
    image: null,
    alternativeImage: null,
    link: '/admin/specialties/new',
    internalMenus: null
  },
  {
    idMenu: 5,
    title: 'Especialistas',
    image: null,
    alternativeImage: null,
    link: '/admin/specialists/list',
    internalMenus: null
  },
  {
    idMenu: 6,
    title: 'Pacientes',
    image: null,
    alternativeImage: null,
    link: '/admin/patients/list',
    internalMenus: null
  }
];

export const menusProfile: MenuModel[] = [
  {
    idMenu: 1,
    title: 'Meus Dados',
    image: null,
    alternativeImage: null,
    link: '/personal/mydata/view',
    internalMenus: null
  },
  {
    idMenu: 2,
    title: 'Alterar Senha',
    image: null,
    alternativeImage: null,
    link: '/personal/change-password',
    internalMenus: null
  }
];
