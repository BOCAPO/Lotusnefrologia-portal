export type DataDishesModel = {
  id?: number;
  name: string;
  unit_id: number;
  category_id: number;
  description: string;
  isFixed: boolean;
  file: string;
  status: number | boolean;
  photo_path?: string;
  photo_change?: boolean;
};

export type DataDishesPerDayModel = {
  id?: number;
  name: string;
  unit_id: number;
  category_id: number;
  isFixed: boolean;
  description: string;
  photo_path?: string;
  photo_extension?: string;
  status: number | boolean;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
  pivot: {
    menu_id: number;
    dishe_id: number;
  };
  category?: {
    id: number;
    name: string;
    status: number | boolean;
    created_at?: string;
    updated_at?: string;
  };
};
