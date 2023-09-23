export type DataDishesModel = {
  id?: number;
  name: string;
  unit_id: number;
  category_id: number;
  description: string;
  isFixed: boolean;
  file: string;
  status: number | boolean;
};
