export type DataUnitsModel = {
  id?: number;
  cnpj: string;
  name: string;
  responsible: string;
  email: string;
  phone_primary: string;
  phone_secondary: string;
  latitude: string;
  longitude: string;
  zip_code: string;
  city_code: string;
  street: string;
  number: string;
  block: string;
  lot: string;
  complement: string | null;
  facebook_link: string | null;
  instagram_link: string | null;
  site_link: string | null;
  status: number;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
  city_name: string | null;
  state_name: string | null;
  city?: {
    code: string;
    state_code: string;
    description: string;
    state: {
      code: string;
      UF: string;
      description: string;
      region: string;
    };
  };
};
